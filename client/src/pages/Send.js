import { useState, useEffect, useRef } from 'react';

import QRCode from 'qrcode';
import { v4 as uuid } from 'uuid';

const Send = () => {
  const [data, setData] = useState('');
  const [src, setSrc] = useState('');
  const [message, setMessage] = useState('');

  const dialogRef = useRef(null);
  const formRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    formRef.current.onsubmit = async (e) => {
      e.preventDefault();

      showDialog('Uploading File...');
      const data = await postForm();
      const qrUrl = await QRCode.toDataURL(data, {
        errorCorrectionLevel: 'high',
      });
      setSrc(qrUrl);

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
      console.log(totalSize);
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

    const res = await fetch('http://localhost:5000/api/send', {
      method: 'POST',
      body: data,
    });

    return res.text();
  }

  return (
    <>
      <dialog ref={dialogRef}>{message}</dialog>

      <form ref={formRef}>
        <input
          type='file'
          name='files'
          multiple
          onChange={handleFileChange}
          ref={fileRef}
          required
        />
        <input type='submit' value='Upload' />
      </form>
      <img src={src} />
    </>
  );
};

export default Send;
