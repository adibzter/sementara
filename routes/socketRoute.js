const router = require('express').Router();
const { v4: uuid } = require('uuid');
const { getNetworkAddress } = require('../utils/network');

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
  const userId = uuid();
  const networkAddress = getNetworkAddress(req);

  const params = {
    action: 'join',
    userId,
    networkAddress,
  };

  res.json(params);
});

module.exports = router;
