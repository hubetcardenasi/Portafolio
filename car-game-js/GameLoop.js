import { Obstacle } from "./Obstacle.js";
import { PowerUp } from "./PowerUp.js";

export class GameLoop {
    constructor(car, ui) {
        this.car = car;
        this.ui = ui;

        this.gameArea = document.getElementById("gameArea");
        this.obstacles = [];
        this.powerups = [];

        // Velocidad base fija
        this.baseSpeed = 4;
        this.speedModifier = 1;
        this.score = 0;
        this.lives = 3;

        // Estado de boost
        this.currentBoost = null; // "Escudo", "Turbo", "Lento"
        this.boostTimeout = null;
        this.invincible = false;

        // Sonidos
        this.sndPoint = new Audio("../car-game-assets/point.wav");
        this.sndCrash = new Audio("../car-game-assets/crash.wav");
        this.sndPower = new Audio("../car-game-assets/powerup.wav");

        // Control de loop
        this.running = false; // Arranca cuando se pulsa "Iniciar"
    }

    getCurrentSpeed() {
        return this.baseSpeed * this.speedModifier;
    }

    startGame() {
        this.resetState();
        this.running = true;
        this.spawnObstacle();
        this.spawnPowerUp();
        this.loop();
    }

    resetState() {
        // Limpia entidades
        this.obstacles.forEach(o => o.remove());
        this.obstacles = [];
        this.powerups.forEach(p => p.remove());
        this.powerups = [];

        // Estado base
        this.score = 0;
        this.lives = 3;
        this.speedModifier = 1;
        this.currentBoost = null;
        this.invincible = false;
        this.car.setInvincible(false);

        this.ui.updateScore(this.score);
        this.ui.updateLives(this.lives);
        this.ui.updateBoost("Ninguno");

        // Reposiciona carro
        this.car.x = 140;
        this.car.update();
    }

    spawnObstacle() {
        if (!this.running) return;
        this.obstacles.push(new Obstacle(this.gameArea, this.getCurrentSpeed()));
        setTimeout(() => this.spawnObstacle(), 900);
    }

    spawnPowerUp() {
        if (!this.running) return;

        // Selección aleatoria de tipo de boost
        const types = ["shield", "turbo", "slow"];
        const type = types[Math.floor(Math.random() * types.length)];

        this.powerups.push(new PowerUp(this.gameArea, type));

        setTimeout(() => this.spawnPowerUp(), 6000);
    }

    detectCollision(a, b, sizeA = { w: 40, h: 70 }, sizeB = { w: 40, h: 40 }) {
        return !(
            a.y + sizeA.h < b.y ||
            a.y > b.y + sizeB.h ||
            a.x + sizeA.w < b.x ||
            a.x > b.x + sizeB.w
        );
    }

    applyBoost(type) {
        if (this.boostTimeout) {
            clearTimeout(this.boostTimeout);
            this.boostTimeout = null;
        }

        // Reset a estado base
        this.speedModifier = 1;
        this.invincible = false;
        this.car.setInvincible(false);

        if (type === "shield") {
            this.currentBoost = "Escudo";
            this.invincible = true;
            this.car.setInvincible(true);
        } else if (type === "turbo") {
            this.currentBoost = "Turbo";
            this.speedModifier = 1.7;
        } else if (type === "slow") {
            this.currentBoost = "Cámara lenta";
            this.speedModifier = 0.6;
        } else {
            this.currentBoost = null;
        }

        this.ui.updateBoost(this.currentBoost || "Ninguno");

        // Duración de boost (3 segundos)
        if (type) {
            this.boostTimeout = setTimeout(() => {
                this.currentBoost = null;
                this.speedModifier = 1;
                if (type === "shield") {
                    this.invincible = false;
                    this.car.setInvincible(false);
                }
                this.ui.updateBoost("Ninguno");
            }, 3000);
        }
    }

    handleHit() {
        if (this.invincible) {
            // Si hay escudo activo, lo consume pero no pierde vida
            this.applyBoost(null);
            return;
        }

        this.lives--;
        this.ui.updateLives(this.lives);
        this.ui.hitEffect(this.gameArea);

        if (this.lives > 0) {
            // Respawn suave
            this.respawnPlayer();
        } else {
            this.gameOver();
        }
    }

    respawnPlayer() {
        this.invincible = true;
        this.car.setInvincible(true);
        this.car.x = 140;
        this.car.update();
        this.car.respawnAnimation();

        // Limpia obstáculos cercanos
        this.obstacles.forEach(o => o.remove());
        this.obstacles = [];

        // Invencible temporal después del respawn
        setTimeout(() => {
            this.invincible = false;
            this.car.setInvincible(false);
        }, 2000);
    }

    gameOver() {
        this.running = false;

        // Limpia entidades
        this.obstacles.forEach(o => o.remove());
        this.obstacles = [];
        this.powerups.forEach(p => p.remove());
        this.powerups = [];

        this.ui.showGameOver(this.score);
    }

    loop() {
        if (!this.running) return;

        const currentSpeed = this.getCurrentSpeed();

        // Actualizamos la velocidad de cada obstáculo según el modificador actual
        this.obstacles.forEach((o, i) => {
            o.speed = currentSpeed;
            o.update();

            if (o.isOut()) {
                o.remove();
                this.obstacles.splice(i, 1);

                if (this.running) {
                    this.score++;
                    this.ui.updateScore(this.score);
                    this.sndPoint.play();
                }
            }

            const carBox = { x: this.car.x, y: 450 };
            if (this.detectCollision(carBox, o, { w: 40, h: 70 }, { w: 45, h: 45 })) {
                this.sndCrash.play();
                this.handleHit();
            }
        });

        this.powerups.forEach((p, i) => {
            p.update();

            if (p.isOut()) {
                p.remove();
                this.powerups.splice(i, 1);
                return;
            }

            const carBox = { x: this.car.x, y: 450 };
            if (this.detectCollision(carBox, p, { w: 40, h: 70 }, { w: 35, h: 35 })) {
                this.sndPower.play();
                const type = p.type;
                p.remove();
                this.powerups.splice(i, 1);

                this.applyBoost(type);
            }
        });

        requestAnimationFrame(() => this.loop());
    }
}