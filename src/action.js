const debug = "@@debug";
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
