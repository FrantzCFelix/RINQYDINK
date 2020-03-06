'use strict';

class Scene3 extends Phaser.Scene {
  constructor() {
    super('endGame');
  }

  create() {
    const gameOverText = `GAME OVER!!!\n\nYou Scored ${finalScore}.`;

    this.add.text(100, 100, gameOverText);

    this.time.addEvent({
      delay: 2000,
      callback: processScore,
      callbackScope: this,
      loop: false
    });
  }
}

function processScore() {
  const name = prompt('What is your name?');
  insertHighScore(name, finalScore);
}

function insertHighScore(name, score) {
  const highScore = {
    name,
    score
  };
  $.post(`/api/highscores`, highScore);
}
