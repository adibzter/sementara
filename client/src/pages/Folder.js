import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import userAgentParser from 'ua-parser-js';

import { Box } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';

import Qr from '../components/Qr';
import Camera from '../components/Camera';

import Navbar from '../components/Navbar';
import Center from '../components/Center';
import Button from '../components/Button';
import Loader from '../components/Loader';
import UserDisplay from '../components/UserDisplay';

import { API_SERVER, QR_URL_ORIGIN } from '../utils/config';
import { useUserStore } from '../stores/userStore';
import WebSocketService from '../services/WebSocketService';

import './styles/Folder.css';

const Folder = () => {
  const [type, setType] = useState('');
  const [filenames, setFilenames] = useState([]);
  const [folderId, setFolderId] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [method, setMethod] = useState('qr');
  const [methodButton, setMethodButton] = useState({
    text: 'Camera',
    icon: <CameraAltIcon />,
  });
  const [qr, setQr] = useState(null);
  const [camera, setCamera] = useState(null);

  const [userAgent, userId, users] = useUserStore((state) => [
    state.userAgent,
    state.userId,
    state.users,
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    // /folder/:id/info
    const id = window.location.pathname.split('/')[2];
    setFolderId(id);
  }, []);

  useEffect(() => {
    if (!folderId || !userId) {
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_SERVER}/api/folder/${folderId}/info`);

        // Folder not found
        if (res.status !== 200) {
          navigate('/', { replace: true });
          return;
        }

        setQr(<Qr qrData={`${QR_URL_ORIGIN}/folder/${folderId}`} />);
        setCamera(<Camera folderId={folderId} />);

        const { type, filenames } = await res.json();

        for (let i in filenames) {
          let temp = filenames[i].split('/');
          temp = temp.slice(2);
          filenames[i] = temp.join('/');
        }

        setType(type);
        setFilenames(filenames);
      } catch (err) {
        console.error(err.message);
      }
    })();
  }, [folderId, userId]);

  function handleMethod() {
    if (method === 'qr') {
      setMethod('camera');
      setMethodButton({ text: 'QR', icon: <QrCode2Icon /> });
    } else if (method === 'camera') {
      setMethod('qr');
      setMethodButton({ text: 'Camera', icon: <CameraAltIcon /> });
    }
  }

  function handleCopyUrl(e) {
    navigator.clipboard.writeText(window.location.href);
    e.target.innerText = 'URL Copied ✔';
    e.target.style.backgroundColor = 'green';
  }

  function handleDownload() {
    setIsDownloading(true);
    if (type === 'folder' || filenames.length === 1) {
      downloadZipFile(filenames[0]);
    } else if (type === 'file') {
      downloadZipFile('sementara.zip');
    }
  }

  async function downloadZipFile(filename) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';

    xhr.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress((e.loaded / e.total) * 100);
      }
    };

    xhr.onload = () => {
      downloadToDisk(xhr.response, filename);
      setIsDownloading(false);
    };

    xhr.open(
      'GET',
      `${API_SERVER}/api/folder/${folderId}/download/one/${filename}`
    );

    xhr.send();
  }

  function downloadToDisk(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function handleSendWsMessage(userId) {
    const ws = WebSocketService.getWebSocket();
    ws.send(
      JSON.stringify({
        type: 'message',
        action: 'receive',
        userId,
        folderId,
      })
    );
  }

  return (
    <>
      <Navbar />
      <Center>
        {!filenames || !qr || isDownloading ? (
          <Loader>
            {isDownloading ? (
              <>
                <h3>Downloading Files</h3>
                <progress value={progress} max='100'></progress>
                {progress} %
              </>
            ) : undefined}
          </Loader>
        ) : (
          <>
            <div id='method-div'>{method === 'qr' ? qr : camera}</div>
            <div>
              <Button onClick={handleMethod} endIcon={methodButton.icon}>
                {methodButton.text}
              </Button>
              <Button onClick={handleCopyUrl} endIcon={<ContentCopyIcon />}>
                Copy URL
              </Button>
            </div>

            <br />
            <table>
              <tbody>
                {filenames.map((filename, i) => {
                  return (
                    <tr key={i}>
                      <td>
                        <li>{filename}</li>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Button onClick={handleDownload} endIcon={<DownloadIcon />}>
              Download
            </Button>

            <h3>Devices in your network:</h3>
            <Box display='flex' flexWrap='wrap' justifyContent='space-around'>
              {users.map((user, i) => {
                const { os, browser, device } = userAgentParser(user.userAgent);
                let displayName = `${os.name} ${browser.name}`;
                displayName =
                  user.userId === userId ? displayName + ' (You)' : displayName;

                return (
                  <Box key={i} p={2}>
                    <UserDisplay
                      onClick={() => handleSendWsMessage(user.userId)}
                      displayName={displayName}
                      deviceType={device.type}
                    />
                  </Box>
                );
              })}
            </Box>
          </>
        )}
      </Center>
    </>
  );
};

export default Folder;
