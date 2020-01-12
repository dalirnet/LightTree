const Scene = require("../scene");

class Help extends Scene {
    constructor() {
        super("Help");
    }
    init() {
        super.init();
    }
    preload() {
        super.preload();

    }
    create() {
        super.create();
        // hide boot scene object
        this.ground.setVisible(false);
        this.city.setVisible(false);
        this.cloud.setVisible(false);
        this.line.setVisible(false);
        this.fullscreenBtn.setVisible(false);
        // add help image
        this.helpImage = this.add.image(0, 0, "help")
            .setOrigin(0.5)
            .setScale((this.game.device.os.desktop ? 0.6 : 0.4))
            .setDepth(5)
            .setPosition(this.game.config.width / 2, this.game.config.height / 2)
            .setInteractive()
            .on("pointerdown", () => {
                this.scene.start("Boot");
            }, this);
        this.helpOpen = true;
        this.helpBtn.setText("«").setTintFill(0x000000);
    }
}

module.exports = Help;