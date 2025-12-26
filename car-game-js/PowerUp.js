export class PowerUp {
    constructor(gameArea, type) {
        this.gameArea = gameArea;
        this.type = type;

        this.el = document.createElement("div");
        this.el.classList.add("powerup");

        if (type === "shield") this.el.classList.add("powerup-shield");
        if (type === "turbo") this.el.classList.add("powerup-turbo");
        if (type === "slow") this.el.classList.add("powerup-slow");

        this.x = Math.random() * 275;
        this.y = -40;

        this.el.style.left = this.x + "px";
        gameArea.appendChild(this.el);
    }

    update() {
        this.y += 3;
        this.el.style.top = this.y + "px";
    }

    isOut() {
        return this.y > 600;
    }

    remove() {
        this.el.remove();
    }
}