const path = require('path');

const express = require('express');
const WebSocket = require('ws');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API endpoint
app.use('/api/send', require('./routes/sendRoute'));
app.use('/api/receive', require('./routes/receiveRoute'));
app.use('/api/folder', require('./routes/folderRoute'));

// Server static files
// app.use(express.static('client/build'));

// Handle URL
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client/build/index.html'));
});

const PORT = process.env.PORT || 5000;
const httpServer = app.listen(PORT, () => {
  console.log(`Server start on port ${PORT}`);
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

    const type = data.type;

    // Register receiver
    if (type === 'registration') {
      ws.id = data.userId;
      clients[ws.id] = ws;
    }

    // Handle message from client
    else if (type === 'message') {
      // Send message to specified client
      clients[data.id].send(JSON.stringify({ id: data.folderId }));
    }
  });
});
