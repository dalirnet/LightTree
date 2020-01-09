const Scene = require("../scene");

class Boot extends Scene {
    constructor() {
        super("Boot");
    }
    init() {
        super.init();
    }
    preload() {
        super.preload();
    }
    create() {
        super.create();
        this.log("amir");
    }
}

module.exports = new Boot();