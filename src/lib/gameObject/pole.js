class Pole extends Phaser.GameObjects.Sprite {
    constructor(scene, type = "0") {
        let poleType = {
            "-2": "-2",
            "-1": "-1",
            "0": "",
            "1": "+1",
            "2": "+2"
        };
        super(scene, 0, scene.game.config.height * 0.8, `pole${poleType[type]}`);
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