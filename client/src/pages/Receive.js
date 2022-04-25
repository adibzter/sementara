import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

import Camera from '../components/Camera';

const Receive = () => {
  const [qrSrc, setQrSrc] = useState('');
  window.cameraStream = new MediaStream();

  useEffect(() => {
    (async () => {
      // getQr();
    })();
  }, []);

  async function getQr() {
    let data = await fetch('http://localhost:5000/api/receive');
    data = await data.text();
    const qrUrl = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'high',
    });
    setQrSrc(qrUrl);
  }

  return (
    <>
      <h3>Receive</h3>
      <img src={qrSrc} />
      <Camera />
    </>
  );
};

export default Receive;
