import { Car } from "./Car.js";
import { GameLoop } from "./GameLoop.js";
import { UIManager } from "./UIManager.js";

const car = new Car(document.getElementById("car"));
const ui = new UIManager();
const game = new GameLoop(car, ui);

// Menú inicial
const btnStart = document.getElementById("btnStart");
const btnRestart = document.getElementById("btnRestart");

btnStart.addEventListener("click", () => {
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

// Controles con teclado
document.addEventListener("keydown", (e) => {
    if (!game.running) return;

    if (e.key === "ArrowLeft") car.moveLeft();
    if (e.key === "ArrowRight") car.moveRight();
});

// Controles móviles
const btnLeft = document.getElementById("btnLeft");
const btnRight = document.getElementById("btnRight");

// Funciones de movimiento reutilizables
function moveLeftIfRunning() {
    if (!game.running) return;
    car.moveLeft();
}

function moveRightIfRunning() {
    if (!game.running) return;
    car.moveRight();
}

// Click/tap simple
btnLeft.addEventListener("click", moveLeftIfRunning);
btnRight.addEventListener("click", moveRightIfRunning);

// Soporte táctil continuo (mantener presionado)
let leftInterval = null;
let rightInterval = null;

function startHoldLeft() {
    if (!game.running) return;
    if (leftInterval) return;
    moveLeftIfRunning();
    leftInterval = setInterval(moveLeftIfRunning, 120);
}

function startHoldRight() {
    if (!game.running) return;
    if (rightInterval) return;
    moveRightIfRunning();
    rightInterval = setInterval(moveRightIfRunning, 120);
}

function stopHoldLeft() {
    if (leftInterval) {
        clearInterval(leftInterval);
        leftInterval = null;
    }
}

function stopHoldRight() {
    if (rightInterval) {
        clearInterval(rightInterval);
        rightInterval = null;
    }
}

// Eventos táctiles
btnLeft.addEventListener("touchstart", (e) => {
    e.preventDefault();
    startHoldLeft();
});

btnLeft.addEventListener("touchend", (e) => {
    e.preventDefault();
    stopHoldLeft();
});

btnLeft.addEventListener("touchcancel", (e) => {
    e.preventDefault();
    stopHoldLeft();
});

btnRight.addEventListener("touchstart", (e) => {
    e.preventDefault();
    startHoldRight();
});

btnRight.addEventListener("touchend", (e) => {
    e.preventDefault();
    stopHoldRight();
});

btnRight.addEventListener("touchcancel", (e) => {
    e.preventDefault();
    stopHoldRight();
});

// Mostrar menú inicial al cargar
ui.showStartScreen();

// -----------------------------
// CONTROL POR SWIPE (DESLIZAR)
// -----------------------------
let touchStartX = 0;
let touchEndX = 0;
const swipeThreshold = 40; // Distancia mínima para considerar swipe

const gameArea = document.getElementById("gameArea");

// Inicio del toque
gameArea.addEventListener("touchstart", (e) => {
    if (!game.running) return;
    touchStartX = e.changedTouches[0].clientX;
});

// Fin del toque
gameArea.addEventListener("touchend", (e) => {
    if (!game.running) return;
    touchEndX = e.changedTouches[0].clientX;

    const diff = touchEndX - touchStartX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe derecha
            car.moveRight();
        } else {
            // Swipe izquierda
            car.moveLeft();
        }
    }
});

// -----------------------------
// CONFIGURACIÓN DESDE EL MENÚ
// -----------------------------
let swipeSensitivity = 40;
let joystickEnabled = false;

const swipeSlider = document.getElementById("swipeSensitivity");
const joystickToggle = document.getElementById("joystickToggle");

btnStart.addEventListener("click", () => {
    swipeSensitivity = parseInt(swipeSlider.value, 10);
    joystickEnabled = joystickToggle.checked;

    if (joystickEnabled) {
        document.getElementById("joystickContainer").classList.remove("hidden");
    } else {
        document.getElementById("joystickContainer").classList.add("hidden");
    }
});

// -----------------------------
// SWIPE CONTINUO
// -----------------------------
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

        // Vibración háptica
        if (navigator.vibrate) navigator.vibrate(10);
    }
});

gameArea.addEventListener("touchend", () => {
    swipeActive = false;
});

// -----------------------------
// JOYSTICK VIRTUAL
// -----------------------------
const joystickBase = document.getElementById("joystickBase");
const joystickStick = document.getElementById("joystickStick");

let joystickCenter = { x: 0, y: 0 };
let joystickTouchId = null;

function resetJoystick() {
    joystickStick.style.transform = `translate(0px, 0px)`;
}

joystickBase.addEventListener("touchstart", (e) => {
    if (!game.running) return;

    const touch = e.changedTouches[0];
    joystickTouchId = touch.identifier;

    const rect = joystickBase.getBoundingClientRect();
    joystickCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
});

joystickBase.addEventListener("touchmove", (e) => {
    if (!game.running) return;

    for (const touch of e.changedTouches) {
        if (touch.identifier === joystickTouchId) {
            const dx = touch.clientX - joystickCenter.x;

            // Limitar movimiento del stick
            const limitedX = Math.max(-40, Math.min(40, dx));
            joystickStick.style.transform = `translate(${limitedX}px, 0px)`;

            // Movimiento del carro
            if (limitedX > 10) car.moveRight();
            if (limitedX < -10) car.moveLeft();

            // Vibración
            if (navigator.vibrate) navigator.vibrate(5);
        }
    }
});

joystickBase.addEventListener("touchend", (e) => {
    for (const touch of e.changedTouches) {
        if (touch.identifier === joystickTouchId) {
            resetJoystick();
            joystickTouchId = null;
        }
    }
});