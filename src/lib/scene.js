class Scene extends Phaser.Scene {
    constructor(name) {
        super(name);
        this.name = name;
        this.keepLog = [];
    }
    log(message = null, system = false) {
        if (this.game.debug && message) {
            this.keepLog.push({
                scene: this.name,
                bySystem: system,
                message
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
    }
}

module.exports = Scene;