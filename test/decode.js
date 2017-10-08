const assert   = require('chai').assert;
const expect   = require('chai').expect;
const fs       = require('fs');
const { LZSS } = require('../');

describe('Decoding', () => {

	it('decodes compressed file', () => {
		const compressed = fs.readFileSync(`${__dirname}/data/compressed.bin`);
		const deflated = fs.readFileSync(`${__dirname}/data/deflated.bin`);
		const lzss = new LZSS(compressed);
		const deflatedByLib = lzss.expand();
		expect(deflated).to.eql(deflatedByLib);
	});

});