import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { zip } from 'fflate';

import Navbar from '../components/Navbar';
import Center from '../components/Center';
import Button from '../components/Button';
import Loader from '../components/Loader';

import { API_SERVER } from '../utils/config';

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
    checkFilesSizes(files);
  }

  function handleDropEvent(e) {
    e.preventDefault();

    const input = fileRef.current;
    const files = e.dataTransfer.files;
    input.files = files;

    const string = `Are you sure want to upload ${files.length} files(s)?`;
    if (window.confirm(string)) {
      checkFilesSizes(files);
    } else {
      input.value = '';
    }
  }

  function preventDefault(e) {
    e.preventDefault();
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
    } else {
      postForm();
    }
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
    const zipFile = await createZipFile(files);

    const data = new FormData();
    data.append('files', infoFile);
    data.append('files', zipFile);

    setMessage('Uploading files');

    // let res = await fetch(`${API_SERVER}/api/send`, {
    //   method: 'POST',
    //   body: data,
    // });
    // res = await res.text();
    // res = JSON.parse(res);
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
        onDragLeave={preventDefault}
        onDragOver={preventDefault}
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
