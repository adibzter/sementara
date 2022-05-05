import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Qr from '../components/Qr';
import Camera from '../components/Camera';

import Navbar from '../components/Navbar';
import Center from '../components/Center';
import Button from '../components/Button';

import { API_SERVER } from '../utils/config';

const Folder = () => {
  const [type, setType] = useState('');
  const [filenames, setFilenames] = useState([]);
  const [folderId, setFolderId] = useState('');
  const [method, setMethod] = useState('qr');
  const [qr, setQr] = useState(null);
  const [camera, setCamera] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // /folder/:id/info
    const id = window.location.pathname.split('/')[2];
    setFolderId(id);
  }, []);

  useEffect(() => {
    if (!folderId) {
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

        setQr(<Qr qrData={JSON.stringify({ action: 'send', folderId })} />);
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
  }, [folderId]);

  function handleDownload() {
    if (type === 'folder') {
      downloadZipFile(filenames[0]);
    } else if (type === 'file') {
      downloadZipFile('sementara.zip');
    }
  }

  async function downloadZipFile(filename) {
    const res = await fetch(
      `${API_SERVER}/api/folder/${folderId}/download/one/${filename}`
    );
    downloadToDisk(await res.blob(), filename);
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

  return (
    <>
      <Navbar />
      <Center>
        <Button text='Download' onClick={handleDownload} />
        <table>
          <tbody>
            <tr>
              <th>File Name</th>
            </tr>
            {filenames.map((filename, i) => {
              return (
                <tr key={i}>
                  <td>{filename}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div id='method-div'>
          {method === 'qr' ? qr : camera}
          <br />
          <Button text='Show QR' onClick={() => setMethod('qr')} />
          <Button text='Scan QR' onClick={() => setMethod('camera')} />
        </div>
      </Center>
    </>
  );
};

export default Folder;
