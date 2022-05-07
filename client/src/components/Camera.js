import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import QrScanner from 'qr-scanner';

import { WEB_SOCKET_SERVER } from '../utils/config';

const Camera = ({ folderId, sdp, peer, setCallerConnection }) => {
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
    data = JSON.parse(data);
    const action = data.action;
    const userId = data.userId;
    folderId = folderId || data.folderId;

    // // Check QR validity
    // if (!action || !userId || !folderId) {
    //   return false;
    // }

    // QR created by sender
    if (action === 'send') {
      navigate(`/folder/${folderId}`);
    }

    // QR created by receiver
    else if (action === 'receive') {
      if (!action || !userId || !folderId) {
        return false;
      }

      const ws = new WebSocket(WEB_SOCKET_SERVER);
      ws.onopen = (e) => {
        ws.send(
          JSON.stringify({
            type: 'message',
            action,
            userId,
            folderId,
          })
        );
        ws.close();
      };
    }

    // QR created for webRTC connection
    else if (action === 'connect') {
      const conn = peer.connect(data.peerId);
      window.conn = conn;
      setCallerConnection(conn);
      // const ws = new WebSocket(WEB_SOCKET_SERVER);
      // ws.onopen = (e) => {
      //   ws.send(
      //     JSON.stringify({
      //       type: 'message',
      //       action,
      //       id,
      //       sdp,
      //     })
      //   );
      //   ws.close();
      // };
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
      <video
        width='300px'
        style={{ border: 'solid 5px red' }}
        ref={videoRef}
      ></video>
    </>
  );
};

export default Camera;
