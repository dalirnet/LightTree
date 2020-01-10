class Pole extends Phaser.GameObjects.Sprite {
    constructor(scene, type = "") {
        super(scene, 0, scene.game.config.height * 0.8, `pole${type}`);
        this.scene = scene;
        this.setOrigin(0, 0.98)
            .setScale(0.8)
            .setDepth(4);
        //
        return this;
    }
    show() {
        this.scene.add.existing(this);
        return this;
    }
}

module.exports = Pole;