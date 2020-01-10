const Scene = require("../scene");

class Play extends Scene {
    constructor() {
        super("Play");
    }
    init() {
        super.init();
    }
    preload() {
        super.preload();
    }
    create() {
        super.create();
        this.runSpace("max");
        // setTimeout(() => {
        //     this.pauseSpace();
        // }, 6000);
    }
}

module.exports = Play;