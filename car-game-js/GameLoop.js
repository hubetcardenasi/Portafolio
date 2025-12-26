import { Obstacle } from "./Obstacle.js";
import { PowerUp } from "./PowerUp.js";

export class GameLoop {
    constructor(car, ui) {
        this.car = car;
        this.ui = ui;

        this.gameArea = document.getElementById("gameArea");
        this.particlesLayer = document.getElementById("particlesLayer");

        this.obstacles = [];
        this.powerups = [];

        this.baseSpeed = 4;
        this.speedModifier = 1;
        this.score = 0;
        this.lives = 3;

        this.energy = 100;
        this.energyRegenRate = 8;   // % por segundo
        this.brakeEnergyCost = 20;  // por frenada
        this.brakeSlowFactor = 0.5; // reduce 50% la velocidad por un corto periodo

        this.currentBoost = null;
        this.boostTimeout = null;
        this.invincible = false;

        this.sndPoint = new Audio("car-game-assets/point.wav");
        this.sndCrash = new Audio("car-game-assets/crash.wav");
        this.sndPower = new Audio("car-game-assets/powerup.wav");

        this.running = false;
        this.lastTime = performance.now();
    }

    getCurrentSpeed() {
        return this.baseSpeed * this.speedModifier;
    }

    startGame() {
        this.resetState();
        this.running = true;
        this.spawnObstacle();
        this.spawnPowerUp();
        this.lastTime = performance.now();
        this.loop();
    }

    resetState() {
        this.obstacles.forEach(o => o.remove());
        this.obstacles = [];
        this.powerups.forEach(p => p.remove());
        this.powerups = [];

        this.score = 0;
        this.lives = 3;
        this.speedModifier = 1;
        this.currentBoost = null;
        this.invincible = false;
        this.car.setInvincible(false);

        this.energy = 100;
        this.ui.updateEnergy(this.energy);
        this.ui.updateScore(this.score);
        this.ui.updateLives(this.lives);
        this.ui.updateBoost("Ninguno");

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

        this.speedModifier = 1;
        this.invincible = false;
        this.car.setInvincible(false);
        this.currentBoost = null;

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
        }

        this.ui.updateBoost(this.currentBoost || "Ninguno");

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
            this.applyBoost(null);
            return;
        }

        this.lives--;
        this.ui.updateLives(this.lives);
        this.ui.hitEffect(this.gameArea);
        this.spawnParticlesAtCar("255,0,0", 18);

        if (this.lives > 0) {
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

        this.obstacles.forEach(o => o.remove());
        this.obstacles = [];

        setTimeout(() => {
            this.invincible = false;
            this.car.setInvincible(false);
        }, 2000);
    }

    gameOver() {
        this.running = false;
        this.obstacles.forEach(o => o.remove());
        this.obstacles = [];
        this.powerups.forEach(p => p.remove());
        this.powerups = [];
        this.ui.showGameOver(this.score);
    }

    brake() {
        if (this.energy < this.brakeEnergyCost) return;
        this.energy -= this.brakeEnergyCost;
        this.ui.updateEnergy(this.energy);
        this.car.brakeVisual();

        const previousSpeedModifier = this.speedModifier;
        this.speedModifier = previousSpeedModifier * this.brakeSlowFactor;

        setTimeout(() => {
            this.speedModifier = previousSpeedModifier;
        }, 400);
    }

    regenEnergy(deltaSeconds) {
        if (this.energy >= 100) return;
        this.energy += this.energyRegenRate * deltaSeconds;
        if (this.energy > 100) this.energy = 100;
        this.ui.updateEnergy(this.energy);
    }

    spawnParticles(x, y, color, count = 12) {
        for (let i = 0; i < count; i++) {
            const p = document.createElement("div");
            p.classList.add("particle");
            p.style.backgroundColor = "rgb(" + color + ")";

            const angle = Math.random() * Math.PI * 2;
            const distance = 30 + Math.random() * 30;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;

            p.style.setProperty("--dx", dx + "px");
            p.style.setProperty("--dy", dy + "px");

            p.style.left = x + "px";
            p.style.top = y + "px";

            this.particlesLayer.appendChild(p);

            setTimeout(() => p.remove(), 600);
        }
    }

    spawnParticlesAtCar(color, count = 12) {
        const x = this.car.x + 20;
        const y = 450;
        this.spawnParticles(x, y, color, count);
    }

    loop() {
        if (!this.running) return;

        const now = performance.now();
        const deltaMs = now - this.lastTime;
        const deltaSeconds = deltaMs / 1000;
        this.lastTime = now;

        this.regenEnergy(deltaSeconds);

        const currentSpeed = this.getCurrentSpeed();

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
                    this.spawnParticles(o.x + 20, 520, "0,255,255", 6);
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
                this.spawnParticles(p.x + 15, p.y + 15, "0,255,0", 14);

                p.remove();
                this.powerups.splice(i, 1);

                this.applyBoost(type);
            }
        });

        requestAnimationFrame(() => this.loop());
    }
}