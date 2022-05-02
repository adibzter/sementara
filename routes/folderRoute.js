const router = require('express').Router();

const {
  getFile,
  downloadBuffer,
  getFilenames,
} = require('../utils/googleStorage');

// GET /api/folder/:id/info
router.get('/:id/info', async (req, res) => {
  const id = req.params.id;

  try {
    const filenames = await getFilenames(id);
    res.json(filenames);
  } catch (err) {
    console.error(err.message);
    res.status(404).json({});
  }
});

// GET /api/folder/:id/download/one/:filename
router.get('/:id/download/one/:filename', async (req, res) => {
  const id = req.params.id;
  const filename = req.params.filename;

  try {
    const file = await getFile(id, filename);
    const buffer = (await file.download())[0];

    res.set('Content-Disposition', file.metadata.contentDisposition);
    res.set('Content-Type', file.metadata.contentType);
    res.send(buffer);
  } catch (err) {
    console.error(err.message);
    res.status(404).json({});
  }
});

// GET /api/folder/:id/download/all
router.get('/:id/download/all', async (req, res) => {
  res.zip([
    { path: 'receiveRoute.js', name: 'receiveRoute.js' },
    { path: 'sendRoute.js', name: 'sendRoute.js' },
  ]);
  // const id = req.params.id;

  // try {
  //   const filenames = await getFileNames(id);

  //   for (let filename of filenames) {
  //     await downloadBuffer(id, filename);
  //   }
  //   res.json(filenames);
  // } catch (err) {
  //   console.error(err.message);
  //   res.status(404).json({});
  // }
});

module.exports = router;
