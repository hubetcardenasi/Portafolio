export class Car {
    constructor(element) {
        this.el = element;
        this.x = 140;
        this.speed = 20;
        this.skinClass = "skin-blue";
    }

    moveLeft() {
        if (this.x > 0) this.x -= this.speed;
        this.update();
    }

    moveRight() {
        if (this.x < 275) this.x += this.speed;
        this.update();
    }

    update() {
        this.el.style.left = this.x + "px";
    }

    setSkin(skinClass) {
        this.el.classList.remove(this.skinClass);
        this.skinClass = skinClass;
        this.el.classList.add(this.skinClass);
    }

    respawnAnimation() {
        this.el.classList.add("respawn");
        setTimeout(() => this.el.classList.remove("respawn"), 1000);
    }

    setInvincible(isInvincible) {
        if (isInvincible) {
            this.el.classList.add("invincible");
        } else {
            this.el.classList.remove("invincible");
        }
    }
}