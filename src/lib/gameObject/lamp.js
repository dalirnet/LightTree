class Lamp extends Phaser.GameObjects.Sprite {
    constructor(scene, count = 2, status = false, flip = false) {
        super(scene, 0, scene.game.config.height * 0.8, `lamp-${count}-${(status == true ? "on" : "off")}`);
        this.scene = scene;
        this.gameCheck = true;
        this.gameStatus = status;
        this.setOrigin(0, 0.98)
            .setScale(0.8)
            .setDepth(4)
            .setFlipX(flip)
            .setInteractive()
            .on("pointerdown", () => {
                this.gameStatus = !this.gameStatus;
                this.setTexture(`lamp-${count}-${(this.gameStatus ? "on" : "off")}`);
            }, this);
        //
        return this;
    }
    show() {
        this.scene.add.existing(this);
        return this;
    }
}

module.exports = Lamp;