import { useState, useEffect } from 'react';

import Qr from '../components/Qr';
import Camera from '../components/Camera';

import Navbar from '../components/Navbar';

import { API_SERVER } from '../utils/config';

const Folder = () => {
  const [type, setType] = useState('');
  const [filenames, setFilenames] = useState([]);
  const [folderId, setFolderId] = useState('');
  const [method, setMethod] = useState('qr');
  const [qr, setQr] = useState(null);
  const [camera, setCamera] = useState(null);

  useEffect(() => {
    // /folder/:id/info
    const id = window.location.pathname.split('/')[2];
    setFolderId(id);
    setQr(<Qr qrData={JSON.stringify({ action: 'send', folderId: id })} />);
    setCamera(<Camera folderId={id} />);
  }, []);

  useEffect(() => {
    if (!folderId) {
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_SERVER}/api/folder/${folderId}/info`);
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
      <h3>File</h3>
      <button onClick={handleDownload}>Download</button>
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
        <button onClick={() => setMethod('qr')}>Show QR</button>
        <button onClick={() => setMethod('camera')}>Show Camera</button>
      </div>
    </>
  );
};

export default Folder;
