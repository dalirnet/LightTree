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