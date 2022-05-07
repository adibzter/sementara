const router = require('express').Router();
const multer = require('multer');
const { v4: uuid } = require('uuid');

const { uploadBuffer } = require('../utils/googleStorage');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST /api/send/
router.post('/', upload.array('files'), async (req, res, next) => {
  const id = uuid();

  try {
    await uploadToBucket(id, req.files);

    const params = {
      action: 'send',
      id,
    };

    res.json(params);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({});
  }

  next();
});

async function uploadToBucket(id, files) {
  const promises = [];
  for (let file of files) {
    promises.push(uploadBuffer(id, file.originalname, file.buffer));
  }

  await Promise.all(promises);
}

module.exports = router;
