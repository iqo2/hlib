const BitStream       = require('./bitstream');
const AdaptiveHuffman = require('./ahuffman');

const ROOT_NODE = 0;
const UCHAR_MAX = 255;
const INDEX_BIT_COUNT = 13;
const LENGTH_BIT_COUNT = 8;
const WINDOW_SIZE = 1 << 13;
const BREAK_EVEN = (1 + INDEX_BIT_COUNT + LENGTH_BIT_COUNT) % 9;
const SYMBOL_COUNT = (1+ UCHAR_MAX) + (1 << LENGTH_BIT_COUNT);

class LZSS {

	constructor(buffer) {
		this.currentPosition = 1;
		this.lastMatchedPosition = 0;
		this.bitStream = new BitStream(buffer);
		this.huffman = new AdaptiveHuffman(this.bitStream);
		this.window = [];
		this.output = [];
	}

	decode(symbol) {
		const matchLength = symbol - (1 + UCHAR_MAX) + BREAK_EVEN;
		this.lastMatchedPosition = (this.lastMatchedPosition + this.bitStream.readBits(INDEX_BIT_COUNT)) & (WINDOW_SIZE - 1);
		for (let i=0; i<matchLength - 1; i++) {
			const decoded = this.window[this.lastMatchedPosition + i] & (WINDOW_SIZE - 1);
			this.window[this.currentPosition] = decoded;
			this.moveCurrentPosition();
			this.output.push(decoded);
		}
	}

	moveCurrentPosition() {
		this.currentPosition = (this.currentPosition + 1) & (WINDOW_SIZE - 1);
	}

	expand() {
		const symbol = this.huffman.decodeSymbol();
		if (symbol === this.huffman.getEndOfStreamSymbol()) {
			return new Buffer(this.output);
		}
		if (symbol < 1 + UCHAR_MAX) {
			this.output.push(symbol);
			this.window[this.currentPosition] = symbol;
			this.moveCurrentPosition();
		} else {
			this.decode(symbol);
		}

		return this.expand();
	}

}

module.exports = LZSS;