import { useState, useEffect, useRef } from 'react';

import QRCode from 'qrcode';

const Send = () => {
  // const [data, setData] = useState('');
  const [src, setSrc] = useState('');
  const [message, setMessage] = useState('');

  const dialogRef = useRef(null);
  const formRef = useRef(null);
  const fileRef = useRef(null);
  const qrRef = useRef(null);

  useEffect(() => {
    formRef.current.onsubmit = async (e) => {
      e.preventDefault();

      showDialog('Uploading Files...');
      const data = await postForm();
      const qrUrl = await QRCode.toDataURL(data, {
        errorCorrectionLevel: 'high',
      });
      setSrc(qrUrl);
      qrRef.current.hidden = false;

      showDialog('File Uploaded');
      setTimeout(() => {
        closeDialog();
      }, 3000);
    };
  }, []);

  function handleFileChange(e) {
    const files = e.target.files;
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
    let files = fileRef.current.files;

    const data = new FormData();
    for (let file of files) {
      data.append('files', file);
    }

    let res = await fetch('http://localhost:5000/api/send', {
      method: 'POST',
      body: data,
    });
    res = await res.json();

    const params = new URLSearchParams(res);

    return params.toString();
  }

  return (
    <>
      <dialog ref={dialogRef}>{message}</dialog>

      <form ref={formRef}>
        <h6>Select files</h6>
        <input
          type='file'
          name='files'
          onChange={handleFileChange}
          ref={fileRef}
          multiple
        />
        {/* <h6>Select Folder</h6>
        <input
          type='file'
          name='folder'
          onChange={handleFileChange}
          ref={fileRef}
          webkitdirectory='true'
          multiple
        /> */}
        <br />
        <br />
        <br />
        <input type='submit' value='Upload' />
      </form>
      <img src={src} alt='qr-code' ref={qrRef} hidden />
    </>
  );
};

export default Send;
