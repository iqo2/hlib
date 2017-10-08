const ROOT_NODE = 0;
const UCHAR_MAX = 255;
const INDEX_BIT_COUNT = 13;
const LENGTH_BIT_COUNT = 8;
const WINDOW_SIZE = 1 << 13;
const BREAK_EVEN = (1 + INDEX_BIT_COUNT + LENGTH_BIT_COUNT) % 9;
const SYMBOL_COUNT = (1+ UCHAR_MAX) + (1 << LENGTH_BIT_COUNT);

class AdaptiveHuffman {

	constructor(bitStream) {
		this.symbolCount = SYMBOL_COUNT;
		this.bitStream = bitStream;
		if (this.symbolCount % 2 === 1) {
			this.symbolCount++;
		}
		if (this.symbolCount < 2) {
			this.symbolBits = 1;
		} else {
			this.symbolBits = 0;
			let i = 1;
			while (i < this.symbolCount) {
				i = i << 1;
				this.symbolBits++;
			}
		}
		this.nodes = [
			{ child: ROOT_NODE + 1, isLeaf: false, weight: 2, parent: -1 },
			{ child: this.symbolCount, isLeaf: true, weight: 1, parent: ROOT_NODE },
			{ child: this.symbolCount + 1, isLeaf: true, weight: 1, parent: ROOT_NODE },
		];
		this.leafs = new Array((this.symbolCount + 2));
		this.leafs.fill(-1);
		this.leafs[this.symbolCount] = ROOT_NODE + 1;
		this.leafs[this.symbolCount + 1] = ROOT_NODE + 2;
		this.next = ROOT_NODE + 3;
	}

	getEndOfStreamSymbol() {
		return this.symbolCount;
	}

	decodeSymbol() {
		let currentNode = ROOT_NODE;
		while(!this.nodes[currentNode].isLeaf) {
			// walk down the huffman tree using bits set in encoded stream
			// http://eng-jaeger.blogspot.be/2012/05/adaptive-huffman-coding.html
			currentNode = this.nodes[currentNode].child;
			if (this.bitStream.readBit()) currentNode++;
		}
		let result = this.nodes[currentNode].child;
		if (result === this.symbolCount + 1) {
			result = this.bitStream.readBits(this.symbolBits);
			this.addNode(result);
		}
		this.updateModel(result);
		return result;
	}

	addNode(symbol) {
		const lightestNode = this.next - 1;
		const newNode = this.next;
		const zeroWeightNode = this.next + 1;
		this.next += 2;
		// make a child of lichtest node
		this.nodes[newNode] = { ...this.nodes[lightestNode], parent: lightestNode };
		this.leafs[this.nodes[newNode].child] = newNode;
		// assign this child to the parent
		this.nodes[lightestNode].child = newNode;
		this.nodes[lightestNode].isLeaf = false;
		// add new symbol to the tree with weight 0
		this.nodes[zeroWeightNode] = { child: symbol, isLeaf: true, weight: 0, parent: lightestNode };
		this.leafs[symbol] = zeroWeightNode;
	}

	updateModel(symbol) {
		if (false) {//this.nodes[0].weight == 0x8000) {
			this.RebuildTree()
		}
		let currentNode = this.leafs[symbol];
		while (currentNode !== -1) {
			this.nodes[currentNode].weight++
			let newNode = currentNode;
			while (newNode > ROOT_NODE) {
				if (this.nodes[newNode - 1].weight >= this.nodes[currentNode].weight) {
					break;
				}
				newNode--;
			}
			if (currentNode !== newNode) {
				this.swapNodes(currentNode, newNode);
				currentNode = newNode;
			}
			currentNode = this.nodes[currentNode].parent;
		}
	}

	swapNodes(i,j) {
		if (this.nodes[i].isLeaf) {
			this.leafs[this.nodes[i].child] = j;
		} else {
			this.nodes[this.nodes[i].child].parent = j;
			this.nodes[this.nodes[i].child + 1].parent = j;
		}
		if (this.nodes[j].isLeaf) {
			this.leafs[this.nodes[j].child] = i;
		} else {
			this.nodes[this.nodes[j].child].parent = i;
			this.nodes[this.nodes[j].child + 1].parent = i;
		}
		const iNode = { ...this.nodes[j], parent: this.nodes[i].parent };
		const jNode = { ...this.nodes[i], parent: this.nodes[j].parent };
		this.nodes[i] = iNode;
		this.nodes[j] = jNode;
	}

	rebuildTree() {
		console.log('--------------->', 'not implemented');
	}
}

module.exports = AdaptiveHuffman;