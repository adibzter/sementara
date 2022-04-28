// const { MongoClient, ServerApiVersion } = require('mongodb');
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

// async function saveToDb(id) {
//   const uri =
//     'mongodb+srv://adib:adib@sementara.ulwzn.mongodb.net/sementara?retryWrites=true&w=majority';

//   const client = new MongoClient(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverApi: ServerApiVersion.v1,
//   });

//   const connection = await client.connect();
//   const collection = client.db('sementara').collection('folders');

//   const folder = {
//     id,
//   };

//   await collection.insertOne(folder);
//   connection.close();
// }

async function uploadToBucket(id, files) {
  const promises = [];
  const data = { filenames: [] };
  for (let file of files) {
    data.filenames.push(file.originalname);
    promises.push(uploadBuffer(id, file.originalname, file.buffer));
  }
  promises.push(uploadBuffer(id, '.info', JSON.stringify(data)));

  await Promise.all(promises);
}

module.exports = router;
