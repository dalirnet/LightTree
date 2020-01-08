
class Game extends Phaser.Game {
    constructor(width = window.innerWidth, height = window.innerHeight) {
        super({
            width: width,
            height: height,
            renderer: Phaser.AUTO,
            parent: "game",
            transparent: true,
            antialias: true
        });
    }
}


const gameObject = new Game();


console.log(gameObject);