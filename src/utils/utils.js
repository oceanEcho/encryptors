const convertArrayBufferToString = (buf) => {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
};

const convertStringToArrayBuffer = (str) => {
  let buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  let bufView = new Uint16Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};

const convertBufferToArrayBuffer = (buf) => {
  let ab = new ArrayBuffer(buf.length);
  let view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
};

const convertArrayBufferToBuffer = (ab) => {
  let buf = Buffer.alloc(ab.byteLength);
  let view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    buf[i] = view[i];
  }
  return buf;
};

const removeExtension = (filename) => {
  return filename.split('.').slice(0, -1).join('.');
};

module.exports = {
  convertArrayBufferToString,
  convertStringToArrayBuffer,
  convertBufferToArrayBuffer,
  convertArrayBufferToBuffer,
  removeExtension,
};