import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Qr from '../components/Qr';
import Camera from '../components/Camera';

import Navbar from '../components/Navbar';

import { API_SERVER, WEB_SOCKET_SERVER } from '../utils/config';

const Receive = () => {
  const [method, setMethod] = useState('qr');
  const [qr, setQr] = useState(null);
  const [camera, setCamera] = useState(null);

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

    setQr(<Qr qrData={JSON.stringify(res)} />);
    setCamera(<Camera />);

    window.userId = res.userId;
  }

  function connectWebSocket() {
    const ws = new WebSocket(WEB_SOCKET_SERVER);
    ws.onopen = (e) => {
      ws.send(JSON.stringify({ type: 'connection', userId: window.userId }));

      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);

        navigate(`/folder/${data.folderId}`);
        window.cameraStream.getTracks().forEach((track) => {
          track.stop();
        });

        ws.close();
      };
    };
  }

  return (
    <>
      <Navbar />
      <h3>Receive</h3>
      <div id='method-div'>
        {method === 'qr' ? qr : camera}
        <button onClick={() => setMethod('qr')}>Show QR</button>
        <button onClick={() => setMethod('camera')}>Show Camera</button>
      </div>
    </>
  );
};

export default Receive;
