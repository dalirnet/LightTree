const TreeSprite = require("./tree");
const PoleSprite = require("./pole");
const BenchSprite = require("./bench");
const LampSprite = require("./lamp");

class Platform extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene, 0, 0);
        this.scene = scene;
        this.level = {
            requestCount: Math.round(scene.game.config.width / 180),
            keepResponse: [],
            data: [],
            current: 1,
            score: 0
        };
        this.scope = {
            available: "three",
            one: {
                status: "active",
                keep: 20,
                el: this.scene.add.container((this.scene.game.config.width + 100), 0)
            },
            two: {
                status: "active",
                keep: 20,
                el: this.scene.add.container((this.scene.game.config.width * 2) + 100, 0)
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
        this.add([this.scope.one.el, this.scope.two.el, this.scope.three.el]).setDepth(10);
        // set limit
        this.limit = this.scene.game.config.width * -1;
    }
    show() {
        this.scene.add.existing(this);
        // init start content
        this.addContent(this.scope.one);
        this.addContent(this.scope.two);
    }
    initRequest() {
        this.level.data = [];
        for (let i = 1; i <= this.level.requestCount; i++) {
            this.level.data.push(this.createRequest(this.level.current, (i == this.level.requestCount ? true : Phaser.Utils.Array.GetRandom([true, false]))));
        }
        if (this.level.current > (this.scene.game.device.os.desktop ? 2 : 4)) {
            this.scene.runSpace("mid");
        }
        if (this.level.current > (this.scene.game.device.os.desktop ? 5 : 10)) {
            this.scene.runSpace("max");
        }
        this.level.current++;
    }
    createRequest(level, createResponse = true) {
        let worldLevel = Math.ceil(level / 3);
        let request = {
            count: 0,
            light: Phaser.Math.Between(0, worldLevel),
            pole: {
                status: (Phaser.Math.Between(1, 12) >= 8 ? true : false),
                more: 0
            }
        };
        if (request.light > 4) {
            request.light = 4;
        }
        if (request.pole.status && (request.light > 0 && request.light <= 2)) {
            request.pole.more = Phaser.Utils.Array.GetRandom([-1, -2, 1, 2]);
            if (request.light + request.pole.more < 0) {
                request.pole.more = 0;
            }
        }
        request.count = request.light + request.pole.more;
        let currect = [];
        let wrong = [];
        if (this.level.keepResponse.length >= 2) {
            createResponse = true;
        }
        if (createResponse) {
            for (let index in this.level.keepResponse) {
                currect.push(this.level.keepResponse[index]);
            }
            this.level.keepResponse = [];
        }
        let needLamp = request.count;
        while (needLamp > 0) {
            let select = 1;
            if (needLamp > 1) {
                select = (request.light >= 2 ? 2 : Phaser.Utils.Array.GetRandom([1, 2]));
            }
            currect.push(select);
            needLamp -= select;
        }
        if (!createResponse) {
            for (let index in currect) {
                this.level.keepResponse.push(currect[index]);
            }
            currect = [];
        }
        for (let i = 0; i < currect.length / 2; i++) {
            wrong.push(Phaser.Math.Between(1, 2));
        }
        return {
            request,
            currect,
            wrong
        };
    }
    addContent(scope) {
        if (!this.level.data.length) {
            this.initRequest();
        }
        let maxWidth = scope.el.width * (this.scene.game.device.os.desktop ? 0.8 : 0.6);
        let container = this.scene.add.container(0, 0);
        scope.el.add(container);
        while (scope.keep <= maxWidth && this.level.data.length) {
            let data = this.level.data.shift();
            // add tree
            let treeSpace = Phaser.Math.Between(10, 30);
            let tree = new TreeSprite(this.scene, Phaser.Math.Between(1, 6), data.request.light).show().setX(scope.keep + treeSpace);
            scope.keep += tree.width + treeSpace;
            container.add(tree);
            if (!data.request.pole.status) {
                // add bench
                if (Phaser.Math.Between(1, 2) == 2) {
                    let benchSpace = Phaser.Math.Between(10, 20);
                    let bench = new BenchSprite(this.scene).show().setX(scope.keep + benchSpace);
                    scope.keep += bench.displayWidth + benchSpace;
                    container.add(bench);
                }
            }
            else {
                // add pole
                let poleSpace = Phaser.Math.Between(5, 15);
                let pole = new PoleSprite(this.scene, data.request.pole.more).show().setX(scope.keep + poleSpace);
                scope.keep += pole.displayWidth + poleSpace;
                container.add(pole);
            }
            let lamps = [];
            // add currect lamps
            for (let index in data.currect) {
                let lampSpace = Phaser.Math.Between(10, 20);
                let lampItem = new LampSprite(this.scene, data.currect[index], Phaser.Utils.Array.GetRandom([false, true]), true)
                    .show()
                    .setFlipX((data.currect[index] == 1 ? Phaser.Utils.Array.GetRandom([false, true]) : false))
                    .setX(scope.keep + lampSpace);
                scope.keep += lampItem.displayWidth + lampSpace;
                lamps.push(lampItem);
            }
            // add wrong lamps
            for (let index in data.wrong) {
                if (scope.keep <= maxWidth) {
                    let lampSpace = Phaser.Math.Between(10, 20);
                    let lampItem = new LampSprite(this.scene, data.wrong[index], Phaser.Utils.Array.GetRandom([false, true]), false)
                        .show()
                        .setFlipX((data.currect[index] == 1 ? Phaser.Utils.Array.GetRandom([false, true]) : false))
                        .setX(scope.keep + lampSpace);
                    scope.keep += lampItem.displayWidth + lampSpace;
                    lamps.push(lampItem);
                }
            }
            container.add(lamps);
        }
        container.x = ((scope.el.width - scope.keep) / 2);
    }
    removeContent(scope) {
        scope.status = "pause";
        let gameOver = false;
        scope.el.last.each((child) => {
            child.setAlpha(0.3);
            if (child.gameCheck) {
                if (child.isCurrect != child.lightStatus) {
                    child.setAlpha(1).setTintFill(0xff0000, 0x000000);
                    gameOver = true;
                }
            }
        });
        if (gameOver) {
            this.scene.pauseSpace();

            if (this.scope.one.status == "active") {
                this.scene.tweens.add({
                    targets: this.scope.one.el,
                    x: this.scene.game.config.width * 1.2,
                    duration: 800,
                    ease: Phaser.Math.Easing.Back.In
                });
            }
            if (this.scope.two.status == "active") {
                this.scene.tweens.add({
                    targets: this.scope.two.el,
                    x: this.scene.game.config.width * 1.2,
                    duration: 800,
                    ease: Phaser.Math.Easing.Back.In
                });
            }
            if (this.scope.three.status == "active") {
                this.scene.tweens.add({
                    targets: this.scope.three.el,
                    x: this.scene.game.config.width * 1.2,
                    duration: 800,
                    ease: Phaser.Math.Easing.Back.In
                });
            }
            this.scene.tweens.add({
                targets: scope.el,
                x: 0,
                delay: 800,
                duration: 800,
                ease: Phaser.Math.Easing.Back.Out
            });
            this.scene.time.addEvent({
                delay: 1000,
                callback: () => {
                    this.scene.title.setText("Game Over").setDepth(20).setTintFill(0xff0000, 0x000000);
                },
                callbackScope: this.scene
            });
            this.scene.time.addEvent({
                delay: 6000,
                callback: () => {
                    this.scene.scene.start("Boot");
                },
                callbackScope: this.scene
            });
        } else {
            scope.el.x = Math.abs(this.limit);
            scope.el.removeAll(true);
            scope.keep = 20;
        }
    }
    run(speed = 0) {
        if (speed) {
            this.level.score += speed;
            if (this.scope.one.status == "active") {
                this.scope.one.el.x -= speed;
                if (this.scope.one.el.x <= this.limit) {
                    this.scope.available = "one";
                    this.scope.three.status = "active";
                    this.removeContent(this.scope.one);
                    this.addContent(this.scope.three);
                }
            }
            if (this.scope.two.status == "active") {
                this.scope.two.el.x -= speed;
                if (this.scope.two.el.x <= this.limit) {
                    this.scope.available = "two";
                    this.scope.one.status = "active";
                    this.removeContent(this.scope.two);
                    this.addContent(this.scope.one);
                }
            }
            if (this.scope.three.status == "active") {
                this.scope.three.el.x -= speed;
                if (this.scope.three.el.x <= this.limit) {
                    this.scope.available = "three";
                    this.scope.two.status = "active";
                    this.removeContent(this.scope.three);
                    this.addContent(this.scope.two);
                }
            }
            this.scene.title.setText(Math.round(this.level.score / 10).toString().padStart(5, "0"));
        }
    }
    area(scope, color) {
        scope.setSize(this.scene.game.config.width - 40, (this.scene.game.config.height * 0.8) - 40)
        if (false) {
            let areaStart = this.scene.add.graphics(0, 0)
                .fillStyle(color, 0.5)
                .fillRect(10, 10, 2, scope.height + 20);
            let areaEnd = this.scene.add.graphics(0, 0)
                .fillStyle(color, 0.5)
                .fillRect(scope.width + 20, 10, 2, scope.height + 20);
            scope.add([areaStart, areaEnd]);
        }
        return this;
    }
}

module.exports = Platform;