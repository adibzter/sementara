import { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';

import Qr from '../components/Qr';
import Camera from '../components/Camera';

import { PORT, SERVER_DOMAIN } from '../utils/config';

const Room = () => {
  const [peer, setPeer] = useState(null);
  const [callerConnection, setCallerConnection] = useState(null);
  const [peerId, setPeerId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [message, setMessage] = useState('');
  const [qr, setQr] = useState(null);
  const [camera, setCamera] = useState(null);

  const dialogRef = useRef(null);
  const formRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    let path = window.location.pathname.split('/');
    path = path[path.length - 1];
    setRoomId(path);

    const peer = new Peer(undefined, {
      host: SERVER_DOMAIN,
      port: PORT,
      path: '/api',
    });
    setPeer(peer);
  }, []);

  useEffect(() => {
    if (!peer) {
      return;
    }

    // Local peer
    peer.on('open', (id) => {
      setPeerId(id);
      setQr(<Qr qrData={JSON.stringify({ action: 'connect', peerId: id })} />);
      setCamera(
        <Camera peer={peer} setCallerConnection={setCallerConnection} />
      );
    });

    peer.on('connection', (calleeConnection) => {
      calleeConnection.on('open', () => {
        console.log('Connection opened');

        calleeConnection.on('data', (data) => {
          setMessage(data);
          console.log(data);
        });
      });
    });

    peer.on('error', (err) => {
      console.error(`ERROR: ${err}`);
    });
  }, [peer]);

  useEffect(() => {
    if (!callerConnection) {
      return;
    }

    callerConnection.on('open', () => {
      callerConnection.send(JSON.stringify({ roomId: peerId }));

      formRef.current.onsubmit = async (e) => {
        e.preventDefault();

        showDialog('Sending Files...');
        const data = await sendForm();

        showDialog('File Sent');
        setTimeout(() => {
          closeDialog();
        }, 3000);
      };
    });
  }, [callerConnection]);

  function handleFileChange(e) {
    const files = e.target.files;
    checkFilesSizes(files);
  }

  function checkFilesSizes(files) {
    const limit = 20; // 20 MB
    let totalSize = 0;
    for (let file of files) {
      totalSize += file.size;
    }

    if (totalSize > limit * 1024 * 1024) {
      showDialog(`Total size of files must not exceed ${limit} MB`);
      setTimeout(() => {
        closeDialog();
      }, 3000);
    }
  }

  function showDialog(message) {
    setMessage(message);
    dialogRef.current.show();
  }

  function closeDialog() {
    dialogRef.current.close();
  }

  async function sendForm() {
    const files = fileRef.current.files;

    // const data = new FormData();
    for (let file of files) {
      // data.append('files', file);
      const blobUrl = URL.createObjectURL(file);
    }
  }
  return (
    <>
      <div>My ID: {peerId}</div>
      <div>Room: {roomId}</div>
      <dialog ref={dialogRef}>{message}</dialog>

      <form ref={formRef}>
        <h6>Select files</h6>
        <input
          type='file'
          name='files'
          onChange={handleFileChange}
          ref={fileRef}
          // multiple
        />
        {/* <h6>Select Folder</h6>
        <input
          type='file'
          name='folder'
          onChange={handleFileChange}
          ref={fileRef}
          webkitdirectory='true'
          multiple
        /> */}
        <br />
        <br />
        <br />
        <input type='submit' value='Upload' />
      </form>
      {qr}
      {camera}
    </>
  );
};

export default Room;
