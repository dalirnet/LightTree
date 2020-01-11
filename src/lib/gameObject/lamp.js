class Lamp extends Phaser.GameObjects.Sprite {
    constructor(scene, count = 2, status = false, currect = true) {
        super(scene, 0, scene.game.config.height * 0.8, `lamp-${count}-${(status == true ? "on" : "off")}`);
        this.scene = scene;
        this.gameCheck = true;
        this.isCurrect = currect;
        this.lightStatus = status;
        this.setOrigin(0, 0.98)
            .setScale(0.8)
            .setDepth(4)
            .setInteractive()
            .on("pointerdown", () => {
                this.lightStatus = !this.lightStatus;
                this.setTexture(`lamp-${count}-${(this.lightStatus ? "on" : "off")}`);
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