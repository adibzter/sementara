import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const Qr = ({ qrData }) => {
  const [qrSrc, setQrSrc] = useState('');

  const qrRef = useRef(null);

  useEffect(() => {
    (async () => {
      const qrUrl = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: 'high',
      });
      setQrSrc(qrUrl);
    })();
  }, []);

  useEffect(() => {
    if (!qrSrc) {
      return;
    }

    qrRef.current.hidden = false;
  }, [qrSrc]);

  return (
    <>
      <img
        src={qrSrc}
        alt='qr-code'
        style={{ border: 'solid 5px red' }}
        ref={qrRef}
        hidden
      />
    </>
  );
};

export default Qr;
