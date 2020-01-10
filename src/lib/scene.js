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