import { Car } from "./Car.js";
import { GameLoop } from "./GameLoop.js";
import { UIManager } from "./UIManager.js";

const car = new Car(document.getElementById("car"));
const ui = new UIManager();
const game = new GameLoop(car, ui);

const btnStart = document.getElementById("btnStart");
const btnRestart = document.getElementById("btnRestart");

const btnLeft = document.getElementById("btnLeft");
const btnRight = document.getElementById("btnRight");
const btnJump = document.getElementById("btnJump");
const btnBrake = document.getElementById("btnBrake");

const swipeSlider = document.getElementById("swipeSensitivity");
const leftHandToggle = document.getElementById("leftHandMode");

const gameArea = document.getElementById("gameArea");

let swipeSensitivity = 40;

btnStart.addEventListener("click", () => {
    const skinRadio = document.querySelector('input[name="skin"]:checked');
    const skinClass = skinRadio ? skinRadio.value : "skin-blue";
    car.setSkin(skinClass);

    swipeSensitivity = parseInt(swipeSlider.value, 10);

    if (leftHandToggle.checked) {
        document.body.classList.add("left-handed");
    } else {
        document.body.classList.remove("left-handed");
    }

    ui.hideStartScreen();
    ui.hideGameOver();
    game.startGame();
});

btnRestart.addEventListener("click", () => {
    ui.hideGameOver();
    ui.showStartScreen();
});

// Teclado
document.addEventListener("keydown", (e) => {
    if (!game.running) return;

    if (e.key === "ArrowLeft") car.moveLeft();
    if (e.key === "ArrowRight") car.moveRight();
    if (e.key === " ") car.jump();
    if (e.key === "Shift") game.brake();
});

// Controles táctiles inferiores
btnLeft.addEventListener("touchstart", () => {
    if (game.running) car.moveLeft();
});

btnRight.addEventListener("touchstart", () => {
    if (game.running) car.moveRight();
});

btnJump.addEventListener("touchstart", () => {
    if (game.running) car.jump();
});

btnBrake.addEventListener("touchstart", () => {
    if (!game.running) return;
    game.brake();
    if (navigator.vibrate) navigator.vibrate(40);
});

// Swipe continuo
let swipeActive = false;
let lastTouchX = 0;

gameArea.addEventListener("touchstart", (e) => {
    if (!game.running) return;
    swipeActive = true;
    lastTouchX = e.changedTouches[0].clientX;
});

gameArea.addEventListener("touchmove", (e) => {
    if (!game.running || !swipeActive) return;

    const currentX = e.changedTouches[0].clientX;
    const diff = currentX - lastTouchX;

    if (Math.abs(diff) > swipeSensitivity) {
        if (diff > 0) car.moveRight();
        else car.moveLeft();

        lastTouchX = currentX;

        const intensity = Math.min(60, game.getCurrentSpeed() * 10);
        if (navigator.vibrate) navigator.vibrate(intensity);
    }
});

gameArea.addEventListener("touchend", () => {
    swipeActive = false;
});

// Gestos avanzados
let lastTapTime = 0;
let longPressTimer = null;

gameArea.addEventListener("touchend", (e) => {
    const now = Date.now();
    if (now - lastTapTime < 250) {
        game.applyBoost("turbo");
        if (navigator.vibrate) navigator.vibrate([30, 60, 30]);
    }
    lastTapTime = now;
});

gameArea.addEventListener("touchstart", () => {
    longPressTimer = setTimeout(() => {
        game.applyBoost("shield");
        if (navigator.vibrate) navigator.vibrate(80);
    }, 500);
});

gameArea.addEventListener("touchend", () => {
    clearTimeout(longPressTimer);
});

// Mostrar menú inicial al cargar
ui.showStartScreen();