import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import QRCode from 'qrcode';

import Camera from '../components/Camera';

import { API_SERVER, WEB_SOCKET_SERVER } from '../utils/config';

const Receive = () => {
  const [qrSrc, setQrSrc] = useState('');
  const navigate = useNavigate();

  window.cameraStream = new MediaStream();
  window.userId = null;

  useEffect(() => {
    (async () => {
      await getQr();
      connectWebSocket();
    })();
  }, []);

  async function getQr() {
    let res = await fetch(`${API_SERVER}/api/receive`);
    res = await res.json();

    const params = new URLSearchParams(res);

    const qrUrl = await QRCode.toDataURL(params.toString(), {
      errorCorrectionLevel: 'high',
    });
    setQrSrc(qrUrl);

    window.userId = res.id;
  }

  function connectWebSocket() {
    const ws = new WebSocket(WEB_SOCKET_SERVER);
    ws.onopen = (e) => {
      ws.send(JSON.stringify({ type: 'registration', userId: window.userId }));

      ws.onmessage = (e) => {
        let data = JSON.parse(e.data);

        navigate(`/folder/${data.id}`);
      };
    };
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
