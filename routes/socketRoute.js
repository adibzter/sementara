const router = require('express').Router();
const { v4: uuid } = require('uuid');

// GET /api/socket/connect
router.get('/connect', (req, res) => {
  const id = uuid();

  const params = {
    action: 'connect',
    id,
  };

  res.json(params);
});

// GET /api/socket/join
router.get('/join', (req, res) => {
  const roomId = uuid();

  const params = {
    action: 'join',
    roomId,
  };

  res.json(params);
});

module.exports = router;
