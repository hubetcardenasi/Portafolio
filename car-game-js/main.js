import { Car } from "./Car.js";
import { GameLoop } from "./GameLoop.js";
import { UIManager } from "./UIManager.js";

const car = new Car(document.getElementById("car"));
const ui = new UIManager();
const game = new GameLoop(car, ui);

// Menú inicial
const btnStart = document.getElementById("btnStart");
const btnRestart = document.getElementById("btnRestart");
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

btnStart.addEventListener("click", () => {
    // Leer skin seleccionada
    const skinRadio = document.querySelector('input[name="skin"]:checked');
    const skinClass = skinRadio ? skinRadio.value : "skin-blue";
    car.setSkin(skinClass);

    ui.hideStartScreen();
    ui.hideGameOver();
    game.startGame();
});

btnRestart.addEventListener("click", () => {
    ui.hideGameOver();
    ui.showStartScreen();
});

// Controles del carro
document.addEventListener("keydown", (e) => {
    if (!game.running) return;

    if (e.key === "ArrowLeft") car.moveLeft();
    if (e.key === "ArrowRight") car.moveRight();
});

// Mostrar menú inicial al cargar
ui.showStartScreen();