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
        this.runSpace(["cloud"]);
    }
}

module.exports = Play;