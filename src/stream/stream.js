const fs = require('fs');
const BitSet = require('bitset');

const { removeExtension } = require('../utils/utils');

const READ_BUFFER_SIZE = 512;
const BYTE_SIZE = 8;

const FIRST_REGISTER_LENGTH = 89;
const FIRST_REGISTER_SIGNIFICANT_BITS = [89, 6, 5, 3, 0];

const SECOND_REGISTER_LENGTH = 91;
const SECOND__REGISTER_SIGNIFICANT_BITS = [91, 8, 5, 1, 0];


const createHighBit  = (register, chekingBits) => {
  let result;

  chekingBits.forEach(bitNumber => {
    if (result !== undefined) {
      result = result ^ Number(register.get(bitNumber).toString());
    }
    result = Number(register.get(bitNumber).toString());
  });

  return result;
};


const shiftRight = (register) => {
  const shiftedRegister = register.toString().slice(0, -1);

  return new BitSet(shiftedRegister);
};

const encodeByte = (code, gamma) => {
  const codeBitSet = new BitSet(code);
  let gammedBinaryString = '';

  for (let i = BYTE_SIZE - 1; i >= 0; i--) {
    gammedBinaryString += String(Number(codeBitSet.get(i).toString()) ^ gamma());
  }
  return parseInt(gammedBinaryString, 2);
};

const processData = (data, gamma, writeStream, bytes) => {
  if (data && bytes > READ_BUFFER_SIZE) {
    let outputBuffer = [];
    
    for (const code of data) {
      outputBuffer.push(encodeByte(code, gamma));
    }

    writeStream.write(new Buffer.from(outputBuffer));
  } else if (data && bytes <= READ_BUFFER_SIZE) {
    writeStream.write(data);
  }
};

const GammaGenerator = (initialFirstRegister, initialSecondRegister) => {
  let firstRegister = initialFirstRegister;
  let secondRegister = initialSecondRegister;

  return () => {
    firstRegister = shiftRight(firstRegister)
      .set(FIRST_REGISTER_LENGTH, createHighBit(firstRegister, FIRST_REGISTER_SIGNIFICANT_BITS));

    const controlBit = Number(firstRegister.get(20).toString());

    if (controlBit) {
      secondRegister = shiftRight(secondRegister)
        .set(FIRST_REGISTER_LENGTH, createHighBit(secondRegister, SECOND__REGISTER_SIGNIFICANT_BITS));
    }
    
    return (
      Number(secondRegister.get(91).toString())
      || Number(secondRegister.get(89).toString())
    ) && Number(secondRegister.get(2).toString());
  };
};

const processReadWrite = (args, gamma, done) => {
  const writeName = args[2] === '/e' ? `${args[0]}.encrypted` : `decrypted_${removeExtension(args[0])}`;

  const writeStream = fs.createWriteStream(writeName, { flags: 'w' });
  const readStream = fs.createReadStream(args[0], { highWaterMark: READ_BUFFER_SIZE });

  readStream.on('readable', () => processData(readStream.read(), gamma, writeStream, readStream.bytesRead));
  readStream.on('error', (error) => {
    console.log(error);
  });
  readStream.on('end', () => done());
};

const stream = (args) => {
  if (args[0] && args[1] && args[2] === '/e') {
    console.log('Info: Encryption process was started...');

    let firstRegister = new BitSet.Random(FIRST_REGISTER_LENGTH + 1);
    let secondRegister = new BitSet.Random(SECOND_REGISTER_LENGTH + 1);

    const registers = {
      firstRegister: firstRegister.toString(),
      secondRegister: secondRegister.toString(),
    };

    const gamma = GammaGenerator(firstRegister, secondRegister);

    const done = () => {
      const registersWriteStream = fs.createWriteStream(args[1], { flags: 'w' });
      registersWriteStream.write(JSON.stringify(registers));
      console.log('Done: Encryption process is successfully complete.');
    };

    processReadWrite(args, gamma, done);
  } else if (args[0] && args[1] && args[2] === '/d') {
    console.log('Info: Decryption process was started...');

    const registersData =  fs.readFileSync(args[1]);
    const registers = JSON.parse(registersData);

    const firstRegister = new BitSet(registers.firstRegister);
    const secondRegister = new BitSet(registers.secondRegister);

    const gamma = GammaGenerator(firstRegister, secondRegister);

    const done = () => {
      console.log('Done: Decryption process is successfully complete.');
    };

    processReadWrite(args, gamma, done);
  } else {
    throw new Error('Invalid arguments!');
  }
};

module.exports = stream;