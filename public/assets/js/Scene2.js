'use strict';

let finalScore;
class Scene2 extends Phaser.Scene {
  constructor() {
    //Naming this scene, called in scene 1
    super('playGame');
  }

  create() {
    this.lives = 3;
    //this.background = this.add.image(0, 0, 'background');

    //call in background image
    this.background = this.add.tileSprite(
      0,
      0,
      config.width,
      config.height,
      'background'
    );

    //place it
    this.background.setOrigin(0, 0);

    //text not used, commented out for reference
    // this.add.text(20, 20, 'Playing game', {
    //   font: '25px Arial',
    //   fill: 'yellow'
    // });

    //images placed commented out
    // this.ship1 = this.add.image(
    //   config.width / 2 - 50,
    //   config.height / 2,
    //   'ship'
    // );
    // this.ship2 = this.add.image(config.width / 2, config.height / 2, 'ship2');
    // this.ship3 = this.add.image(
    //   config.width / 2 + 50,
    //   config.height / 2,
    //   'ship3'
    // );

    //placing sprites
    this.ship1 = this.add.sprite(
      config.width / 2 - 50,
      config.height / 2,
      'ship'
    );
    this.ship2 = this.add.sprite(config.width / 2, config.height / 2, 'ship2');
    this.ship3 = this.add.sprite(
      config.width / 2 + 50,
      config.height / 2,
      'ship3'
    );
    // this.robot = this.add.sprite(100, 100, 'robot-run');
    // this.robot.setScale(0.2, 0.2);

    //creating a group to hold sprites that can have rules applied to them collectively
    this.enemies = this.physics.add.group();
    this.enemies.add(this.ship1);
    this.enemies.add(this.ship2);
    this.enemies.add(this.ship3);

    //another group
    this.powerUps = this.physics.add.group();

    //creating objects to add to the second group
    //0 - 4 means 5 objects
    // const maxObjects = 4;
    // for (let i = 0; i <= maxObjects; ++i) {
    //   //places the sprite
    //   const powerUp = this.physics.add.sprite(16, 16, 'power-up');
    //   //adds it to the group
    //   this.powerUps.add(powerUp);
    //   //re-establishes a random position
    //   powerUp.setRandomPosition(0, 0, game.config.width, game.config.height);
    //   //decides which animation from the same sprite will play
    //   if (Math.random() > 0.5) {
    //     powerUp.play('red');
    //   } else {
    //     powerUp.play('gray');
    //   }
    //   //sets the speed of the sprite, x, y
    //   powerUp.setVelocity(Math.random() * 100, Math.random() * 100);
    //   //stops the object from going over the edges of the game
    //   powerUp.setCollideWorldBounds(true);
    //   //controls the bounciness
    //   powerUp.setBounce(1);
    // }

    //triggers the animation
    this.ship1.play('ship1_anim');
    this.ship2.play('ship2_anim');
    this.ship3.play('ship3_anim');

    // this.robot.play('robot-anim');

    //triggers sprites to be part of the game, with events
    this.ship1.setInteractive();
    this.ship2.setInteractive();
    this.ship3.setInteractive();

    //listens for contact anywhere on the canvas, callback function
    //NOT SURE ENTIRELY
    this.input.on('gameobjectdown', this.destroyShip, this);

    //inserts a new sprite to be controlled by the player
    this.player = this.physics.add.sprite(
      config.width / 2 - 8,
      config.height - 64,
      'player'
    );

    //triggers animation
    this.player.play('thrust');

    //assigns basic cursor keys object frequently used
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    //keep the player in bounds
    this.player.setCollideWorldBounds(true);

    //defines a property to hold a key
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    //a group to hold projectiles
    this.projectiles = this.add.group();

    //tells what to happen when two sprites interact
    this.physics.add.collider(this.projectiles, this.powerUps, function(
      projectile,
      powerUp
    ) {
      //calls destroy method on projectile
      projectile.destroy();
    });

    //what happens when a player and powerup touch (callback)
    this.physics.add.overlap(
      this.player,
      this.powerUps,
      this.pickPowerUp,
      null,
      this
    );

    //player and enemies touch
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.hurtPlayer,
      null,
      this
    );

    //projectile and enemies
    this.physics.add.overlap(
      this.projectiles,
      this.enemies,
      this.hitEnemy,
      null,
      this
    );

    //draws black box at top of game
    const graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(config.width, 0);
    graphics.lineTo(config.width, 20);
    graphics.lineTo(0, 20);
    graphics.lineTo(0, 0);
    graphics.closePath();
    graphics.fillPath();

