'use strict';

// eslint-disable-next-line no-unused-vars
class Scene3 extends Phaser.Scene {
  constructor() {
    super(`endGame`);
  }

  create() {
    const gameOverText = `GAME OVER!!!\n\nYou Scored ${finalScore}.`;

    // eslint-disable-next-line no-magic-numbers
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
  const id = prompt(`What is your id?`);
  insertHighScore(id, finalScore);
}

function insertHighScore(id, score) {
  const highScore = {
    id,
    score
  };
  $.post(`/api/highscores`, highScore);
}
