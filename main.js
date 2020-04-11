const gostEcb = require('./src/gost-ecb/gost-ecb');
const stream = require('./src/stream/stream');
const hash = require('./src/hash/createHash');

const args = process.argv.slice(2);

if (args[0] === 'gost-ecb') {
  gostEcb(args.slice(1));
} else if (args[0] === 'stream') {
  stream(args.slice(1));
} else if (args[0] === 'hash') {
  hash(args.slice(1));
} else {
  throw new Error('Incorrect encryption type!');
}



