class Tree extends Phaser.GameObjects.Container {
    constructor(scene, type = "1", lightCount = 0) {
        super(scene, 0, scene.game.config.height * 0.8);
        this.scene = scene;
        let tree = this.scene.add.sprite(0, 0, `tree${type}`)
            .setScale((this.scene.game.device.os.desktop ? 0.7 : 0.5))
            .setOrigin(0, 0.91);
        this.add(tree);
        if (lightCount < 0 || lightCount > 4) {
            lightCount = 0;
        }
        if (lightCount) {
            let count = {
                w: 200,
                h: 230
            };
            switch (lightCount) {
                case 2: {
                    count.w *= 2;
                    break;
                }
                case 3: {
                    count.w *= 3;
                    break;
                }
                case 4: {
                    count.w *= 2;
                    count.h *= 2;
                    break;
                }
            }
            let light = this.scene.add.tileSprite(tree.displayWidth / 2, (tree.displayHeight * -1), count.w, count.h, "light")
                .setScale(0.13)
                .setOrigin(0.5, 1);
            this.add(light);
        }
        this.setDepth(4).setSize(tree.displayWidth, tree.displayHeight);
        //
        return this;
    }
    show() {
        this.scene.add.existing(this);
        return this;
    }
}

module.exports = Tree;