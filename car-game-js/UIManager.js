export class UIManager {
    constructor() {
        this.scoreValue = document.getElementById("scoreValue");
        this.highScoreValue = document.getElementById("highScoreValue");
        this.livesValue = document.getElementById("livesValue");
        this.boostValue = document.getElementById("boostValue");

        this.energyBarInner = document.getElementById("energyBarInner");
        this.energyText = document.getElementById("energyText");

        this.startScreen = document.getElementById("startScreen");
        this.gameOverScreen = document.getElementById("gameOverScreen");
        this.finalScoreText = document.getElementById("finalScoreText");
        this.finalHighScoreText = document.getElementById("finalHighScoreText");

        this.missionText = document.getElementById("missionText");
        this.missionStatus = document.getElementById("missionStatus");
        this.skinsLockInfo = document.getElementById("skinsLockInfo");

        this.highScore = parseInt(localStorage.getItem("highScoreCarGame") || "0", 10);
        this.updateHighScore(this.highScore);

        this.mission = this.loadOrCreateDailyMission();
        this.updateMissionUI();
        this.updateSkinsLockInfo();
    }

    updateScore(score) {
        this.scoreValue.textContent = score;
        if (score > this.highScore) {
            this.highScore = score;
            localStorage.setItem("highScoreCarGame", String(this.highScore));
            this.updateHighScore(this.highScore);
            this.updateSkinsLockInfo();
        }
        this.updateMissionProgress(score);
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

    updateEnergy(energy) {
        const clamped = Math.max(0, Math.min(100, energy));
        this.energyBarInner.style.width = clamped + "%";
        this.energyText.textContent = "Energía: " + clamped.toFixed(0) + "%";
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

    // Misiones diarias simples
    loadOrCreateDailyMission() {
        const today = new Date().toISOString().slice(0, 10);
        const stored = localStorage.getItem("carGameDailyMission");
        if (stored) {
            const data = JSON.parse(stored);
            if (data.date === today) return data;
        }
        // Crear misión: alcanzar X puntos hoy (50, 80 o 100)
        const targets = [50, 80, 100];
        const target = targets[Math.floor(Math.random() * targets.length)];
        const mission = { date: today, target, completed: false };
        localStorage.setItem("carGameDailyMission", JSON.stringify(mission));
        return mission;
    }

    updateMissionUI() {
        if (!this.mission) return;
        this.missionText.textContent = "Alcanza " + this.mission.target + " puntos hoy.";
        this.missionStatus.textContent = this.mission.completed
            ? "Completada ✔"
            : "En progreso...";
    }

    updateMissionProgress(score) {
        if (!this.mission || this.mission.completed) return;
        if (score >= this.mission.target) {
            this.mission.completed = true;
            localStorage.setItem("carGameDailyMission", JSON.stringify(this.mission));
            this.updateMissionUI();
        }
    }

    updateSkinsLockInfo() {
        const locks = [];
        if (this.highScore < 50) locks.push("Verde (≥ 50)");
        if (this.highScore < 100) locks.push("Rojo (≥ 100)");
        if (locks.length === 0) {
            this.skinsLockInfo.textContent = "Todas las skins desbloqueadas.";
        } else {
            this.skinsLockInfo.textContent = "Desbloquea skins: " + locks.join(", ");
        }

        const radios = document.querySelectorAll('input[name="skin"]');
        radios.forEach(r => {
            const skinId = r.getAttribute("data-skin-id");
            let locked = false;
            if (skinId === "green" && this.highScore < 50) locked = true;
            if (skinId === "red" && this.highScore < 100) locked = true;

            r.disabled = locked;
        });
    }
}