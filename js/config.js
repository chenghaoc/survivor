const CONFIG = {
  canvas: {
    width: 1200,
    height: 800,
  },
  player: {
    radius: 20,
    speed: 5,
    shootInterval: 30,
    maxHealth: 100,
    invincibilityFrames: 30,
  },
  enemy: {
    basic: {
      radius: 15,
      speed: 1.5,
      health: 2,
      color: "red",
    },
    fast: {
      radius: 10,
      speed: 3,
      health: 1,
      color: "orange",
    },
    tank: {
      radius: 25,
      speed: 0.7,
      health: 5,
      color: "darkred",
    },
    zigzag: {
      radius: 12,
      speed: 2,
      health: 3,
      color: "purple",
    },
    maxEnemies: 100,
    spawnInterval: 500,
    spawnCount: 3,
  },
  bullet: {
    radius: 4,
    speed: 8,
  },
  scoring: {
    enemyHit: 1,
    enemyKill: 10,
  },
  gameLoop: {
    updateInterval: 1000,
  },
  powerUp: {
    killsToActivate: 20,
    duration: 10000, // milliseconds
    types: [
      {
        name: "fireRate",
        label: "Fire Rate",
        multiplier: 1.2,
        description: "Double your fire rate",
      },
      {
        name: "bulletSize",
        label: "Bullet Size",
        multiplier: 1.2,
        description: "Increase bullet size by 50%",
      },
      {
        name: "playerSpeed",
        label: "Player Speed",
        multiplier: 1.2,
        description: "Increase movement speed by 50%",
      },
      {
        name: "bulletSpeed",
        label: "Bullet Speed",
        multiplier: 1.2,
        description: "Increase bullet speed by 50%",
      },
      {
        name: "spreadShot",
        label: "Spread Shot",
        description: "Fire 3 bullets in a spread pattern",
      },
      {
        name: "piercingShot",
        label: "Piercing Shot",
        description: "Bullets pierce through enemies",
      },
      {
        name: "explosiveShot",
        label: "Explosive Shot",
        description: "Bullets explode on impact",
      },
    ],
  },
  powerUpUI: {
    width: 600,
    height: 400,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    textColor: "white",
    buttonColor: "#4CAF50",
    buttonHoverColor: "#45a049",
  },
};

// If running in Node.js environment, export the CONFIG object
if (typeof module !== "undefined" && module.exports) {
  module.exports = CONFIG;
}
