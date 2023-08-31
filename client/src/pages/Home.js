import { useState, useEffect } from 'react';

import Center from '../components/Center';
import Navbar from '../components/Navbar';

import { API_SERVER, WEB_SOCKET_SERVER } from '../utils/config';

const Home = () => {
  const [networkAddress, setNetworkAddress] = useState('');
  const [users, setUsers] = useState([]);

  window.userId = null;
  window.networkAddress = null;

  useEffect(() => {
    (async () => {
      await getUserDetails();
      connectWebSocket();
    })();
  }, []);

  async function getUserDetails() {
    let res = await fetch(`${API_SERVER}/api/socket/join`);
    res = await res.json();

    window.userId = res.userId;
    window.networkAddress = res.networkAddress;
  }

  function connectWebSocket() {
    const ws = new WebSocket(WEB_SOCKET_SERVER);
    ws.onopen = (e) => {
      ws.send(
        JSON.stringify({
          type: 'join',
          userId: window.userId,
          networkAddress: window.networkAddress,
        })
      );

      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        setNetworkAddress(data.networkAddress);
        setUsers(data.users);

        // navigate(`/folder/${data.folderId}`);
        // ws.close();
      };
    };
  }

  return (
    <>
      <Navbar />
      <Center>
        <h3>Home</h3>
        <p>{networkAddress}</p>
        <ol>
          {users.map((user) => (
            <li key={user.userId}>{user.userId}</li>
          ))}
        </ol>
      </Center>
    </>
  );
};

export default Home;