    this.score = 0;
    this.scoreLabel = this.add.bitmapText(10, 5, 'pixelFont', 'SCORE ', 16);
    const scoreFormatted = this.zeroPad(this.score, 6);
    this.scoreLabel.text = `SCORE ${scoreFormatted}`;
    this.livesLeft = this.add.bitmapText(
      700,
      5,
      'pixelFont',
      'LIVES ' + this.lives,
      16
    );
    this.highScoreText = this.add.bitmapText(
      320,
      5,
      'pixelFont',
      `HIGH SCORE ${this.zeroPad(currentHighScore)} - ${highScorer}`
    );
  }

  //when the player hits a powerup, the powerup is invisible and inactive
  pickPowerUp(player, powerUp) {
    powerUp.disableBody(true, true);
    this.lives += 1;
    this.livesLeft.text = `LIVES ${this.lives}`;
  }

  //if the enemy hits the player
  hurtPlayer(player, enemy) {
    //the enemy resets
    this.resetShipPos(enemy);
    //if the player's opacity is less than whole
    if (this.player.alpha < 1) {
      //quite out of this function
      return;
    }
    //otherwise create a new explosion at this location
    const explosion = new Explosion(this, player.x, player.y);
    //make player invisible and inactive
    player.disableBody(true, true);
    //wait 1 second, then callback function
    this.time.addEvent({
      delay: 1000,
      callback: this.resetPlayer,
      callbackScope: this,
      loop: false
    });
  }

  resetPlayer() {
    //when this function called, lose a life
    this.lives -= 1;
    this.livesLeft.text = `LIVES ${this.lives}`;

    console.log(this.lives);
    //if the player has lives left
    if (this.lives > 0) {
      const x = config.width / 2 - 8;
      const y = config.height;
      //activate and place the player
      this.player.enableBody(true, x, y, true, true);
      //set opacity to less than one
      this.player.alpha = 0.5;
      //run tween sequence
      this.startTween();
    } else {
      //trigger scene 3 (not yet coded)
      finalScore = this.score;
      this.scene.start('endGame');
    }
  }

  startTween() {
    const tween = this.tweens.add({
      targets: this.player,
      y: config.height - 100,
      //different strings for different levels of transition
      ease: 'Power1',
      duration: 1500,
      repeat: 0,
      //this calls another tween
      onComplete: this.resetTween,
      callbackScope: this
    });
  }

  resetTween() {
    const tween2 = this.tweens.add({
      targets: this.player,
      y: config.height - 32,
      ease: 'Power1',
      duration: 1500,
      repeat: 0,
      onComplete: function() {
        //resets opacity
        this.player.alpha = 1;
      },
      callbackScope: this
    });
  }

  //what happens when an enemy is hit
  hitEnemy(projectile, enemy) {
    const explosion = new Explosion(this, enemy.x, enemy.y);
    projectile.destroy();
    this.resetShipPos(enemy);
    this.score += 15;
    //helper function to create extra zeros
    const scoreFormatted = this.zeroPad(this.score, 6);
    this.scoreLabel.text = `SCORE ${scoreFormatted}`;
  }

  //a function that moves the enemies on auto
  moveShip(ship, speed, pointsDeduction) {
    ship.y += speed;
    if (ship.y > config.height) {
      this.score -= pointsDeduction;
      const scoreFormatted = this.zeroPad(this.score, 6);
      this.scoreLabel.text = `SCORE ${scoreFormatted}`;
      this.resetShipPos(ship);
    }
  }

  //how to reset enemy ships, whether destroyed or from going below screen
  resetShipPos(ship) {
    ship.y = 0;
    const randomX = Phaser.Math.Between(0, config.width);
    ship.x = randomX;
  }

  //NOT ENTIRELY SURE
  destroyShip(pointer, gameObject) {
    gameObject.setTexture('explosion');
    gameObject.play('explode');
  }

  //This function is called over and over
  update() {
    //controls enemy movement
    this.moveShip(this.ship1, 1, 15);
    this.moveShip(this.ship2, 2, 10);
    this.moveShip(this.ship3, 3, 5);

    //moves background image
    this.background.tilePositionY -= 0.5;

    //allows player to shoot
    this.movePlayerManager();
    //justDown means pressed once
    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      if (this.player.active) {
        this.shootBeam();
      }
    }
    for (let i = 0; i < this.projectiles.getChildren().length; ++i) {
      const beam = this.projectiles.getChildren()[i];
      beam.update();
    }
  }

  shootBeam() {
    const beam = new Beam(this);
  }

  movePlayerManager() {
    if (this.cursorKeys.left.isDown) {
      this.player.setVelocityX(-gameSettings.playerSpeed);
    } else if (this.cursorKeys.right.isDown) {
      this.player.setVelocityX(gameSettings.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }
    if (this.cursorKeys.up.isDown) {
      this.player.setVelocityY(-gameSettings.playerSpeed);
    } else if (this.cursorKeys.down.isDown) {
      this.player.setVelocityY(gameSettings.playerSpeed);
    } else {
      this.player.setVelocityY(0);
    }
  }

  zeroPad(number, size) {
    if (number >= 0) {
      let stringNumber = String(number);
      while (stringNumber.length < (size || 2)) {
        stringNumber = '0' + stringNumber;
      }
      return stringNumber;
    } else {
      let stringNumber = String(number);
      const negative = stringNumber.substring(0, 1);
      let digits = stringNumber.substring(1);
      while (digits.length < (size || 2)) {
        digits = '0' + digits;
      }
      return negative + digits;
    }
  }
}
