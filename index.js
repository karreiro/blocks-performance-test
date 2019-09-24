const canvas = document.querySelector("#canvas");
const blockWidth = 16;
const blockHeight = 19;
let blocks = [];
let renderedBlocks = [];

class Block {

    constructor(posX, posY, posZ) {
        this.posX = posX;
        this.posY = posY;
        this.posZ = posZ;
    }

    getElement() {

        let block = document.createElement("div");

        block.classList.add("block");
        block.style.left = this.getX() + "px";
        block.style.bottom = this.getY() + "px";
        block.style.zIndex = this.getZ();
        return block;
    }

    getX() {
        if (this.x === undefined) {
            this.x = (blockWidth * (this.posX + this.posY));
        }
        return this.x;
    }

    getY() {
        if (this.y === undefined) {
            this.y = (blockHeight * this.posZ) + (-9 * this.posY) + (9 * this.posX);
        }
        return this.y;
    }

    getZ() {
        if (this.zIndex === undefined) {
            this.zIndex = -this.posX + this.posY + this.posZ;
        }
        return this.zIndex;
    }
}

function processBlocks() {
    for (let z = 0; z < layers.length; z++) {
        for (let y = 0; y < layers[z].length; y++) {
            for (let x = 0; x < layers[z][y].length; x++) {
                if (layers[z][y][x] === 1) {
                    blocks.push(new Block(x, y, z))
                }
            }
        }
    }
}

function render(blocks) {
    blocks.forEach(block => {
        canvas.appendChild(block.getElement());
    });
}

function setTimeoutRender(blocks) {
    blocks.forEach(block => {
        setTimeout(() => canvas.appendChild(block.getElement()), 0);
    });
}

function visualRender(blocks) {

    let renderedMatrix = [];

    function initializeMatrix() {
        for (let i = 0; i < 800; i++) {
            for (let j = 0; j < 800; j++) {
                if (renderedMatrix[i] === undefined) {
                    renderedMatrix[i] = [];
                }
                if (renderedMatrix[i][j] === undefined) {
                    renderedMatrix[i][j] = [];
                }
                renderedMatrix[i][j] = 0;
            }
        }
    }

    function isRendered(block) {

        if (block.getX() > 800 || block.getY() > 800) {
            return true;
        }

        for (let i =  block.getX(); i < block.getX() + blockWidth; i++) {
            for (let j =  block.getY(); j < block.getY() + blockHeight; j++) {
                if (renderedMatrix[i][j] === 0) {
                    return false;
                }
            }
        }
        return true;
    }

    function asRendered(block) {
        for (let i =  block.getX(); i < block.getX() + blockWidth; i++) {
            for (let j =  block.getY(); j < block.getY() + blockHeight; j++) {
                renderedMatrix[i][j] = 1;
            }
        }
    }

    initializeMatrix();

    blocks
        .sort((blockA, blockB) => (blockA.getZ() > blockB.getZ()) ? -1 : 1)
        .forEach(block => {
            if (!isRendered(block)) {
                renderedBlocks.push(block);
                asRendered(block);
                setTimeout(() => canvas.appendChild(block.getElement()), 0);
            }
        });
}

let t0 = performance.now();
processBlocks();
let t1 = performance.now();
console.log("processBlocks: " + (t1 - t0) + "ms");

// 1st approach
// t0 = performance.now();
// render(blocks);
// t1 = performance.now();
// console.log("render: " + (t1 - t0) + "ms");

// 2nd approach
// t0 = performance.now();
// setTimeoutRender(blocks);
// t1 = performance.now();
// console.log("setTimeoutRender: " + (t1 - t0) + "ms");

// 3rd approach
// t0 = performance.now();
// visualRender(blocks);
// t1 = performance.now();
// console.log("visualRender: " + (t1 - t0) + "ms");
// console.log("Blocks: " + blocks.length);
// console.log("Rendered blocks: " + renderedBlocks.length);
