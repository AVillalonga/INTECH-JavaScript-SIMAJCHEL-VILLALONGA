import { Demineur } from './demineur.js';

class DemineurTest extends Demineur {
    static get difficulty() { return 7; }
}

function initTest(callback) {
    let demineur = new DemineurTest();
    callback(demineur);
}

initTest((demineur) => {
    console.log("testing"+ demineur.difficulty);
})
