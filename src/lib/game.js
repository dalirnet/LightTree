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