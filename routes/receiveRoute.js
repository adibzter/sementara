const router = require('express').Router();
const { v4: uuid } = require('uuid');

router.get('/', (req, res) => {
  const id = uuid();

  const params = {
    action: 'receive',
    url: `http://localhost:5000/receive/${id}`,
  };

  const searchParams = new URLSearchParams(params);

  res.send(searchParams.toString());
});

module.exports = router;
