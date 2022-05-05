import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Center from '../components/Center';
import Navbar from '../components/Navbar';
import Qr from '../components/Qr';
import Camera from '../components/Camera';

import { API_SERVER, WEB_SOCKET_SERVER } from '../utils/config';

const Home = () => {
  const [qr, setQr] = useState(null);
  const [camera, setCamera] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await getQr();
      connectWebSocket();
    })();
  }, []);

  async function getQr() {
    let res = await fetch(`${API_SERVER}/api/socket/join`);
    res = await res.json();

    setQr(<Qr qrData={JSON.stringify(res)} />);

    window.res = res;
  }

  function connectWebSocket() {
    const ws = new WebSocket(WEB_SOCKET_SERVER);
    window.ws = ws;
    ws.onopen = (e) => {
      ws.send(JSON.stringify({ type: 'join', ...window.res }));

      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);

        if (data.action === 'join') {
          navigate(`room/${data.roomId}`, { state: { caller: false } });
        }
      };
    };
    setCamera(<Camera />);
  }
  return (
    <>
      <Navbar />
      <Center>
        <h3>Home</h3>
        {qr}
        {camera}
      </Center>
    </>
  );
};

export default Home;
