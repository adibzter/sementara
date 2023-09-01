import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

import Home from './pages/Home';
import Room from './pages/Room';
import Send from './pages/Send';
import Receive from './pages/Receive';
import Folder from './pages/Folder';

import './styles/App.css';

import { API_SERVER } from './utils/config';
import WebSocketService from './services/WebSocketService';
import { useUserStore } from './stores/userStore';

function App() {
  const [setUserAgent, setUserId, setNetworkAddress, setUsers] = useUserStore(
    (state) => [
      state.setUserAgent,
      state.setUserId,
      state.setNetworkAddress,
      state.setUsers,
    ]
  );

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      let res = await fetch(`${API_SERVER}/api/socket/connect`);
      res = await res.json();

      setUserAgent(res.userAgent);
      setUserId(res.userId);
      setNetworkAddress(res.networkAddress);

      const ws = WebSocketService.getWebSocket();
      ws.onopen = (e) => {
        ws.onmessage = (e) => {
          const data = JSON.parse(e.data);

          // Get users in same network
          if (data.action === 'network') {
            setUsers(data.users);
          }

          // Navigate receiver to folder
          else if (data.action === 'receive') {
            navigate(`/folder/${data.folderId}`);

            if (window.cameraStream) {
              window.cameraStream.getTracks().forEach((track) => {
                track.stop();
              });
            }
          }
        };

        ws.send(
          JSON.stringify({
            type: res.action,
            userAgent: res.userAgent,
            userId: res.userId,
            networkAddress: res.networkAddress,
          })
        );
      };
    })();
  }, []);

  return (
    <Routes>
      <Route exact path='/' element={<Home />} />
      <Route path='/room/*' element={<Room />} />
      <Route exact path='/send' element={<Send />} />
      <Route exact path='/receive' element={<Receive />} />
      <Route path='/folder/*' element={<Folder />} />
      <Route path='*' component={<Home />} />
    </Routes>
  );
}

export default App;
