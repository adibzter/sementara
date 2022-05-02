import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { zip } from 'fflate';

import { API_SERVER } from '../utils/config';

const Send = () => {
  const [message, setMessage] = useState('');
  const [uploadType, setUploadType] = useState('file');

  const dialogRef = useRef(null);
  const formRef = useRef(null);
  const fileRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    formRef.current.onsubmit = async (e) => {
      e.preventDefault();

      const data = await postForm();
      navigate(`/folder/${data.id}`);
    };
  }, []);

  function handleFileChange(e) {
    const files = e.target.files;
    console.log(files);
    checkFilesSizes(files);
  }

  function checkFilesSizes(files) {
    const limit = 20; // 20 MB
    let totalSize = 0;
    for (let file of files) {
      totalSize += file.size;
    }

    if (totalSize > limit * 1024 * 1024) {
      showDialog(`Total size of files must not exceed ${limit} MB`);
      setTimeout(() => {
        closeDialog();
      }, 3000);
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
    showDialog('Zipping files...');

    let files = fileRef.current.files;
    const file = await createZipFile(files);

    const data = new FormData();
    data.append('files', file);

    showDialog('Uploading files...');
    let res = await fetch(`${API_SERVER}/api/send`, {
      method: 'POST',
      body: data,
    });
    res = await res.text();
    res = JSON.parse(res);

    return res;
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
      <dialog ref={dialogRef}>{message}</dialog>

      <form ref={formRef}>
        {/* <h6>Select files</h6>
        <input
          type='file'
          name='files'
          onChange={handleFileChange}
          ref={fileRef}
          multiple
        /> */}
        <h6>Select Folder</h6>
        <input
          type='file'
          name='files'
          onChange={handleFileChange}
          ref={fileRef}
          webkitdirectory='true'
          multiple
        />
        <br />
        <br />
        <br />
        <input type='submit' value='Upload' />
      </form>
    </>
  );
};

export default Send;
