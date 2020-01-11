const Platform = require("./gameObject/platform");

class Scene extends Phaser.Scene {
    constructor(name) {
        super(name);
        this.name = name;
        this.keepLog = [];
        this.lock = true;
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
        this.ground.speed = { current: 0, pause: 0, min: 2, mid: 3, max: 4 };
        // add city
        this.city = this.add.tileSprite(0, this.game.config.height * 0.8, this.game.config.width, 109, "city")
            .setOrigin(0, 1)
            .setDepth(1);
        this.city.speed = { current: 0, pause: 0, min: 0.2, mid: 0.4, max: 0.6 };
        this.line = this.add.graphics(0, 0)
            .fillStyle(0xf4d242, 1)
            .fillRect(0, (this.game.config.height * 0.8), this.game.config.width, 3)
            .setDepth(1);
        // add cloud
        this.cloud = this.add.tileSprite(0, this.game.config.height * 0.6, this.game.config.width, 105, "cloud")
            .setOrigin(0, 1)
            .setDepth(2);
        this.cloud.speed = { current: 0, pause: 0, min: -0.4, mid: -0.6, max: -0.8 };
        // load platform
        this.title = this.add.text(this.game.config.width * 0.5, this.game.config.height * 0.15, "", {
            font: `${(this.game.device.os.desktop ? "160" : "100")}px '${this.game.font}'`,
            fill: "#FFF8EE"
        }).setOrigin(0.5);
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