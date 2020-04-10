const fs = require('fs');
const gostCrypto = require('node-gost');

const READ_BUFFER_SIZE = 512;

const { convertBufferToArrayBuffer, convertArrayBufferToBuffer, removeExtension } = require('../utils/utils');

async function generateKey() {
  return await gostCrypto.subtle.generateKey('GOST 28147', false, ['encrypt', 'decrypt']);
}

async function exportKey(key) {
  const exportedKey = await gostCrypto.subtle.exportKey('raw', key);

  return convertArrayBufferToBuffer(exportedKey);
}

async function importKey(keyData) {
  const keyArrayBuffer = convertBufferToArrayBuffer(keyData);

  return await gostCrypto.subtle.importKey('raw', keyArrayBuffer, 'GOST 28147', false, ['encrypt', 'decrypt']);
}

async function encryptData(key, dataBuffer) {
  const data = convertBufferToArrayBuffer(dataBuffer);

  const encryptedArrayBuffer = await gostCrypto.subtle.encrypt(
    'GOST 28147-ECB',
    key,
    data
  );

  return convertArrayBufferToBuffer(encryptedArrayBuffer);
}

async function decryptData(key, dataBuffer) {
  const encryptedData = convertBufferToArrayBuffer(dataBuffer);

  const decryptedData = await gostCrypto.subtle.decrypt('GOST 28147-ECB', key, encryptedData);

  return convertArrayBufferToBuffer(decryptedData);
}

const gostEcb = async (args) => {
  if (args[0] && args[1] && args[2] === '/e') {
    console.log('Info: Encryption process was started...');

    const processData = async (data, key, writeStream) => {
      if (data) {
        const encryptedData = await encryptData(key, data);
        writeStream.write(encryptedData);
      }
    };

    const done = (exportedKeyBuffer, keyWriteStream) => {
      keyWriteStream.write(convertArrayBufferToBuffer(exportedKeyBuffer));
      console.log('Done: Encryption process is successfully complete.');
    };

    const key = await generateKey();
    const exportedKeyBuffer = await exportKey(key);
    
    const writeStream = fs.createWriteStream(`${args[0]}.encrypted`, { flags: 'w' });
    const keyWriteStream = fs.createWriteStream(args[1], { flags: 'w' });
    const readStream = fs.createReadStream(args[0], { highWaterMark: READ_BUFFER_SIZE });

    readStream.on('readable', () => processData(readStream.read(), key, writeStream));
    readStream.on('error', (error) => {
      console.log(error);
    });
    readStream.on('end', () => done(exportedKeyBuffer, keyWriteStream));
  } else if (args[0] && args[1] && args[2] === '/d') {
    console.log('Info: Decryption process was started...');

    const processData = async (data, key, writeStream) => {
      if (data) {
        const encryptedData = await decryptData(key, data);
        writeStream.write(encryptedData);
      }
    };

    const done = () => {
      console.log('Done: Decryption process is successfully complete.');
    };

    fs.readFile(args[1], async (error, keyData) => {
      const key = await importKey(keyData);
      const writeStream = fs.createWriteStream(`decrypted_${removeExtension(args[0])}`, { flags: 'w' });
      const readStream = fs.createReadStream(args[0], { highWaterMark: READ_BUFFER_SIZE });

      readStream.on('readable', () => processData(readStream.read(), key, writeStream));
      readStream.on('error', (error) => {
        console.log(error);
      });
      readStream.on('end', done);
    });
  } else {
    throw new Error('Invalid arguments!');
  }
};

module.exports = gostEcb;


