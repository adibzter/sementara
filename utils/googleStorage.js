const path = require('path');

const { Storage } = require('@google-cloud/storage');

// Creates a client
const storage = new Storage({
  keyFilename: path.join(__dirname, '../skrin-sementara-bucket'),
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

const getFolderInfo = async (id) => {
  const buffer = await downloadBuffer(id, '.info');
  const data = JSON.parse(buffer.toString());

  for (let i in data.filenames) {
    data.filenames[i] = `temp/${id}/${data.filenames[i]}`;
  }

  return data;
};

module.exports = { getFile, uploadBuffer, downloadBuffer, getFolderInfo };
