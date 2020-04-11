class BitStream {
  constructor(buffer) {
    this.buffer = buffer;
    this.position = -1;
  }

  readBit() {
    this.position++;
    const byteIndex = Math.floor(this.position / 8);
    const bitIndex = this.position % 8;
    // binary representation of byte
    let bitString = this.buffer[byteIndex].toString(2);
    // bitstring padding (8bits)
    bitString = '00000000'.substr(bitString.length) + bitString;
    // lookup individual bit
    return bitString[bitIndex] === '1';
  }

  readBits(count) {
    let bitString = '';
    for (let i = 0; i < count; i++) {
      const bit = this.readBit() ? 1 : 0;
      bitString += bit;
    }
    return parseInt(bitString, 2);
  }

  writeBit() {
    console.log('Not implemented');
  }
}

module.exports = BitStream;
