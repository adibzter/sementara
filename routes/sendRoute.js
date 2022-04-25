const fs = require('fs');
const path = require('path');

const router = require('express').Router();
const multer = require('multer');
const { v4: uuid } = require('uuid');

const upload = multer({ dest: 'temp/' });

router.post('/', upload.array('files'), (req, res, next) => {
  const id = uuid();
  const dir = path.join(__dirname, '../temp', id);
  fs.mkdirSync(dir);

  for (let file of req.files) {
    fs.rename(file.path, path.join(dir, file.originalname), () => {});
  }

  const params = {
    action: 'send',
    url: `http://localhost:5000/send/${id}`,
  };

  const searchParams = new URLSearchParams(params);

  res.send(searchParams.toString());
  next();
});

module.exports = router;
