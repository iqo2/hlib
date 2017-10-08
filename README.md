AVG
===

## Installation
```sh
$ npm i hlib --save
```

## Usage
```js
const { LZSS } = require('hlib');
const compressed = fs.readFileSync(`${__dirname}/test/data/compressed.bin`);
const lzss = new LZSS(compressed);
const deflated = lzss.expand();
```

## That's it ;-)
