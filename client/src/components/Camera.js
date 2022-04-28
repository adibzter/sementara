import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import QrScanner from 'qr-scanner';

import { WEB_SOCKET_SERVER } from '../utils/config';

const Camera = ({ folderId }) => {
  const navigate = useNavigate();
  window.cameraStream = new MediaStream();

  const videoRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
          },
        });
        window.cameraStream = stream;
        showCameraVideo();

        const qrScanner = new QrScanner(videoRef.current, (data) => {
          const isValid = redirectToFolder(data);

          if (isValid) {
            qrScanner.destroy();
          } else {
            alert('QR not valid');
          }
        });
        qrScanner.start();
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  function showCameraVideo() {
    const video = videoRef.current;
    video.srcObject = window.cameraStream;

    video.onloadedmetadata = () => {
      video.play();
    };
    video.play();
  }

  function redirectToFolder(data) {
    const searchParams = new URLSearchParams(data);
    const action = searchParams.get('action');
    const id = searchParams.get('id');

    // Check QR validity
    if (!action || !id) {
      return false;
    }

    // QR created by sender
    if (action === 'send') {
      navigate(`/folder/${id}`, { replace: true });
    }

    // QR created by receiver
    else if (action === 'receive') {
      const ws = new WebSocket(WEB_SOCKET_SERVER);
      ws.onopen = (e) => {
        ws.send(
          JSON.stringify({
            type: 'message',
            action,
            id,
            folderId,
          })
        );
        ws.close();
      };
    }

    return true;
  }

  return (
    <>
      <video width='300px' height='300px' ref={videoRef}></video>
    </>
  );
};

export default Camera;
