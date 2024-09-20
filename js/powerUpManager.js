class PowerUpManager {
  constructor() {
    this.activePowerUp = null;
    this.powerUpEndTime = 0;
  }

  activatePowerUp(powerUp, player) {
    this.activePowerUp = powerUp;
    this.powerUpEndTime = Date.now() + CONFIG.powerUp.duration;

    switch (powerUp.name) {
      case "fireRate":
        player.shootInterval /= powerUp.multiplier;
        break;
      case "bulletSize":
        player.bulletSize *= powerUp.multiplier;
        break;
      case "playerSpeed":
        player.speed *= powerUp.multiplier;
        break;
      case "bulletSpeed":
        player.bulletSpeed *= powerUp.multiplier;
        break;
      case "spreadShot":
        if (!player.unlockedBulletTypes.includes("spread")) {
          player.unlockedBulletTypes.push("spread");
        }
        break;
      case "piercingShot":
        if (!player.unlockedBulletTypes.includes("piercing")) {
          player.unlockedBulletTypes.push("piercing");
        }
        break;
      case "explosiveShot":
        if (!player.unlockedBulletTypes.includes("explosive")) {
          player.unlockedBulletTypes.push("explosive");
        }
        break;
    }
  }

  deactivatePowerUp(player) {
    if (this.activePowerUp) {
      switch (this.activePowerUp.name) {
        case "fireRate":
          player.shootInterval *= this.activePowerUp.multiplier;
          break;
        case "bulletSize":
          player.bulletSize /= this.activePowerUp.multiplier;
          break;
        case "playerSpeed":
          player.speed /= this.activePowerUp.multiplier;
          break;
        case "bulletSpeed":
          player.bulletSpeed /= this.activePowerUp.multiplier;
          break;
      }
      this.activePowerUp = null;
    }
  }

  update(player) {
    if (this.activePowerUp && Date.now() > this.powerUpEndTime) {
      this.deactivatePowerUp(player);
    }
  }

  getRandomPowerUps(count) {
    const shuffled = CONFIG.powerUp.types.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}
