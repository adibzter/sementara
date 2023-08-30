import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { zip } from 'fflate';

import Navbar from '../components/Navbar';
import Center from '../components/Center';
import Button from '../components/Button';
import Loader from '../components/Loader';

import { API_SERVER } from '../utils/config';

import './styles/Send.css';

const Send = () => {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const dialogRef = useRef(null);
  const fileRef = useRef(null);

  const navigate = useNavigate();

  function handleUpload(type) {
    const input = fileRef.current;

    if (type === 'file') {
      input.removeAttribute('webkitdirectory');
    } else if (type === 'folder') {
      input.setAttribute('webkitdirectory', '');
    }

    input.click();
  }

  function handleFileChange(e) {
    const files = e.target.files;
    if (checkFilesSizes(files)) {
      postForm();
    }
  }

  function handleDragOverEvent(e) {
    if (e.target.id !== 'center') {
      return;
    }

    e.preventDefault();
    e.target.style.background = 'gray';
    e.target.style.border = 'dashed 3px white';
    e.target.style.transition = '0.2s';
  }

  function handleDragLeaveEvent(e) {
    if (e.target.id !== 'center') {
      return;
    }

    e.preventDefault();
    e.target.style.background = '';
    e.target.style.border = 'dashed 3px transparent';
  }

  function handleDropEvent(e) {
    if (e.target.id !== 'center') {
      return;
    }
    e.preventDefault();
    // const items = e.dataTransfer.items;
    // for (let item of items) {
    //   item = item.webkitGetAsEntry();
    //   if (item) {
    //     scanFiles(item);
    //   }
    // }
    e.target.style.background = '';
    e.target.style.border = 'dashed 3px transparent';

    const input = fileRef.current;
    const files = e.dataTransfer.files;
    input.files = files;

    const string = `Are you sure want to upload ${files.length} files(s)?`;
    if (window.confirm(string)) {
      if (checkFilesSizes(files)) {
        postForm();
      }
    } else {
      input.value = '';
    }
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/webkitGetAsEntry
  function scanFiles(item) {
    if (item.isFile) {
      item.file((file) => {
        const newFile = new File([file], file.name);
        file.webkitRelativePath = item.fullPath;
        console.log(file);
      });
    } else if (item.isDirectory) {
      let directoryReader = item.createReader();
      directoryReader.readEntries((entries) => {
        entries.forEach((entry) => {
          scanFiles(entry);
        });
      });
    }
  }

  function checkFilesSizes(files) {
    const limit = 20; // 20 MB
    let totalSize = 0;
    for (let file of files) {
      totalSize += file.size;
    }

    if (totalSize > limit * 1024 * 1024) {
      fileRef.current.value = '';
      showDialog(`Total size of files must not exceed ${limit} MB`);
      setTimeout(() => {
        closeDialog();
      }, 5000);

      return false;
    }

    return true;
  }

  function showDialog(message) {
    setMessage(message);
    dialogRef.current.show();
  }

  function closeDialog() {
    dialogRef.current.close();
  }

  async function postForm() {
    setMessage('Zipping files');
    setIsUploading(true);

    let files = fileRef.current.files;
    const infoFile = createInfoFile(files);

    let fileToUpload;
    if (files.length === 1) {
      fileToUpload = files[0];
    } else {
      fileToUpload = await createZipFile(files);
    }

    const data = new FormData();
    data.append('files', infoFile);
    data.append('files', fileToUpload);

    setMessage('Uploading files');

    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress((e.loaded / e.total) * 100);
      }
    };
    xhr.onloadend = () => {
      const res = JSON.parse(xhr.responseText);

      navigate(`/folder/${res.id}`);
    };
    xhr.open('POST', `${API_SERVER}/api/send`);
    xhr.send(data);
  }

  function createInfoFile(files) {
    const data = { type: '', filenames: [] };
    const isFolder = files[0].webkitRelativePath ? true : false;
    if (isFolder) {
      data.type = 'folder';
      const filename = files[0].webkitRelativePath.split('/')[0] + '.zip';
      data.filenames.push(filename);
    } else {
      data.type = 'file';
      for (let file of files) {
        data.filenames.push(file.name);
      }
    }

    const file = new File([JSON.stringify(data)], '.info');

    return file;
  }

  async function createZipFile(files) {
    const data = {};
    let archiveName = '';
    for (let file of files) {
      const webkitPath = file.webkitRelativePath.split('/');
      const filePath = webkitPath.slice(1).join('/') || file.name;
      archiveName = webkitPath[0] ? `${webkitPath[0]}.zip` : 'sementara.zip';

      data[filePath] = new Uint8Array(await file.arrayBuffer());
    }

    return new Promise((resolve, reject) => {
      zip(data, { level: 9, mem: 1 }, (err, data) => {
        if (err) {
          console.error(err);
        }
        const file = new File([data], archiveName, {
          type: 'application/zip',
        });
        resolve(file);
      });
    });
  }

  return (
    <>
      <Navbar />
      <div
        id='send-page'
        onDragOver={handleDragOverEvent}
        onDragLeave={handleDragLeaveEvent}
        onDrop={handleDropEvent}
      >
        <Center>
          {isUploading ? (
            <Loader>
              <>
                <h3>{message}</h3>
                <progress value={progress} max='100'></progress>
                {progress} %
              </>
            </Loader>
          ) : (
            <>
              <h2>Send Files</h2>
              <dialog ref={dialogRef}>{message}</dialog>
              <div>
                <Button onClick={() => handleUpload('file')}>
                  Upload Files
                </Button>
                <Button onClick={() => handleUpload('folder')}>
                  Upload Folder
                </Button>
              </div>

              <h4>or</h4>
              <h3>Drop files here</h3>
              <input
                type='file'
                name='files'
                onChange={handleFileChange}
                ref={fileRef}
                webkitdirectory='true'
                multiple
                required
                hidden
              />
            </>
          )}
        </Center>
      </div>
    </>
  );
};

export default Send;
