const router = require('express').Router();
const { v4: uuid } = require('uuid');

// GET /api/receive/
router.get('/', (req, res) => {
  const userId = uuid();

  const params = {
    action: 'receive',
    userId,
  };

  res.json(params);
});

module.exports = router;
