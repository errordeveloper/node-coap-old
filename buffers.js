module.exports = function UnsignedUtils () {

  var write = [];

  write[4] = function write32(buffer, value, offset) {
    buffer[offset]   = (value >>> 0x18) & 0xff;
    buffer[offset+1] = (value >>> 0x10) & 0xff;
    buffer[offset+2] = (value >>> 0x08) & 0xff;
    buffer[offset+3] = (value) & 0xff;
  }

  write[3] = function write24(buffer, value, offset) {
    buffer[offset]     = (value >>> 0x10) & 0xff;
    buffer[offset + 1] = (value >>> 0x08) & 0xff;
    buffer[offset + 2] = (value) & 0xff;
  }

  write[2] = function write16(buffer, value, offset) {
    buffer[offset]   = (value >>> 0x08) & 0xff;
    buffer[offset+1] = (value) & 0xff;
  }

  write[1] = function write8(buffer, value, offset) {
    buffer[offset] = (value) & 0xff;
  }

  write[0] = undefined; //FIXME?

  var read = [];

  read[4] = function read32(buffer, offset) {
    return 0xffffffff & (
      (buffer[offset]   << 0x18) |
      (buffer[offset+1] << 0x10) |
      (buffer[offset+2] << 0x08) |
      (buffer[offset+3])
    );
  }

  read[3] = function read24(buffer, offset) {
    return 0xffffff & (
      (buffer[offset]   << 0x10) |
      (buffer[offset+1] << 0x08) |
      (buffer[offset+2])
    );
  }

  read[2] = function read16(buffer, offset) {
    return 0xffff & (
      (buffer[offset]   << 0x08) |
      (buffer[offset+1])
    );
  }

  read[1] = function read8(buffer, offset) {
    return 0xff & (
      (buffer[offset])
    );
  }

  read[0] = undefined; //FIXME?

  return { write: write, read: read }
}
