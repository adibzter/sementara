import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

import Camera from '../components/Camera';

const Receive = () => {
  const [qrSrc, setQrSrc] = useState('');
  window.cameraStream = new MediaStream();

  useEffect(() => {
    (async () => {
      getQr();
    })();
  }, []);

  async function getQr() {
    let res = await fetch('http://localhost:5000/api/receive');
    res = await res.json();

    const params = new URLSearchParams(res);

    const qrUrl = await QRCode.toDataURL(params.toString(), {
      errorCorrectionLevel: 'high',
    });
    setQrSrc(qrUrl);
  }

  return (
    <>
      <h3>Receive</h3>
      <img src={qrSrc} alt='qr-code' />
      <Camera />
    </>
  );
};

export default Receive;
