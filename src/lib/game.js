const BootScene = require("./scenes/boot");

class Game extends Phaser.Game {
    constructor(width = window.innerWidth, height = window.innerHeight, debug = false) {
        if (debug) {
            console.time("Game");
        }
        super({
            width: width,
            height: height,
            renderer: Phaser.AUTO,
            parent: "game",
            antialias: true,
            backgroundColor: "#fcf1de",
            banner: debug,
            scene: [
                BootScene
            ]
        });
        this.debug = debug;
    }
    start() {
        super.start();
        if (this.debug) {
            console.timeEnd("Game");
            console.groupCollapsed("%cScenes Log", "color:green;");
            for (let index in this.scene.scenes) {
                console.table(this.scene.scenes[index].log());
            }
            console.groupEnd();
        }
    }
}

module.exports = Game;