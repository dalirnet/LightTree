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
            window.location.reload();
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
},{"./scene/boot":9,"./scene/play":10}],3:[function(require,module,exports){
class Bench extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        super(scene, 0, scene.game.config.height * 0.8, "bench");
        this.scene = scene;
        this.setOrigin(0, 0.92)
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

module.exports = Bench;
},{}],4:[function(require,module,exports){
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
    }
    addContent(scope) {
        do {
            let space = Phaser.Math.Between(20, this.scene.game.config.width * 0.1);

            // let lightCount = Phaser.Math.Between(0, 4);
            // let tree = new TreeSprite(this.scene, Phaser.Math.Between(1, 6), lightCount).show().setX(scope.keep + space);
            // scope.el.add(tree);
            // scope.keep += tree.width + space;

            // let pole = new PoleSprite(this.scene).show().setX(scope.keep + space);
            // scope.el.add(pole);
            // scope.keep += pole.displayWidth + space;

            // let bench = new BenchSprite(this.scene).show().setX(scope.keep + space);
            // scope.el.add(bench);
            // scope.keep += bench.displayWidth + space;

            let lamp = new LampSprite(this.scene, 1, false, false).show().setX(scope.keep + space);
            scope.el.add(lamp);
            scope.keep += lamp.displayWidth + space;

        }
        while (scope.keep <= scope.el.width * 0.8);
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
                }
            }
            if (this.scope.two.status == "active") {
                this.scope.two.el.x -= speed;
                if (this.scope.two.el.x <= this.limit) {
                    this.removeContent(this.scope.two);
                    this.scope.available = "two";
                    this.scope.one.status = "active";
                }
            }
            if (this.scope.three.status == "active") {
                this.scope.three.el.x -= speed;
                if (this.scope.three.el.x <= this.limit) {
                    this.removeContent(this.scope.three);
                    this.scope.available = "three";
                    this.scope.two.status = "active";
                    // test
                    this.scene.pauseSpace();
                }
            }
            this.title.setText(Math.round(this.level.score).toString().padStart(6, "0"));
        }
    }
    area(scope, color) {
        scope.setSize(this.scene.game.config.width - 40, (this.scene.game.config.height * 0.8) - 40)
        let area = this.scene.add.graphics(0, 0)
            .fillStyle(color, 0.05)
            .fillRect(20, 20, scope.width, scope.height);
        scope.add(area);
        return this;
    }
}

module.exports = Platform;
},{"./bench":3,"./lamp":4,"./pole":6,"./tree":7}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
class Tree extends Phaser.GameObjects.Container {
    constructor(scene, type = "1", lightCount = 0) {
        super(scene, 0, scene.game.config.height * 0.8);
        this.scene = scene;
        let tree = this.scene.add.sprite(0, 0, `tree${type}`)
            .setScale(0.7)
            .setOrigin(0, 0.92);
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
        this.ground = this.add.tileSprite(-2, this.game.config.height + 2, this.game.config.width + 4, this.game.config.height * 0.2, "ground")
            .setOrigin(0, 1)
            .setTileScale((this.game.device.os.desktop ? 1 : 0.6))
            .setDepth(0);
        this.ground.speed = { current: 0, pause: 0, min: 0.4, mid: 0.8, max: 1 };
        this.city = this.add.tileSprite(0, this.game.config.height * 0.8, this.game.config.width, 109, "city")
            .setOrigin(0, 1)
            .setDepth(1);
        this.city.speed = { current: 0, pause: 0, min: 0.1, mid: 0.3, max: 0.6 };
        this.cloud = this.add.tileSprite(0, this.game.config.height * 0.7, this.game.config.width, 105, "cloud")
            .setOrigin(0, 1)
            .setDepth(2);
        this.cloud.speed = { current: 0, pause: 0, min: -0.2, mid: 0.4, max: 0.8 };
        // load platform
        if (this.name == "Play") {
            this.platform = new Platform(this);
        }
        // end of scene
        this.log("create", true);
        this.game.sceneLog(this.name, this.keepLog);
    }
    update() {
        if (this.ground.speed.current) {
            if (this.name == "Play") {
                this.platform.run(this.ground.speed.current);
            }
            this.ground.tilePositionX += (this.game.device.os.desktop ? this.ground.speed.current : this.ground.speed.current * 1.6);
            if (this.city.speed.current) {
                this.city.tilePositionX += this.city.speed.current;
            }
        }
        if (this.cloud.speed.current) {
            this.cloud.tilePositionX += this.cloud.speed.current;
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
        this.ground.speed.current = this.ground.speed.pause;
        this.city.speed.current = this.city.speed.pause;
        this.cloud.speed.current = this.cloud.speed.pause;
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
        this.scene.start("Play");
        //
        // setTimeout(() => {
        // }, 2000);
    }
}

module.exports = Boot;
},{"../scene":8}],10:[function(require,module,exports){
const Scene = require("../scene");

class Play extends Scene {
    constructor() {
        super("Play");
    }
    init() {
        super.init();
    }
    preload() {
        super.preload();
    }
    create() {
        super.create();
        this.runSpace("max");
        // setTimeout(() => {
        //     this.pauseSpace();
        // }, 6000);
    }
}

module.exports = Play;
},{"../scene":8}]},{},[1])

//# sourceMappingURL=action.js.map
