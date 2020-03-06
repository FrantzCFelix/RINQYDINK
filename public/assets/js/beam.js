'use strict';

// eslint-disable-next-line no-unused-vars
class Beam extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    const x = scene.player.x;
    const y = scene.player.y;
    super(scene, x, y, `beam`);
    scene.add.existing(this);
    this.play(`beam_anims`);
    scene.physics.world.enableBody(this);
    this.body.velocity.y = -250;
    scene.projectiles.add(this);
  }

  update() {
    const maxHeight = 32;
    if (this.y < maxHeight) {
      this.destroy();
    }
  }
}
