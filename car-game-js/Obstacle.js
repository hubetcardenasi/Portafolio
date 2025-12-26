export class Obstacle {
    constructor(gameArea, speed) {
        this.gameArea = gameArea;
        this.speed = speed;

        this.el = document.createElement("div");
        this.el.classList.add("obstacle");

        this.x = Math.random() * 275;
        this.y = -60;

        this.el.style.left = this.x + "px";
        gameArea.appendChild(this.el);
    }

    update() {
        this.y += this.speed;
        this.el.style.top = this.y + "px";
    }

    isOut() {
        return this.y > 600;
    }

    remove() {
        this.el.remove();
    }
}