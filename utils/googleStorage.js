const path = require('path');

const { Storage } = require('@google-cloud/storage');

// Creates a client
const storage = new Storage({
  keyFilename: path.join(__dirname, '../skrin-sementara-bucket.json'),
  projectId: 'skrin-1',
});

const bucketName = 'sementara';
const bucket = storage.bucket(bucketName);

const getFile = async (id, filename) => {
  const destination = `temp/${id}/${filename}`;
  const [files] = await bucket.getFiles({
    prefix: destination,
  });

  return files[0];
};

const uploadBuffer = async (id, filename, buffer) => {
  const destination = `temp/${id}/${filename}`;
  await bucket.file(destination).save(buffer);

  console.log(`${filename} uploaded to ${bucketName} bucket`);
};

const downloadBuffer = async (id, filename) => {
  const destination = `temp/${id}/${filename}`;
  const buffer = await bucket.file(destination).download();

  return buffer[0];
};

const getFilenames = async (id) => {
  const buffer = await downloadBuffer(id, '.info');
  const { filenames } = JSON.parse(buffer.toString());

  for (let i in filenames) {
    filenames[i] = `temp/${id}/${filenames[i]}`;
  }

  return filenames;
};

module.exports = { getFile, uploadBuffer, downloadBuffer, getFilenames };
