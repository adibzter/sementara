import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Qr from '../components/Qr';
import Camera from '../components/Camera';

import Navbar from '../components/Navbar';
import Center from '../components/Center';
import Button from '../components/Button';
import Loader from '../components/Loader';

import { QR_URL_ORIGIN } from '../utils/config';
import { useUserStore } from '../stores/userStore';

const Receive = () => {
  const [method, setMethod] = useState('qr');
  const [methodButtonText, setMethodButtonText] = useState('Show Camera');
  const [qr, setQr] = useState(null);
  const [camera, setCamera] = useState(null);

  const [userId, setUsers] = useUserStore((state) => [
    state.userId,
    state.setUsers,
  ]);

  const navigate = useNavigate();

  window.cameraStream = new MediaStream();

  useEffect(() => {
    (async () => {
      if (!userId) {
        return;
      }

      await getQr();
    })();
  }, [userId]);

  async function getQr() {
    setQr(<Qr qrData={`${QR_URL_ORIGIN}/receive/${userId}`} />);
    setCamera(<Camera />);
  }

  function handleMethod() {
    if (method === 'qr') {
      setMethod('camera');
      setMethodButtonText('Show QR');
    } else if (method === 'camera') {
      setMethod('qr');
      setMethodButtonText('Show Camera');
    }
  }

  return (
    <>
      <Navbar />
      <Center>
        {!qr ? (
          <Loader />
        ) : (
          <>
            <h2>Receive Files</h2>
            <div id='method-div'>{method === 'qr' ? qr : camera}</div>
            <div>
              <Button onClick={handleMethod}>{methodButtonText}</Button>
            </div>
          </>
        )}
      </Center>
    </>
  );
};

export default Receive;
