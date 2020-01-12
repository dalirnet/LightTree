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