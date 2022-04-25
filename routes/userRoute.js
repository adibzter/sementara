const router = require('express').Router();
const { v4: uuid } = require('uuid');

router.get('/', (req, res) => {
  res.send(`user-${uuid()}`);
});

module.exports = router;
