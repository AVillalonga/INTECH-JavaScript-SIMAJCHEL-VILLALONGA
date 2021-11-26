export class Cell {
    static cells = [];

    node            = undefined;
    leftListener    = undefined;
    rightListener   = undefined;
    timeOut         = null;

    set x(value) { this.node.dataset.x = !isNaN(parseInt(value)) ? value : -666; }
    set y(value) { this.node.dataset.y = !isNaN(parseInt(value)) ? value : -666; }
    set value(value) { this.node.value = !isNaN(parseInt(value)) ? value : -777; }

    constructor(node, x, y, leftListener, rightListener) {
        this.node           = node;
        this.x              = x;
        this.y              = y;
        this.leftListener   = leftListener;
        this.rightListener  = rightListener;
        Cell.cells.push(this);
    }

}

export class CellUI {

    static timeOut_Cache = [];

    static clearCache() { CellUI.timeOut_Cache.forEach(tO => clearTimeout(tO)); }
    static clearCells() {
        Cell.cells.forEach(cell => {
            cell.node.removeEventListener('click', cell.leftListener, false);
            cell.node.removeEventListener('contextmenu', cell.rightListener, false)
        });
    }

    newCell(x, y, leftListener, rightListener) {
        const cell = new Cell(document.createElement('div'), x, y, leftListener, rightListener);
        cell.node.addEventListener('click', leftListener, false)
        cell.node.addEventListener('contextmenu', rightListener, false)
        return cell;
    }

    /** DOM */
    
    getCellByPos(x, y) { return document.querySelector(`[data-x="${x}"][data-y="${y}"]`) }

    getVisibleCells() {
        return [...document.querySelectorAll(`.grid div div:not(.hidden)`)];
    }

    getHiddenCells() {
        return [...document.querySelectorAll(`.grid div div.hidden`)];
    }

    getAllCells() {
        return [...document.querySelectorAll(`.grid div div`)];
    }

    getRandomCell(size) {
        const rand = (min, max) => Math.floor(Math.random() * (max - min) + min);
        return this.getCellByPos(rand(0, size), rand(0, size));
    }

    getCellAroundPos(node) {
        return [
            { x: -1, y: -1 },
            { x: 0, y: -1 },
            { x: 1, y: -1 },

            { x: -1, y: 0 },
            { x: 1, y: 0 },

            { x: -1, y: 1 },
            { x: 0, y: 1 },
            { x: 1, y: 1 }].map(e => this.getCellByPos(this.getCellX(node) + e.x, this.getCellY(node) + e.y));
    }

    getCellX(node) { return parseInt(node.dataset.x); }

    getCellY(node) { return parseInt(node.dataset.y); }

    getCellValue(node) { return parseInt(node.dataset.value); }

    isHidden(node) { return node.classList.contains('hidden'); }

    display(node) {
        node.classList.remove('hidden');
        const value = this.getCellValue(node);
        node.innerText = (value !== 0 && !this.isBomb(node)) ? value : '';

        if (this.isBomb(node)) {
            node.innerText = '💣';
            node.classList.add('bomb');
        }
    }

    isBomb(node) { return this.getCellValue(node) === -1 }

    setBomb(node) {
        node.dataset.value = -1;
        this.getCellAroundPos(node).forEach(cell => {
            if (cell !== null && !this.isBomb(cell)) cell.dataset.value = this.getCellValue(cell) + 1;
        });
    }

    isFlag(node) { return node.classList.contains('flag'); }

    toggleFlag(node) {
        node.innerText = node.classList.toggle('flag') ? '🚩' : '';
    }

    reveal(node) {
        this.display(node);
        node.classList.add('reveal');
    }

    revealAll() {
        CellUI.clearCache();
        this.getHiddenCells().forEach((hiddenCell, index) => {
            CellUI.timeOut_Cache.push(setTimeout(() => this.reveal(hiddenCell), 50 * index));
        });
    }

    isClickable(node) { return (!this.isFlag(node) && this.isHidden(node)); }
}

export class CellUITest extends CellUI {
    /** Not implemented */
}