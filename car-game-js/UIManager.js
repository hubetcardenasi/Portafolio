export class UIManager {
    constructor() {
        this.scoreValue = document.getElementById("scoreValue");
        this.highScoreValue = document.getElementById("highScoreValue");
        this.livesValue = document.getElementById("livesValue");
        this.boostValue = document.getElementById("boostValue");

        this.startScreen = document.getElementById("startScreen");
        this.gameOverScreen = document.getElementById("gameOverScreen");
        this.finalScoreText = document.getElementById("finalScoreText");
        this.finalHighScoreText = document.getElementById("finalHighScoreText");

        this.highScore = parseInt(localStorage.getItem("highScoreCarGame") || "0", 10);
        this.updateHighScore(this.highScore);
    }

    updateScore(score) {
        this.scoreValue.textContent = score;
        if (score > this.highScore) {
            this.highScore = score;
            localStorage.setItem("highScoreCarGame", String(this.highScore));
            this.updateHighScore(this.highScore);
        }
    }

    updateHighScore(value) {
        this.highScoreValue.textContent = value;
    }

    updateLives(lives) {
        this.livesValue.textContent = lives;
    }

    updateBoost(boostName) {
        this.boostValue.textContent = boostName || "Ninguno";
    }

    showStartScreen() {
        this.startScreen.classList.remove("hidden");
    }

    hideStartScreen() {
        this.startScreen.classList.add("hidden");
    }

    showGameOver(score) {
        this.finalScoreText.textContent = "Puntaje: " + score;
        this.finalHighScoreText.textContent = "High Score: " + this.highScore;
        this.gameOverScreen.classList.remove("hidden");
    }

    hideGameOver() {
        this.gameOverScreen.classList.add("hidden");
    }

    hitEffect(gameArea) {
        gameArea.classList.add("hit-effect");
        setTimeout(() => gameArea.classList.remove("hit-effect"), 400);
    }
}