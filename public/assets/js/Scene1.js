'use strict';

class Scene1 extends Phaser.Scene {
  constructor() {
    //names this scene
    super('bootGame');
  }

  preload() {
    this.load.image('background', 'assets/images/space-tile.png');

    //image loading commented out to leave for refernce.
    //name the image for the first argument, establish the path in the second
    //this.load.image('ship', 'assets/images/ship.png');
    //this.load.image('ship2', 'assets/images/ship2.png');
    //this.load.image('ship3', 'assets/images/ship3.png');

    //load the entire spritesheet
    //frame dimensions are the size of the single sprite
    this.load.spritesheet('ship', 'assets/spritesheets/ship.png', {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet('ship2', 'assets/spritesheets/ship2.png', {
      frameWidth: 32,
      frameHeight: 16
    });
    this.load.spritesheet('ship3', 'assets/spritesheets/ship3.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('explosion', 'assets/spritesheets/explosion.png', {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet('power-up', 'assets/spritesheets/power-up.png', {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet('player', 'assets/spritesheets/player.png', {
      frameWidth: 16,
      frameHeight: 24
    });
    this.load.spritesheet('beam', 'assets/spritesheets/beam.png', {
      frameWidth: 16,
      frameHeight: 16
    });
    // this.load.spritesheet('robot-run', 'assets/spritesheets/robot-run.png', {
    //   frameWidth: 567,
    //   frameHeight: 556
    // });

    //load a font, the png is the image, the xml is the mapping
    this.load.bitmapFont(
      'pixelFont',
      'assets/font/font.png',
      'assets/font/font.xml'
    );
  }

  create() {
    this.add.text(20, 20, 'Loading Game...');

    //calls the scene to start when the preloading is done, 'playGam' is named in scene 2
    this.scene.start('playGame');

    this.anims.create({
      //name to refer to later
      key: 'ship1_anim',
      //references spritesheet,
      //second argument can specify an object with start and finish frames
      frames: this.anims.generateFrameNumbers('ship'),
      //control speed
      frameRate: 20,
      //-1 loops forever (or the duration of the trigger)
      repeat: -1
    });
    this.anims.create({
      key: 'ship2_anim',
      frames: this.anims.generateFrameNumbers('ship2'),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: 'ship3_anim',
      frames: this.anims.generateFrameNumbers('ship3'),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers('explosion'),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true
    });

    //these have different frames for different animations,
    //but the sprite will still have the same rules
    this.anims.create({
      key: 'red',
      frames: this.anims.generateFrameNumbers('power-up', {
        start: 0,
        end: 1
      }),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: 'gray',
      frames: this.anims.generateFrameNumbers('power-up', {
        start: 2,
        end: 3
      }),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: 'thrust',
      frames: this.anims.generateFrameNumbers('player'),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: 'beam_anims',
      frames: this.anims.generateFrameNumbers('beam'),
      frameRate: 20,
      repeat: -1
    });
    //demo of the object with start & finish frames
    // this.anims.create({
    //   key: 'robot-anim',
    //   frames: this.anims.generateFrameNumbers('robot-run', {
    //     start: 0,
    //     end: 7
    //   }),
    //   frameRate: 16,
    //   repeat: -1
    // });
  }
}
