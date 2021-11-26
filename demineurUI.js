export class DemineurUI {

    get main() { return document.querySelector('#demineur') }
    get play() { return document.querySelector('#demineur .play') }
    get pause() { return document.querySelector('#demineur .pause') }
    get timer() { return document.querySelector('#demineur .timer') }
    get grid() { return document.querySelector('#demineur .grid') }

    get difficultyNode() { return document.querySelector('#demineur .difficulty') }
    get difficultyValue() { return parseInt(this.difficultyNode.value) }

    clearGrid() {
        this.grid.innerHTML = '';
        this.grid.classList.remove('game_over', 'win');
    }

    buildGrid(gridNodes) {
        /** Construct row by row */
        gridNodes.forEach((rowChilds, Y) => {
            const rowNode = this.addGridRow();
            /** Set data Cell by cell */
            rowChilds.forEach((cell, X) => {
                rowNode.append(cell.node);
                cell.node.classList.add('hidden');
                cell.node.dataset.x = X;
                cell.node.dataset.y = Y;
                cell.node.dataset.value = 0;
            });
        });
    }

    addGridRow() {
        const row = document.createElement('div');
        this.grid.append(row);
        return row;
    }

    toggleGameOver() { this.grid.classList.toggle('game_over'); }

    toggleWin() { this.grid.classList.toggle('win') }

}

export class DemineurUITest extends DemineurUI {
    /** Not implemented */
}