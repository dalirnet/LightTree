(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const debug = true;
const fontFamily = "Cute Font";
const Game = require("./lib/game");

WebFont.load({
    google: {
        families: [fontFamily]
    },
    active() {
        const gameObject = new Game(fontFamily, debug);
    }
});

},{"./lib/game":2}],2:[function(require,module,exports){
// load scenes
const BootScene = require("./scene/boot");
const HelpScene = require("./scene/help");
const PlayScene = require("./scene/play");

class Game extends Phaser.Game {
    constructor(font, debug = false) {
        if (debug) {
            console.time("Game");
        }
        super({
            renderer: Phaser.AUTO,
            antialias: true,
            backgroundColor: "#fcf1de",
            pixelArt: false,
            roundPixels: true,
            autoCenter: true,
            banner: debug,
            disableContextMenu: !debug,
            scale: {
                mode: Phaser.Scale.RESIZE,
                parent: "game",
                width: window.innerWidth,
                height: window.innerHeight
            },
            scene: [
                BootScene,
                HelpScene,
                PlayScene
            ]
        });
        this.font = font;
        this.debug = debug;
    }
    start() {
        super.start();
        document.querySelector("#game canvas").style.opacity = 1;
        if (this.debug) {
            console.timeEnd("Game");
        }
        this.scale.on("resize", () => {
            document.querySelector("#game canvas").style.opacity = 0;
            this.config.width = window.innerWidth;
            this.config.height = window.innerHeight;
            this.scene.getScene("Play").scene.stop();
            this.scene.getScene("Help").scene.stop();
            this.scene.getScene("Boot").scene.restart();
            setTimeout(() => {
                document.querySelector("#game canvas").style.opacity = 1;
            }, 250);
        });
    }
    sceneLog(name, log) {
        if (this.debug) {
            console.groupCollapsed(`%cScene Log [${name}]`, "color: green;");
            console.table(log);
            console.groupEnd();
        }
    }
}

module.exports = Game;
},{"./scene/boot":9,"./scene/help":10,"./scene/play":11}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
class Lamp extends Phaser.GameObjects.Sprite {
    constructor(scene, count = 2, status = false, currect = true) {
        super(scene, 0, scene.game.config.height * 0.8, `lamp-${count}-${(status == true ? "on" : "off")}`);
        this.scene = scene;
        this.gameCheck = true;
        this.isCurrect = currect;
        this.lightStatus = status;
        this.setOrigin(0, 0.96)
            .setScale((this.scene.game.device.os.desktop ? 0.8 : 0.6))
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
},{}],5:[function(require,module,exports){
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
        if (this.level.current > (this.scene.game.device.os.desktop ? 5 : 8)) {
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
},{"./bench":3,"./lamp":4,"./pole":6,"./tree":7}],6:[function(require,module,exports){
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
        this.setOrigin(0, 0.97)
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

module.exports = Pole;
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
const Platform = require("./gameObject/platform");

class Scene extends Phaser.Scene {
    constructor(name) {
        super(name);
        this.name = name;
        this.keepLog = [];
        this.lock = true;
        this.helpOpen = false;
    }
    log(message = null, system = false) {
        if (this.game.debug && message) {
            this.keepLog.push({
                message,
                bySystem: system
            });
        }
        return this.keepLog;
    }
    init() {
        this.log("init", true);
    }
    preload() {
        this.log("preload", true);
    }
    create() {
        // add ground
        this.ground = this.add.tileSprite(-2, this.game.config.height + 2, this.game.config.width + 4, this.game.config.height * 0.2, "ground")
            .setOrigin(0, 1)
            .setTileScale((this.game.device.os.desktop ? 1 : 0.6))
            .setDepth(0);
        this.ground.speed = {
            current: 0,
            pause: 0,
            min: (this.game.device.os.desktop ? 2.5 : 2),
            mid: (this.game.device.os.desktop ? 3.5 : 3),
            max: (this.game.device.os.desktop ? 4.5 : 4),
        };
        // add city
        this.city = this.add.tileSprite(0, this.game.config.height * 0.8, this.game.config.width, 109, "city")
            .setOrigin(0, 1)
            .setDepth(1);
        this.city.speed = {
            current: 0,
            pause: 0,
            min: 0.2,
            mid: 0.4,
            max: 0.6
        };
        this.line = this.add.graphics(0, 0)
            .fillStyle(0xf4d242, 1)
            .fillRect(0, (this.game.config.height * 0.8), this.game.config.width, 3)
            .setDepth(1);
        // add cloud
        this.cloud = this.add.tileSprite(0, this.game.config.height * 0.6, this.game.config.width, 105, "cloud")
            .setOrigin(0, 1)
            .setDepth(2);
        this.cloud.speed = {
            current: 0,
            pause: 0,
            min: -0.4,
            mid: -0.6,
            max: -0.8
        };
        // load platform
        this.title = this.add.text(this.game.config.width * 0.5, this.game.config.height * 0.15, "", {
            font: `${(this.game.device.os.desktop ? "160" : "100")}px '${this.game.font}'`,
            fill: "#FFF8EE"
        }).setOrigin(0.5);
        // add help
        this.helpBtn = this.add.text(25, this.game.config.height - 20, "?", {
            font: `${(this.game.device.os.desktop ? "40" : "30")}px '${this.game.font}'`,
            fill: "#FFF8EE"
        }).setOrigin(0, 1)
            .setInteractive()
            .on("pointerdown", () => {
                if (!this.helpOpen) {
                    this.scene.start("Help");
                } else {
                    this.scene.start("Boot");
                }
            }, this);
        // add fullscreen
        this.fullscreenBtn = this.add.text(this.game.config.width - 25, this.game.config.height - 20, "⎚", {
            font: `${(this.game.device.os.desktop ? "40" : "30")}px '${this.game.font}'`,
            fill: "#FFF8EE"
        }).setOrigin(1, 1)
            .setInteractive()
            .on("pointerdown", () => {
                if (this.scale.isFullscreen) {
                    this.scale.stopFullscreen();
                } else {
                    this.scale.startFullscreen();
                }
            }, this);
        // end of scene
        this.log("create", true);
        this.game.sceneLog(this.name, this.keepLog);
    }
    update() {
        if (this.lock) return;
        if (this.ground.speed.current) {
            this.platform.run(this.ground.speed.current);
            this.ground.tilePositionX += (this.game.device.os.desktop ? this.ground.speed.current : this.ground.speed.current * 1.6);
            if (this.city.speed.current) {
                this.city.tilePositionX += this.city.speed.current;
            }
        }
        if (this.cloud.speed.current) {
            this.cloud.tilePositionX += this.cloud.speed.current;
        }
    }
}

module.exports = Scene;
},{"./gameObject/platform":5}],9:[function(require,module,exports){
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
        this.load.image("help", "data/help.png");
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
        this.helpOpen = false;
        if (this.game.config.height > this.game.config.width) {
            this.title.setText("Rotate!")
                .setDepth(20)
                .setTintFill(0xff0000, 0x000000)
                .setPosition(this.game.config.width / 2, (this.game.config.height * 0.8) / 2);
            this.tweens.add({
                targets: this.title,
                scale: { from: 0.95, to: 1.05 },
                duration: 150,
                yoyo: true,
                repeat: -1
            });
        } else {
            if (this.game.config.width < 480 || this.game.config.height < 320) {
                this.title.setText("Screen!")
                    .setDepth(20)
                    .setTintFill(0xff0000, 0x000000)
                    .setPosition(this.game.config.width / 2, (this.game.config.height * 0.8) / 2);
                this.tweens.add({
                    targets: this.title,
                    scale: { from: 0.95, to: 1.05 },
                    duration: 150,
                    yoyo: true,
                    repeat: -1
                });
            } else {
                this.title.setText("Light Tree").setTintFill(0xf4d242);
                this.btn = this.add.sprite(0, 0, "play")
                    .setOrigin(0.5)
                    .setPosition(this.game.config.width / 2, (this.game.config.height / 2) + (this.game.config.height * 0.1))
                    .setDepth(10)
                    .setScale(0.3)
                    .setInteractive()
                    .on("pointerdown", () => {
                        this.scene.start("Play");
                    }, this);
                this.tweens.add({
                    targets: this.btn,
                    x: {
                        from: this.game.config.width * 0.497,
                        to: this.game.config.width * 0.503
                    },
                    duration: 300,
                    yoyo: true,
                    repeat: -1
                });
            }
        }
    }
}

module.exports = Boot;
},{"../scene":8}],10:[function(require,module,exports){
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
},{"../scene":8}],11:[function(require,module,exports){
const Scene = require("../scene");
const Platform = require("../gameObject/platform");

class Play extends Scene {
    constructor() {
        super("Play");
        this.lock = false;
    }
    init() {
        super.init();
    }
    preload() {
        super.preload();
    }
    create() {
        super.create();
        this.lock = false;
        this.helpOpen = false;
        this.platform = new Platform(this);
        if (this.game.config.height > this.game.config.width) {
            this.title.setText("Rotate!");
            this.tweens.add({
                targets: this.title,
                angle: { from: -5, to: 5 },
                duration: 150,
                yoyo: true,
                repeat: -1
            });
        } else {
            if (this.game.config.width < 480 || this.game.config.height < 320) {
                this.title.setText("Screen!");
                this.tweens.add({
                    targets: this.title,
                    y: 50,
                    duration: 150,
                    yoyo: true,
                    repeat: -1
                });
            } else {
                this.platform.show();
                this.runSpace();
            }
        }
    }
    runSpace(speed = "min", object = []) {
        if (!object.length) {
            object = ["ground", "city", "cloud"];
        }
        for (let index in object) {
            this[object[index]].speed.current = this[object[index]].speed[speed];
        }
    }
    pauseSpace() {
        this.lock = true;
        this.ground.speed.current = this.ground.speed.pause;
        this.city.speed.current = this.city.speed.pause;
        this.cloud.speed.current = this.cloud.speed.pause;
    }
}

module.exports = Play;
},{"../gameObject/platform":5,"../scene":8}]},{},[1])

//# sourceMappingURL=action.js.map
