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
        this.load.image("ground", "data/ground.png");
        this.load.image("city", "data/city.png");
        this.load.image("cloud", "data/cloud.png");
    }
    create() {
        super.create();
        //



        setTimeout(() => {
            this.scene.start("Play");
            // this.runSpace();

        }, 3000);
        // console.log(this.game.device.os.desktop);
    }

}

module.exports = Boot;