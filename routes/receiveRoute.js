const router = require('express').Router();
const { v4: uuid } = require('uuid');

// GET /api/receive/
router.get('/', (req, res) => {
  const id = uuid();

  const params = {
    action: 'receive',
    id,
  };

  res.json(params);
});

module.exports = router;
