const path = require('path');

const { Storage } = require('@google-cloud/storage');

// Creates a client
const storage = new Storage({
  keyFilename: path.join(__dirname, '../skrin-sementara-bucket.json'),
  projectId: 'skrin-1',
});

const bucketName = 'sementara';
const bucket = storage.bucket(bucketName);

const getFile = async (id, fileName) => {
  const destination = `temp/${id}/${fileName}`;
  const [files] = await bucket.getFiles({
    prefix: destination,
  });

  return files[0];
};

const uploadBuffer = async (id, fileName, buffer) => {
  const destination = `temp/${id}/${fileName}`;
  await bucket.file(destination).save(buffer);

  console.log(`${fileName} uploaded to ${bucketName} bucket`);
};

const downloadBuffer = async (id, fileName) => {
  const destination = `temp/${id}/${fileName}`;
  const buffer = await bucket.file(destination).download();

  return buffer[0];
};

const getFileNames = async (id) => {
  const folder = `temp/${id}/`;
  const [files] = await bucket.getFiles({
    prefix: folder,
  });

  const filenames = [];
  for (let file of files) {
    filenames.push(file.name);
  }

  return filenames;
};

module.exports = { getFile, uploadBuffer, downloadBuffer, getFileNames };
