const fs = require('fs');
const crypto = require('crypto');

const checkFileHash = (readStream, done) => {
  const hash = crypto.createHash('sha256');

  readStream.on('readable', () => {
    const data = readStream.read();
    if (data) {
      hash.update(data);
    }
  });
  readStream.on('error', (error) => {
    console.log(error);
  });
  readStream.on('end',() => done(hash));
};

const hash = (args) => {
  if (args[0] && args[1] && args[2] === '/c') {
    console.log('Info: Hash creating process was started...');
  
    const readStream = fs.createReadStream(args[0]);

    const done = (hash) => {
      const hashWriteStream = fs.createWriteStream(args[1], { flags: 'w' });
      hashWriteStream.write(hash.digest('hex'));
      console.log(`Done: File hash has been created and writed to file ${args[1]}.`);
    };

    checkFileHash(readStream, done);
  } else if (args[0] && args[1] && args[2] === '/v') {
    console.log('Info: Hash verifying process was started...');

    const prevHash = fs.readFileSync(args[1]).toString();
  
    const readStream = fs.createReadStream(args[0]);

    const done = (hash) => {
      const digest = hash.digest('hex');
      if (digest === prevHash) {
        console.log('Done: File hash is correct.');
      } else {
        console.log('Done: Hashes doens\'t match.');
      }
    };

    checkFileHash(readStream, done);
  } else {
    throw new Error('Invalid arguments!');
  }
};

module.exports = hash;