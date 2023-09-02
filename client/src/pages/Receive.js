import { useState, useEffect } from 'react';

import CameraAltIcon from '@mui/icons-material/CameraAlt';
import QrCode2Icon from '@mui/icons-material/QrCode2';

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
  const [methodButton, setMethodButton] = useState({
    text: 'Camera',
    icon: <CameraAltIcon />,
  });
  const [qr, setQr] = useState(null);
  const [camera, setCamera] = useState(null);

  const [userId] = useUserStore((state) => [state.userId, state.setUsers]);

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
      setMethodButton({ text: 'QR', icon: <QrCode2Icon /> });
    } else if (method === 'camera') {
      setMethod('qr');
      setMethodButton({ text: 'Camera', icon: <CameraAltIcon /> });
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
              <Button onClick={handleMethod} endIcon={methodButton.icon}>
                {methodButton.text}
              </Button>
            </div>
          </>
        )}
      </Center>
    </>
  );
};

export default Receive;
