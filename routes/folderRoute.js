const router = require('express').Router();

const { getFile, getFolderInfo } = require('../utils/googleStorage');

// GET /api/folder/:id/info
router.get('/:id/info', async (req, res) => {
  const id = req.params.id;

  try {
    const folderInfo = await getFolderInfo(id);
    res.json(folderInfo);
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

module.exports = router;
