const TreeSprite = require("./tree");
const PoleSprite = require("./pole");
const BenchSprite = require("./bench");
const LampSprite = require("./lamp");

class Platform extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene, 0, 0);
        this.scene = scene;
        this.level = {
            score: 0
        };
        this.scope = {
            available: "three",
            one: {
                status: "active",
                keep: 20,
                el: this.scene.add.container(this.scene.game.config.width * 0.5, 0)
            },
            two: {
                status: "active",
                keep: 20,
                el: this.scene.add.container(this.scene.game.config.width * 1.5, 0)
            },
            three: {
                status: "pause",
                keep: 20,
                el: this.scene.add.container(this.scene.game.config.width, 0)
            },
        };
        this.area(this.scope.one.el, 0xff0000);
        this.area(this.scope.two.el, 0x00ff00);
        this.area(this.scope.three.el, 0x0000ff);
        // add title
        this.title = this.scene.add.text(this.scene.game.config.width * 0.5, this.scene.game.config.height * 0.15, "", {
            font: `${(this.scene.game.device.os.desktop ? "160" : "100")}px '${this.scene.game.font}'`,
            fill: "#FFF8EE"
        }).setText(`LightTree${this.scene.game.debug ? this.scene.name.charAt(0) : ""}`).setOrigin(0.5);
        this.add([this.title, this.scope.one.el, this.scope.two.el, this.scope.three.el]).setDepth(10);
        // set limit
        this.limit = this.scene.game.config.width * -1;
        this.scene.add.existing(this);
        this.addContent(this.scope.one);
        this.addContent(this.scope.two);
    }
    addContent(scope) {
        // do {
        let space = Phaser.Math.Between(20, this.scene.game.config.width * 0.1);

        let lightCount = Phaser.Math.Between(0, 4);
        let tree = new TreeSprite(this.scene, Phaser.Math.Between(1, 6), lightCount).show().setX(scope.keep + space);
        scope.el.add(tree);
        scope.keep += tree.width + space;

        let pole = new PoleSprite(this.scene).show().setX(scope.keep + space);
        scope.el.add(pole);
        scope.keep += pole.displayWidth + space;

        let bench = new BenchSprite(this.scene).show().setX(scope.keep + space);
        scope.el.add(bench);
        scope.keep += bench.displayWidth + space;

        let lamp = new LampSprite(this.scene, 1, false, false).show().setX(scope.keep + space);
        scope.el.add(lamp);
        scope.keep += lamp.displayWidth + space;

        // }
        // while (scope.keep <= scope.el.width * 0.8);
    }
    removeContent(scope) {
        scope.status = "pause";
        scope.el.x = Math.abs(this.limit);
        scope.el.each((child) => {
            if (child.gameCheck) {
                console.log(child);
            }
            // child.destroy();
        });
        scope.el.removeAll(true);
        scope.keep = 20;
    }
    run(speed = 0) {
        if (speed) {
            this.level.score += speed;
            if (this.scope.one.status == "active") {
                this.scope.one.el.x -= speed;
                if (this.scope.one.el.x <= this.limit) {
                    this.removeContent(this.scope.one);
                    this.scope.available = "one";
                    this.scope.three.status = "active";
                    this.addContent(this.scope.three);
                }
            }
            if (this.scope.two.status == "active") {
                this.scope.two.el.x -= speed;
                if (this.scope.two.el.x <= this.limit) {
                    this.removeContent(this.scope.two);
                    this.scope.available = "two";
                    this.scope.one.status = "active";
                    this.addContent(this.scope.one);
                }
            }
            if (this.scope.three.status == "active") {
                this.scope.three.el.x -= speed;
                if (this.scope.three.el.x <= this.limit) {
                    this.removeContent(this.scope.three);
                    this.scope.available = "three";
                    this.scope.two.status = "active";
                    this.addContent(this.scope.two);
                    // test
                    // this.scene.pauseSpace();
                }
            }
            this.title.setText(Math.round(this.level.score / 10).toString().padStart(6, "0"));
        }
    }
    area(scope, color) {
        scope.setSize(this.scene.game.config.width - 40, (this.scene.game.config.height * 0.8) - 40)
        let areaStart = this.scene.add.graphics(0, 0)
            .fillStyle(color, 0.5)
            .fillRect(10, 10, 2, scope.height + 20);
        let areaEnd = this.scene.add.graphics(0, 0)
            .fillStyle(color, 0.5)
            .fillRect(scope.width - 10, 10, 2, scope.height + 20);
        scope.add([areaStart, areaEnd]);
        return this;
    }
}

module.exports = Platform;