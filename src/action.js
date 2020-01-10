const debug = "@@debug";
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
