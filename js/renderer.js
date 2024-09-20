class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawPlayer(player, activePowerUp) {
    this.ctx.beginPath();
    this.ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    this.ctx.fillStyle =
      player.invincibilityFrames > 0 ? "rgba(0, 0, 255, 0.5)" : "blue";
    this.ctx.fill();
    this.ctx.closePath();

    // Draw health bar
    const healthBarWidth = 50;
    const healthBarHeight = 5;
    const healthPercentage = player.health / player.maxHealth;
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(
      player.x - healthBarWidth / 2,
      player.y - player.radius - 10,
      healthBarWidth,
      healthBarHeight
    );
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(
      player.x - healthBarWidth / 2,
      player.y - player.radius - 10,
      healthBarWidth * healthPercentage,
      healthBarHeight
    );

    // Draw power-up indicator
    if (activePowerUp) {
      this.ctx.font = "12px Arial";
      this.ctx.fillStyle = "white";
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        activePowerUp.label,
        player.x,
        player.y + player.radius + 20
      );
    }
  }

  drawEnemy(enemy) {
    this.ctx.beginPath();
    this.ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = enemy.color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawBullet(bullet) {
    this.ctx.beginPath();
    this.ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = "yellow";
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawPowerUpUI(availablePowerUps) {
    const uiWidth = CONFIG.powerUpUI.width;
    const uiHeight = CONFIG.powerUpUI.height;
    const uiX = (this.canvas.width - uiWidth) / 2;
    const uiY = (this.canvas.height - uiHeight) / 2;

    // Draw background
    this.ctx.fillStyle = CONFIG.powerUpUI.backgroundColor;
    this.ctx.fillRect(uiX, uiY, uiWidth, uiHeight);

    // Draw title
    this.ctx.font = "bold 24px Arial";
    this.ctx.fillStyle = CONFIG.powerUpUI.textColor;
    this.ctx.textAlign = "center";
    this.ctx.fillText("Choose a Power-Up", this.canvas.width / 2, uiY + 40);

    // Draw power-up options
    const buttonWidth = 160;
    const buttonHeight = 120;
    const buttonSpacing = 20;
    const startX =
      (this.canvas.width - (buttonWidth * 3 + buttonSpacing * 2)) / 2;
    const startY = uiY + 80;

    availablePowerUps.forEach((powerUp, index) => {
      const buttonX = startX + (buttonWidth + buttonSpacing) * index;
      const buttonY = startY;

      // Draw button
      this.ctx.fillStyle = CONFIG.powerUpUI.buttonColor;
      this.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

      // Draw power-up name
      this.ctx.font = "bold 16px Arial";
      this.ctx.fillStyle = CONFIG.powerUpUI.textColor;
      this.ctx.textAlign = "center";
      this.ctx.fillText(powerUp.label, buttonX + buttonWidth / 2, buttonY + 30);

      // Draw power-up description
      this.ctx.font = "14px Arial";
      this.ctx.fillStyle = CONFIG.powerUpUI.textColor;
      const words = powerUp.description.split(" ");
      let line = "";
      let lineHeight = 20;
      let y = buttonY + 60;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = this.ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > buttonWidth - 20 && n > 0) {
          this.ctx.fillText(line, buttonX + buttonWidth / 2, y);
          line = words[n] + " ";
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      this.ctx.fillText(line, buttonX + buttonWidth / 2, y);
    });
  }
}
