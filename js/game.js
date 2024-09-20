class Game {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.canvas.width = CONFIG.canvas.width;
    this.canvas.height = CONFIG.canvas.height;

    this.renderer = new Renderer(this.canvas);
    this.powerUpManager = new PowerUpManager();
    console.log(this.canvas.width, this.canvas.height);
    this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
    this.enemies = [];
    this.bullets = [];

    this.score = 0;
    this.time = 0;
    this.killCount = 0;
    this.isChoosingPowerUp = false;
    this.availablePowerUps = [];

    this.gameLoopId = null;
    this.enemySpawnInterval = null;
    this.timeUpdateInterval = null;
    this.currentSpawnInterval = CONFIG.enemy.spawnInterval;

    this.keys = {};

    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener("keydown", (e) => this.handleKeyDown(e));
    window.addEventListener("keyup", (e) => this.handleKeyUp(e));
    this.canvas.addEventListener("click", (e) => this.handleClick(e));
  }

  handleKeyDown(e) {
    this.keys[e.code] = true;
  }

  handleKeyUp(e) {
    this.keys[e.code] = false;
  }

  handleClick(event) {
    if (!this.isChoosingPowerUp) return;

    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const buttonWidth = 160;
    const buttonHeight = 120;
    const buttonSpacing = 20;
    const startX =
      (this.canvas.width - (buttonWidth * 3 + buttonSpacing * 2)) / 2;
    const startY = (this.canvas.height - CONFIG.powerUpUI.height) / 2 + 80;
    this.availablePowerUps.forEach((powerUp, index) => {
      const buttonX = startX + (buttonWidth + buttonSpacing) * index;
      const buttonY = startY;

      if (
        mouseX >= buttonX &&
        mouseX <= buttonX + buttonWidth &&
        mouseY >= buttonY &&
        mouseY <= buttonY + buttonHeight
      ) {
        this.powerUpManager.activatePowerUp(powerUp, this.player);
        this.isChoosingPowerUp = false;
        this.resumeGame();
      }
    });
  }

  start() {
    this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
    this.enemySpawnInterval = setInterval(
      () => this.spawnEnemy(),
      this.currentSpawnInterval
    );
    this.timeUpdateInterval = setInterval(
      () => this.updateTime(),
      CONFIG.gameLoop.updateInterval
    );
  }
  spawnEnemy() {
    for (let i = 0; i < CONFIG.enemy.spawnCount; i++) {
      if (this.enemies.length < CONFIG.enemy.maxEnemies) {
        this.enemies.push(new Enemy());
      }
    }
  }

  updateScore() {
    document.getElementById("scoreValue").textContent = this.score;
  }

  updateTime() {
    this.time++;
    document.getElementById("timeValue").textContent = this.time;
    this.updateDifficulty();
  }

  updateHealthDisplay() {
    document.getElementById("healthValue").textContent = Math.max(
      0,
      Math.round(this.player.health)
    );
  }

  updateDifficulty() {
    if (this.time % 30 === 0 && this.currentSpawnInterval > 200) {
      this.currentSpawnInterval = Math.max(200, this.currentSpawnInterval - 50);
      clearInterval(this.enemySpawnInterval);
      this.enemySpawnInterval = setInterval(
        () => this.spawnEnemy(),
        this.currentSpawnInterval
      );
    }
  }

  gameOver() {
    alert(`Game Over! Your score: ${this.score}`);
    document.location.reload();
  }

  pauseGame() {
    cancelAnimationFrame(this.gameLoopId);
    clearInterval(this.enemySpawnInterval);
    clearInterval(this.timeUpdateInterval);
  }

  resumeGame() {
    this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
    this.enemySpawnInterval = setInterval(
      () => this.spawnEnemy(),
      this.currentSpawnInterval
    );
    this.timeUpdateInterval = setInterval(
      () => this.updateTime(),
      CONFIG.gameLoop.updateInterval
    );
  }
  handlePlayerMovement() {
    const dx =
      (this.keys["ArrowRight"] || this.keys["KeyD"] ? 1 : 0) -
      (this.keys["ArrowLeft"] || this.keys["KeyA"] ? 1 : 0);
    const dy =
      (this.keys["ArrowDown"] || this.keys["KeyS"] ? 1 : 0) -
      (this.keys["ArrowUp"] || this.keys["KeyW"] ? 1 : 0);

    console.log(dx);
    this.player.move(dx, dy);
  }

  gameLoop() {
    this.renderer.clear();

    if (this.isChoosingPowerUp) {
      this.renderer.drawPowerUpUI(this.availablePowerUps);
      this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
      return;
    }

    this.handlePlayerMovement();
    this.player.update();
    this.renderer.drawPlayer(this.player, this.powerUpManager.activePowerUp);

    const newBullet = this.player.shoot(this.enemies);
    if (newBullet) {
      this.bullets.push(newBullet);
    }

    this.updateBullets();
    this.updateEnemies();
    this.powerUpManager.update(this.player);

    this.updateScore();
    this.updateHealthDisplay();

    this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
  }

  updateBullets() {
    this.bullets = this.bullets.filter((bullet) => {
      bullet.move();
      this.renderer.drawBullet(bullet);

      if (bullet.isOutOfBounds(this.canvas.width, this.canvas.height)) {
        return false;
      }

      for (let i = this.enemies.length - 1; i >= 0; i--) {
        const enemy = this.enemies[i];
        if (bullet.isCollidingWith(enemy)) {
          enemy.health--;
          if (enemy.health <= 0) {
            this.enemies.splice(i, 1);
            this.score += CONFIG.scoring.enemyKill;
            this.killCount++;

            if (this.killCount % CONFIG.powerUp.killsToActivate === 0) {
              this.pauseGame();
              this.isChoosingPowerUp = true;
              this.availablePowerUps = this.powerUpManager.getRandomPowerUps(3);
            }
          } else {
            this.score += CONFIG.scoring.enemyHit;
          }
          return false;
        }
      }

      return true;
    });
  }

  updateEnemies() {
    this.enemies.forEach((enemy) => {
      enemy.move(this.player.x, this.player.y);
      this.renderer.drawEnemy(enemy);

      if (enemy.isCollidingWith(this.player)) {
        if (this.player.takeDamage(10)) {
          this.gameOver();
        }
      }
    });
  }
}

// Initialize and start the game
const game = new Game();
game.start();
