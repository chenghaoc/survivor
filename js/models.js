class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = CONFIG.player.radius;
    this.speed = CONFIG.player.speed;
    this.shootCooldown = 0;
    this.shootInterval = CONFIG.player.shootInterval;
    this.maxHealth = CONFIG.player.maxHealth;
    this.health = this.maxHealth;
    this.invincibilityFrames = 0;
    this.bulletSize = CONFIG.bullet.radius;
    this.bulletSpeed = CONFIG.bullet.speed;
    this.bulletTypes = ["normal"];
    this.spreadShotUnlocked = false;
    this.piercingShotUnlocked = false;
    this.explosiveShotUnlocked = false;
    this.currentBulletTypeIndex = 0;
    this.unlockedBulletTypes = ["normal"];
  }

  move(dx, dy) {
    this.x = Math.max(
      this.radius,
      Math.min(CONFIG.canvas.width - this.radius, this.x + dx * this.speed)
    );
    this.y = Math.max(
      this.radius,
      Math.min(CONFIG.canvas.height - this.radius, this.y + dy * this.speed)
    );
  }

  cycleBulletType() {
    this.currentBulletTypeIndex =
      (this.currentBulletTypeIndex + 1) % this.bulletTypes.length;
  }

  shoot(enemies) {
    if (this.shootCooldown <= 0 && enemies.length > 0) {
      this.shootCooldown = this.shootInterval;

      let bullets = [];
      for (let bulletType of this.unlockedBulletTypes) {
        switch (bulletType) {
          case "spread":
            bullets = bullets.concat(this.shootSpread(enemies));
            break;
          case "piercing":
            bullets.push(this.shootPiercing(enemies));
            break;
          case "explosive":
            bullets.push(this.shootExplosive(enemies));
            break;
          default:
            bullets.push(this.shootNormal(enemies));
        }
      }
      return bullets;
    } else {
      this.shootCooldown--;
      return null;
    }
  }

  shootNormal(enemies) {
    let closestEnemy = enemies[0];
    let closestDistance = Infinity;

    for (let enemy of enemies) {
      let distance = Math.hypot(enemy.x - this.x, enemy.y - this.y);
      if (distance < closestDistance) {
        closestEnemy = enemy;
        closestDistance = distance;
      }
    }

    this.shootCooldown = this.shootInterval;
    return new Bullet(
      this.x,
      this.y,
      closestEnemy,
      this.bulletSize,
      this.bulletSpeed,
      "normal"
    );
  }

  shootSpread(enemies) {
    let bullets = [];
    const angles = [-15, 0, 15]; // Spread angles in degrees
    for (let angle of angles) {
      const radAngle = (angle * Math.PI) / 180;
      const adjustedTarget = {
        x:
          Math.cos(radAngle) * (enemies[0].x - this.x) -
          Math.sin(radAngle) * (enemies[0].y - this.y) +
          this.x,
        y:
          Math.sin(radAngle) * (enemies[0].x - this.x) +
          Math.cos(radAngle) * (enemies[0].y - this.y) +
          this.y,
      };
      bullets.push(
        new Bullet(
          this.x,
          this.y,
          adjustedTarget,
          this.bulletSize,
          this.bulletSpeed,
          "spread"
        )
      );
    }
    return bullets;
  }

  shootPiercing(enemies) {
    let closestEnemy = enemies[0];
    let closestDistance = Infinity;

    for (let enemy of enemies) {
      let distance = Math.hypot(enemy.x - this.x, enemy.y - this.y);
      if (distance < closestDistance) {
        closestEnemy = enemy;
        closestDistance = distance;
      }
    }

    return new Bullet(
      this.x,
      this.y,
      closestEnemy,
      this.bulletSize * 1.2,
      this.bulletSpeed * 1.5,
      "piercing"
    );
  }

  shootExplosive(enemies) {
    // Implement explosive shot logic
    return this.shootNormal(enemies);
  }

  takeDamage(amount) {
    if (this.invincibilityFrames <= 0) {
      this.health -= amount;
      this.invincibilityFrames = CONFIG.player.invincibilityFrames;
      return this.health <= 0;
    }
    return false;
  }

  update() {
    if (this.invincibilityFrames > 0) {
      this.invincibilityFrames--;
    }
  }
}
class Enemy {
  constructor(type) {
    this.type = type || this.getRandomType();
    this.x = Math.random() * CONFIG.canvas.width;
    this.y = Math.random() * CONFIG.canvas.height;
    this.radius = CONFIG.enemy[this.type].radius;
    this.speed = CONFIG.enemy[this.type].speed;
    this.health = CONFIG.enemy[this.type].health;
    this.color = CONFIG.enemy[this.type].color;
    this.movementCounter = 0;
  }

  getRandomType() {
    const types = ["basic", "fast", "tank", "zigzag"];
    return types[Math.floor(Math.random() * types.length)];
  }

  move(playerX, playerY) {
    switch (this.type) {
      case "basic":
        this.moveTowardsPlayer(playerX, playerY);
        break;
      case "fast":
        this.moveTowardsPlayer(playerX, playerY);
        break;
      case "tank":
        if (this.movementCounter % 3 === 0) {
          this.moveTowardsPlayer(playerX, playerY);
        }
        break;
      case "zigzag":
        this.moveZigZag(playerX, playerY);
        break;
    }
    this.movementCounter++;
  }

  moveTowardsPlayer(playerX, playerY) {
    const angle = Math.atan2(playerY - this.y, playerX - this.x);
    this.x += Math.cos(angle) * this.speed;
    this.y += Math.sin(angle) * this.speed;
  }

  moveZigZag(playerX, playerY) {
    const angle = Math.atan2(playerY - this.y, playerX - this.x);
    const zigzagAngle =
      angle + (Math.sin(this.movementCounter * 0.1) * Math.PI) / 4;
    this.x += Math.cos(zigzagAngle) * this.speed;
    this.y += Math.sin(zigzagAngle) * this.speed;
  }

  isCollidingWith(entity) {
    const distance = Math.hypot(this.x - entity.x, this.y - entity.y);
    return distance < this.radius + entity.radius;
  }
}

class Bullet {
  constructor(x, y, target, radius, speed, type) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
    this.target = target;
    this.type = type;
  }

  move() {
    if (this.target) {
      const angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
      this.x += Math.cos(angle) * this.speed;
      this.y += Math.sin(angle) * this.speed;
    }
  }

  // Add these new methods
  isOutOfBounds(canvasWidth, canvasHeight) {
    return (
      this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight
    );
  }

  isCollidingWith(entity) {
    const distance = Math.hypot(this.x - entity.x, this.y - entity.y);
    return distance < this.radius + entity.radius;
  }
}
