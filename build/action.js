(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const debug = true;
const font = "Cute Font";
const Game = require("./lib/game");

WebFont.load({
    google: {
        families: [font]
    },
    active() {
        // new game
        const gameObject = new Game(window.innerWidth, window.innerHeight, font, debug);
    }
});

},{"./lib/game":2}],2:[function(require,module,exports){
// load scenes
const BootScene = require("./scenes/boot");
const PlayScene = require("./scenes/play");

class Game extends Phaser.Game {
    constructor(width = window.innerWidth, height = window.innerHeight, font, debug = false) {
        if (debug) {
            console.time("Game");
        }
        super({
            renderer: Phaser.AUTO,
            antialias: true,
            backgroundColor: "#fcf1de",
            pixelArt: true,
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
        if (this.debug) {
            console.timeEnd("Game");
        }
        this.scale.on("resize", () => {
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
},{"./scenes/boot":4,"./scenes/play":5}],3:[function(require,module,exports){
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
        this.log("create", true);
        this.game.sceneLog(this.name, this.keepLog);
        this.ground = this.add.tileSprite(-2, this.game.config.height + 2, this.game.config.width + 4, this.game.config.height * 0.2, "ground")
            .setOrigin(0, 1)
            .setTileScale((this.game.device.os.desktop ? 1 : 0.6))
            .setDepth(0);
        this.ground.speed = { current: 0, pause: 0, min: 0.4, mid: 0.8, max: 1 };
        this.city = this.add.tileSprite(0, this.game.config.height * 0.8, this.game.config.width, 109, "city")
            .setOrigin(0, 1)
            .setDepth(1);
        this.city.speed = { current: 0, pause: 0, min: 0.2, mid: 0.4, max: 0.8 };
        this.cloud = this.add.tileSprite(0, this.game.config.height * 0.7, this.game.config.width, 105, "cloud")
            .setOrigin(0, 1)
            .setDepth(2);
        this.cloud.speed = { current: 0, pause: 0, min: -0.2, mid: 0.4, max: 0.8 };
        this.title = this.add.text(this.game.config.width * 0.5, this.game.config.height * 0.2, `LightTree${this.game.debug ? this.name.charAt(0) : ""}`, {
            font: `${(this.game.device.os.desktop ? "160" : "100")}px '${this.game.font}'`,
            fill: "#FFF8EE"
        }).setOrigin(0.5);
    }
    update() {
        if (this.ground.speed.current) {
            this.ground.tilePositionX += this.ground.speed.current;
        }
        if (this.city.speed.current) {
            this.city.tilePositionX += this.city.speed.current;
        }
        if (this.cloud.speed.current) {
            this.cloud.tilePositionX += this.cloud.speed.current;
        }
    }
    runSpace(object = [], speed = "min") {
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
},{}],4:[function(require,module,exports){
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
    }
    create() {
        super.create();
        //



        setTimeout(() => {
            this.scene.start("Play");
            // this.runSpace();

        }, 3000);
        // console.log(this.game.device.os.desktop);
    }

}

module.exports = Boot;
},{"../scene":3}],5:[function(require,module,exports){
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
        this.runSpace(["cloud"]);
    }
}

module.exports = Play;
},{"../scene":3}]},{},[1])

//# sourceMappingURL=action.js.map
