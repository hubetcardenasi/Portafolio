export class Car {
    constructor(element) {
        this.el = element;
        this.x = 140;
        this.speed = 20;
        this.skinClass = "skin-blue";

        this.jumpCount = 0;
        this.maxJumps = 2;
        this.isJumping = false;
    }

    moveLeft() {
        if (this.x > 0) this.x -= this.speed;
        this.update();
    }

    moveRight() {
        if (this.x < 275) this.x += this.speed;
        this.update();
    }

    brakeVisual() {
        this.el.style.transform = "scale(0.9)";
        setTimeout(() => {
            this.el.style.transform = "scale(1)";
        }, 150);
    }

    update() {
        this.el.style.left = this.x + "px";
    }

    setSkin(skinClass) {
        this.el.classList.remove(this.skinClass);
        this.skinClass = skinClass;
        this.el.classList.add(this.skinClass);
    }

    jump() {
        if (this.jumpCount >= this.maxJumps) return;

        this.jumpCount++;
        this.isJumping = true;

        this.el.style.transform = "translateY(-50px)";
        setTimeout(() => {
            this.el.style.transform = "translateY(0px)";
            this.isJumping = false;
            setTimeout(() => {
                this.jumpCount = 0;
            }, 80);
        }, 250);
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