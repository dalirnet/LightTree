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
        this.load.image("play", "data/play.png");
        //
        this.load.image("tree1", "data/tree1.png");
        this.load.image("tree2", "data/tree2.png");
        this.load.image("tree3", "data/tree3.png");
        this.load.image("tree4", "data/tree4.png");
        this.load.image("tree5", "data/tree5.png");
        this.load.image("tree6", "data/tree6.png");
        //
        this.load.image("light", "data/light.png");
        this.load.image("bench", "data/bench.png");
        //
        this.load.image("pole", "data/pole.png");
        this.load.image("pole-1", "data/pole-1.png");
        this.load.image("pole-2", "data/pole-2.png");
        this.load.image("pole+1", "data/pole+1.png");
        this.load.image("pole+2", "data/pole+2.png");
        //
        this.load.image("lamp-1-on", "data/lamp-1-on.png");
        this.load.image("lamp-1-off", "data/lamp-1-off.png");
        this.load.image("lamp-2-on", "data/lamp-2-on.png");
        this.load.image("lamp-2-off", "data/lamp-2-off.png");
    }
    create() {
        super.create();
        this.title.setText("Light Tree");
        this.btn = this.add.sprite(0, 0, "play")
            .setOrigin(0.5)
            .setPosition(this.game.config.width / 2, this.game.config.height / 2)
            .setDepth(10)
            .setScale(0.4)
            .setInteractive()
            .on("pointerdown", () => {
                this.scene.start("Play");
            }, this);;
        this.tweens.add({
            targets: this.btn,
            x: {
                from: this.game.config.width * 0.495,
                to: this.game.config.width * 0.505
            },
            duration: 300,
            yoyo: true,
            repeat: -1
        });
    }
}

module.exports = Boot;