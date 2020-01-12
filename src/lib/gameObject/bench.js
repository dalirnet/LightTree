class Bench extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        super(scene, 0, scene.game.config.height * 0.8, "bench");
        this.scene = scene;
        this.setOrigin(0, 0.85)
            .setScale((this.scene.game.device.os.desktop ? 0.8 : 0.6))
            .setDepth(4);
        //
        return this;
    }
    show() {
        this.scene.add.existing(this);
        return this;
    }
}

module.exports = Bench;