const path = require('path');

const express = require('express');
const app = express();

app.use((req, res, next) => {
  // res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API endpoint
app.use('/api/send', require('./routes/sendRoute'));
app.use('/api/receive', require('./routes/receiveRoute'));

// Server static files
// app.use(express.static('client/build'));

// Handle URL
app.get('*', (req, res) => {
  // res.sendFile(path.resolve(__dirname, 'client/build/index.html'));
  res.sendFile(path.resolve(__dirname, 'client/public/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server start on port ${PORT}`);
});
