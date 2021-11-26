export class Clock {
    startedAt   = null;
    interval    = null;
    UI;

    constructor(UI) {
        this.UI = UI;
    }

    get timeDiff() {
        const min10 = v => v > 9 ? v : `0${v}`;
        const diff = Math.floor(((new Date()).getTime() - this.startedAt.getTime()) / 1000);
        return { minutes: min10(Math.floor(diff / 60)), secondes: min10(Math.floor(diff % 60)) }
    }

    get timeDiffToStr() { return `${this.timeDiff.minutes}:${this.timeDiff.secondes}`; }

    start() {
        this.startedAt = new Date(); // Starting At
        this.interval = setInterval(this.display.bind(this), 150); // Run Chrono
    }

    reboot() {
        this.startedAt = null;
        clearInterval(this.interval); 
    }

    display() { this.UI.timer.innerText = `${this.timeDiffToStr}`; }
}