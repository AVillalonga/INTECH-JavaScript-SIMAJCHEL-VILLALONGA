import { Cell, CellUI, CellUITest } from "./cellHelper.js";
import { Clock } from "./clock.js";
import { DemineurUI, DemineurUITest } from "./demineurUI.js";

/**
 * Sorry, pas eu le temps de faire les testes car toute notre data est contenu dans la DOM.
 * Pour mettre en place les testes, il aurait suffit d'overrider les méthodes de 'DemineurUITest' et 'CellUITest',
 * en implementant les propriétés du Node dans l'objet Cell.
 */


export class Demineur {
    UI; cellUI; clock; nbBombs;


    get isWin() {
        return this.cellUI.getVisibleCells().length >= this.cellUI.getAllCells().length - this.nbBombs;
    }

    /** CONSTRUCTOR */
    constructor(production) {
        this.UI = production ? new DemineurUI() : new DemineurUITest();
        this.cellUI = production ? new CellUI() : new CellUITest();
        this.clock = new Clock(this.UI);
        this.buildGrid();
    }

    /*** TRIGGER ON FIRST CLICK ***/
    start(firstCell) {
        this.loadBombs(firstCell); // Load bombs
        this.clock.start();
    }

    /** TRIGGER ON WIN AND GAMEOVER */
    stop() {
        this.clock.reboot();
        CellUI.clearCells();
        this.cellUI.revealAll();
    }

    /** RESTART GAME */
    restart() {
        this.UI.clearGrid();
        this.clock.reboot();
        this.buildGrid();
    }

    /** CREATE EMPTY GRID */
    buildGrid() {
        const difficulty = this.UI.difficultyValue;
        const gridNodes = new Array(difficulty).fill().map((e, y) => {
            return Array(difficulty).fill().map((e2, x) => {
                return this.cellUI.newCell(
                    x,
                    y,
                    this.onLeftClick.bind(this),
                    (e) => { e.preventDefault(); this.cellUI.toggleFlag(e.target); }
                );
            });
        });
        this.UI.buildGrid(gridNodes);
    }

    loadBombs(firstCell) {
        const fCx = this.cellUI.getCellX(firstCell);
        const fCy = this.cellUI.getCellY(firstCell);
        const difficulty = this.UI.difficultyValue;
        
        let nbBombs = this.nbBombs = difficulty * Math.floor(difficulty / 7);
        while (nbBombs != 0) {
            const randomNode = this.cellUI.getRandomCell(difficulty);
            const cx = this.cellUI.getCellX(randomNode);
            const cy = this.cellUI.getCellY(randomNode);
            if (!this.cellUI.isBomb(randomNode) && cx !== fCx && cy !== fCy) {
                this.cellUI.setBomb(randomNode);
                nbBombs = nbBombs - 1;
            }
        }
    }

    onLeftClick(e) {
        const node = e.target;
        
        if (this.clock.startedAt === null) this.start(node);

        if (this.cellUI.isClickable(node)) {
            this.cellUI.display(node);
            
            if (this.cellUI.isBomb(node)) this.UI.toggleGameOver(); // GAME OVER
            else if (this.isWin) this.UI.toggleWin(); // WIN

            if (this.isWin || this.cellUI.isBomb(node)) this.stop(); // STOP GAME 

            if (this.cellUI.getCellValue(node) === 0) this.recursiveUnhide0Cells(node);
        }
    }

    recursiveUnhide0Cells(node) {
        this.cellUI.getCellAroundPos(node).forEach((cell, index) => {
            if (cell !== null &&
                this.cellUI.isHidden(cell) &&
                !this.cellUI.isBomb(cell)) {
                this.cellUI.display(cell);
                if (this.cellUI.getCellValue(cell) === 0) {
                    this.recursiveUnhide0Cells(cell);
                }
            }
        })
    }

}

const demineur = new Demineur(1);
demineur.UI.play.addEventListener('click', demineur.restart.bind(demineur));