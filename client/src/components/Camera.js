import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import QrScanner from 'qr-scanner';

import { WEB_SOCKET_SERVER } from '../utils/config';

import './styles/Camera.css';

const Camera = ({ folderId, sdp, peer, setCallerConnection }) => {
  const navigate = useNavigate();
  window.cameraStream = new MediaStream();

  const videoRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            width: { ideal: 999999 },
            height: { ideal: 999999 },
            facingMode: { ideal: 'environment' },
          },
        });
        window.cameraStream = stream;
        showCameraVideo();

        const qrScanner = new QrScanner(videoRef.current, (data) => {
          const isValid = handleData(data);

          if (isValid) {
            qrScanner.destroy();
            // alert('Done scanning');
          } else {
            alert('Invalid QR Code');
          }
        });
        qrScanner.start();
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      const tracks = window.cameraStream.getTracks();
      for (let track of tracks) {
        window.cameraStream.removeTrack(track);
        track.stop();
      }
    };
  }, []);

  function showCameraVideo() {
    const video = videoRef.current;
    video.srcObject = window.cameraStream;

    video.onloadedmetadata = () => {
      video.play();
    };
  }

  function handleData(data) {
    let whitelistedDomain = [
      'sementara.skrin.xyz',
      'localhost',
      '192.168.1.12',
      'sementara-dev-c3d6yhsnla-as.a.run.app',
    ];

    // https://localhost:3000/:action/:UUID
    let url = new URL(data);
    if (!whitelistedDomain.includes(url.hostname)) {
      return false;
    }

    let action, uuid;
    try {
      data = data.split('/');
      action = data[3];
      uuid = data[4];
    } catch (err) {
      return false;
    }

    // Check QR validity
    if (!action || !uuid) {
      return false;
    }

    // QR created by sender
    if (action === 'folder') {
      if (folderId) {
        return false;
      }
      navigate(url.pathname);
    }

    // QR created by receiver
    else if (action === 'receive') {
      if (!folderId) {
        return false;
      }

      const ws = new WebSocket(WEB_SOCKET_SERVER);
      ws.onopen = (e) => {
        ws.send(
          JSON.stringify({
            type: 'message',
            action,
            userId: uuid,
            folderId,
          })
        );
        ws.close();
      };
    }
    return true;
  }

  function _handleData(data) {
    data = JSON.parse(data);
    const action = data.action;
    const userId = data.userId;
    folderId = folderId || data.folderId;

    // QR created for webRTC connection
    if (action === 'connect') {
      const conn = peer.connect(data.peerId);
      window.conn = conn;
      setCallerConnection(conn);
      const ws = new WebSocket(WEB_SOCKET_SERVER);
      ws.onopen = (e) => {
        ws.send(
          JSON.stringify({
            type: 'message',
            action,
            // id,
            sdp,
          })
        );
        ws.close();
      };
    }

    // QR for joining room
    else if (action === 'join') {
      const ws = window.ws;
      ws.send(
        JSON.stringify({
          type: 'join',
          action,
          roomId: data.roomId,
        })
      );
      navigate(`/room/${data.roomId}`, { state: { caller: true } });
    }

    return true;
  }

  return (
    <>
      <div id='camera-container'>
        <video id='camera-video' ref={videoRef}></video>
      </div>
    </>
  );
};

export default Camera;
