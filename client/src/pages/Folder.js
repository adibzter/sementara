import { useState, useEffect } from 'react';

import { API_SERVER } from '../utils/config';

const Folder = () => {
  const [filenames, setFilenames] = useState([]);
  const [id, setId] = useState('');

  useEffect(() => {
    // /folder/:id/info
    const id = window.location.pathname.split('/')[2];
    setId(id);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_SERVER}/api/folder/${id}/info`);
        const filenames = await res.json();

        for (let i in filenames) {
          let temp = filenames[i].split('/');
          temp = temp.slice(2);
          filenames[i] = temp.join('/');
        }

        setFilenames(() => filenames);
      } catch (err) {
        console.error(err.message);
      }
    })();
  }, [id]);

  async function downloadAll() {
    for (let filename of filenames) {
      downloadOne(filename);
    }
  }

  async function downloadOne(filename) {
    const res = await fetch(
      `${API_SERVER}/api/folder/${id}/download/one/${filename}`
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
      <h3>File</h3>
      <button onClick={downloadAll}>Download All</button>
      <table>
        <tbody>
          <tr>
            <th>File Name</th>
            <th>Download</th>
          </tr>
          {filenames.map((filename, i) => {
            return (
              <tr key={i}>
                <td>{filename}</td>
                <td>
                  <button onClick={() => downloadOne(filename)}>
                    Download
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default Folder;
