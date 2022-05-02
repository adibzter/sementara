const path = require('path');

const express = require('express');
const WebSocket = require('ws');
// const { ExpressPeerServer } = require('peer');

const app = express();

const PORT = process.env.PORT || 5000;
const httpServer = app.listen(PORT, () => {
  console.log(`Server start on port ${PORT}`);
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API endpoint
// app.use('/api/socket', require('./routes/socketRoute'));
app.use('/api/send', require('./routes/sendRoute'));
app.use('/api/receive', require('./routes/receiveRoute'));
app.use('/api/folder', require('./routes/folderRoute'));

// // PeerJS path
// const peerServer = ExpressPeerServer(httpServer);

// app.use('/api', peerServer);

// Server static files
// app.use(express.static('client/build'));

// Handle URL
app.get('*', (req, res) => {
  // res.sendFile(path.resolve(__dirname, 'client/build/index.html'));
});

// WebSocket Server
const wss = new WebSocket.Server({ server: httpServer });
wss.setMaxListeners(0);

const clients = {};
wss.on('connection', (ws, req) => {
  console.log(`Remote address: ${req.socket.remoteAddress}`);

  // Recieve message from client
  ws.on('message', (message) => {
    const data = JSON.parse(message.toString());

    if (data.type === 'connection') {
      ws.userId = data.userId;
      clients[ws.userId] = ws;
    }

    // Join room
    else if (data.type === 'join') {
      ws.roomId = data.roomId;

      if (data.action === 'join') {
        sendToRoom(wss, ws, data);
      }
    }

    // Client in room
    else if (data.type === 'room') {
      ws.userId = data.userId;
      clients[ws.userId] = ws;
    }

    // Client disconnect
    else if (data.type === 'disconnect') {
      delete clients[data.userId];
    }

    // Handle message from client
    else if (data.type === 'message') {
      // Send message to room except the sender
      // sendToRoom(wss, ws, data);

      // Send message to specific client
      sendToClient(data.userId, data);
    }
  });

  ws.on('error', (err) => {
    console.error(`ERROR: ${err}`);
  });
});

function sendToClient(clientId, data) {
  const client = clients[clientId];
  if (client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(data));
  }
}

function sendToRoom(wss, ws, data) {
  wss.clients.forEach((client) => {
    if (
      client !== ws &&
      client.readyState === WebSocket.OPEN &&
      client.roomId === data.roomId
    ) {
      client.send(JSON.stringify(data));
    }
  });
}

// // PeerJS Server
// peerServer.connect()
// peerServer.on('connection', (client) => {
//   console.log(`Client connected: ${client.getId()}`);
// });

// peerServer.on('error', (err) => {
//   console.error(`ERROR: ${err}`);
// });
