declare namespace hlib {
  interface BitStream {}

  class LZSS {
    constructor(dataBuffer: Buffer);
    expand(): Buffer;
    decode(symbol: string): void;
    moveCurrentPosition(): void;
  }

  interface AdaptiveHuffman {}
}

export = hlib;
