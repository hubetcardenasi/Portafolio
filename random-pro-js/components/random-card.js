import { AppConfig } from "../config.js";

class RandomCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
        }

        /* Fondo parallax del componente */
        .parallax-bg {
          position: absolute;
          inset: -80px;
          z-index: -2;
          background: radial-gradient(circle at top, #1e3a8a 0%, #0b1120 60%, #020617 100%);
          opacity: 0.35;
          will-change: transform;
          transition: transform 0.15s ease-out;
        }

        /* Luz neon multicolor */
        .mouse-light-neon {
          position: fixed;
          width: 340px;
          height: 340px;
          border-radius: 50%;
          pointer-events: none;
          background: conic-gradient(
            from 180deg,
            rgba(56, 189, 248, 0.7),
            rgba(244, 63, 94, 0.7),
            rgba(129, 140, 248, 0.8),
            rgba(45, 212, 191, 0.7),
            rgba(56, 189, 248, 0.7)
          );
          mix-blend-mode: screen;
          filter: blur(40px);
          opacity: 0.35;
          z-index: -1;
          animation: neonBreathing 4.5s ease-in-out infinite alternate;
          transform: translate(-9999px, -9999px);
        }

        @keyframes neonBreathing {
          0% { transform: scale(0.9); opacity: 0.25; }
          50% { transform: scale(1.05); opacity: 0.6; }
          100% { transform: scale(1.15); opacity: 0.4; }
        }

        .card {
          position: relative;
          background: rgba(255, 255, 255, var(--glass-intensity, 0.18));
          backdrop-filter: blur(var(--glass-blur, 18px)) saturate(180%);
          -webkit-backdrop-filter: blur(var(--glass-blur, 18px)) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.5);
          border-radius: 18px;
          padding: 28px 24px 26px;
          width: 100%;
          margin: auto;
          transition: transform 0.2s ease, backdrop-filter 0.2s ease, box-shadow 0.2s ease;
          will-change: transform, backdrop-filter;
        }

        h1 {
          margin: 0;
          text-align: center;
          font-size: 1.4rem;
          letter-spacing: 0.03em;
        }

        p {
          text-align: center;
          opacity: 0.75;
          margin: 8px 0 18px;
          font-size: 0.95rem;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 18px;
        }

        label {
          display: block;
          font-size: 0.8rem;
          opacity: 0.8;
          margin-bottom: 4px;
        }

        input {
          width: 90%;
          padding: 8px 10px;
          border-radius: 10px;
          border: 1px solid #94a3b8;
          background: rgba(15, 23, 42, 0.65);
          color: #e5e7eb;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        }

        input:focus {
          border-color: #38bdf8;
          box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.8);
          background: rgba(15, 23, 42, 0.9);
        }

        button {
          margin-top: 8px;
          width: 100%;
          padding: 10px 12px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb, #38bdf8);
          color: white;
          border: none;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.95rem;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          transition: transform 0.12s ease, box-shadow 0.12s ease, filter 0.12s ease;
          box-shadow: 0 12px 25px rgba(37, 99, 235, 0.35);
        }

        button:hover {
          transform: translateY(-1px) scale(1.01);
          box-shadow: 0 16px 30px rgba(37, 99, 235, 0.5);
          filter: brightness(1.05);
        }

        button:active {
          transform: translateY(0) scale(0.99);
          box-shadow: 0 10px 20px rgba(37, 99, 235, 0.35);
        }

        .resultado {
          margin-top: 16px;
          text-align: center;
          font-weight: 600;
          font-size: 1.05rem;
          color: #e0f2fe;
          min-height: 1.2em;
        }

        .error {
          margin-top: 8px;
          text-align: center;
          font-size: 0.85rem;
          color: #fecaca;
          min-height: 1em;
        }

        @keyframes theme3D {
          0% {
            opacity: 0;
            filter: blur(8px);
            transform:
              perspective(900px)
              rotateX(12deg)
              rotateY(-12deg)
              translateY(20px)
              scale(0.94);
          }
          40% {
            opacity: 0.6;
            filter: blur(4px);
            transform:
              perspective(900px)
              rotateX(4deg)
              rotateY(-4deg)
              translateY(6px)
              scale(1.02);
          }
          70% {
            opacity: 0.9;
            filter: blur(1px);
            transform:
              perspective(900px)
              rotateX(0deg)
              rotateY(0deg)
              translateY(0px)
              scale(1.01);
          }
          100% {
            opacity: 1;
            filter: blur(0);
            transform:
              perspective(900px)
              rotateX(0deg)
              rotateY(0deg)
              translateY(0)
              scale(1);
          }
        }

        .theme-animate {
          animation: theme3D 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          transform-style: preserve-3d;
        }
      </style>

      <div class="parallax-bg"></div>
      <div class="mouse-light-neon"></div>

      <div class="card">
        <h1>Generador aleatorio</h1>
        <p>Ingresa un mínimo y un máximo</p>

        <div class="grid">
          <div>
            <label for="min">Mínimo</label>
            <input id="min" type="number" placeholder="Ej. 1">
          </div>
          <div>
            <label for="max">Máximo</label>
            <input id="max" type="number" placeholder="Ej. 100">
          </div>
        </div>

        <button id="generate">Generar número</button>
        <div class="resultado" id="result"></div>
        <div class="error" id="error"></div>
      </div>
    `;
  }

  connectedCallback() {
    this.card = this.shadowRoot.querySelector(".card");
    this.bg = this.shadowRoot.querySelector(".parallax-bg");
    this.neon = this.shadowRoot.querySelector(".mouse-light-neon");

    this.min = this.shadowRoot.querySelector("#min");
    this.max = this.shadowRoot.querySelector("#max");
    this.result = this.shadowRoot.querySelector("#result");
    this.error = this.shadowRoot.querySelector("#error");

    this.shadowRoot.querySelector("#generate")
      .addEventListener("click", () => this.generateNumber());

    // Efectos iniciales según AppConfig
    this.applyEffects();

    // Escuchar cambios globales
    document.addEventListener("app-config-changed", () => this.applyEffects());

    // Handlers globales (mouse / scroll / tilt / glass)
    this.attachGlobalHandlers();
  }

  disconnectedCallback() {
    this.detachGlobalHandlers();
    document.removeEventListener("app-config-changed", this.applyEffects);
  }

  generateNumber() {
    this.error.textContent = "";
    this.result.textContent = "";

    const min = parseInt(this.min.value, 10);
    const max = parseInt(this.max.value, 10);

    if (isNaN(min) || isNaN(max)) {
      this.error.textContent = "Ingresa valores numéricos válidos.";
      return;
    }

    if (min > max) {
      this.error.textContent = "El mínimo no puede ser mayor que el máximo.";
      return;
    }

    const n = Math.floor(Math.random() * (max - min + 1)) + min;
    this.result.textContent = `Número generado: ${n}`;
  }

  applyEffects() {
    const cfg = AppConfig.effects;

    // Neon
    this.neon.style.display = cfg.neonLights ? "block" : "none";

    // No activamos/desactivamos eventos aquí, solo banderas;
    // los handlers consultan AppConfig.effects.
  }

  attachGlobalHandlers() {
    this._mouseMoveHandler = (e) => this.onMouseMove(e);
    this._scrollHandler = () => this.onScroll();
    this._cardMouseMoveHandler = (e) => this.onCardMouseMove(e);
    this._cardMouseLeaveHandler = () => this.onCardMouseLeave();
    this._glassMouseMoveHandler = (e) => this.onGlassMouseMove(e);
    this._glassMouseLeaveHandler = () => this.onGlassMouseLeave();
    this._deviceOrientationHandler = (e) => this.onDeviceOrientation(e);

    document.addEventListener("mousemove", this._mouseMoveHandler);
    window.addEventListener("scroll", this._scrollHandler);
    this.card.addEventListener("mousemove", this._cardMouseMoveHandler);
    this.card.addEventListener("mouseleave", this._cardMouseLeaveHandler);
    this.card.addEventListener("mousemove", this._glassMouseMoveHandler);
    this.card.addEventListener("mouseleave", this._glassMouseLeaveHandler);

    if ("DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", this._deviceOrientationHandler);
    }
  }

  detachGlobalHandlers() {
    document.removeEventListener("mousemove", this._mouseMoveHandler);
    window.removeEventListener("scroll", this._scrollHandler);
    this.card.removeEventListener("mousemove", this._cardMouseMoveHandler);
    this.card.removeEventListener("mouseleave", this._cardMouseLeaveHandler);
    this.card.removeEventListener("mousemove", this._glassMouseMoveHandler);
    this.card.removeEventListener("mouseleave", this._glassMouseLeaveHandler);

    if ("DeviceOrientationEvent" in window) {
      window.removeEventListener("deviceorientation", this._deviceOrientationHandler);
    }
  }

  // =========================
  // Handlers de efectos
  // =========================

  onMouseMove(e) {
    const cfg = AppConfig.effects;
    if (!cfg.parallaxMouse && !cfg.neonLights) return;

    const xNorm = (e.clientX / window.innerWidth - 0.5) * 2;
    const yNorm = (e.clientY / window.innerHeight - 0.5) * 2;

    if (cfg.parallaxMouse) {
      this.bg.style.transform = `translate(${xNorm * 20}px, ${yNorm * 20}px)`;
    }

    if (cfg.neonLights) {
      const x = e.clientX - 170;
      const y = e.clientY - 170;
      this.neon.style.transform = `translate(${x}px, ${y}px)`;
    }
  }

  onScroll() {
    const cfg = AppConfig.effects;
    if (!cfg.parallaxScroll) return;

    const scrollY = window.scrollY;
    this.bg.style.transform = `translateY(${scrollY * 0.15}px)`;
  }

  onCardMouseMove(e) {
    const cfg = AppConfig.effects;
    if (!cfg.tilt) return;

    const rect = this.card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -20;
    const rotateY = ((x / rect.width) - 0.5) * 20;
    this.card.style.transform =
      `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  }

  onCardMouseLeave() {
    const cfg = AppConfig.effects;
    if (!cfg.tilt) return;
    this.card.style.transform = "";
  }

  onGlassMouseMove(e) {
    const cfg = AppConfig.effects;
    if (!cfg.glassDynamic) return;

    const rect = this.card.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const factor = y / rect.height;
    const blurMin = 10;
    const blurMax = 26;
    const blurValue = blurMin + (blurMax - blurMin) * factor;

    this.card.style.setProperty("--glass-blur", `${blurValue}px`);
  }

  onGlassMouseLeave() {
    const cfg = AppConfig.effects;
    if (!cfg.glassDynamic) return;
    this.card.style.setProperty("--glass-blur", "18px");
  }

  onDeviceOrientation(event) {
    const cfg = AppConfig.effects;
    if (!cfg.tilt) return;

    const { beta, gamma } = event;
    if (beta === null || gamma === null) return;

    const normX = Math.max(-30, Math.min(30, gamma));
    const normY = Math.max(-30, Math.min(30, beta - 45));

    const rotateX = (normY / 30) * -12;
    const rotateY = (normX / 30) * 12;

    this.card.style.transform =
      `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  }
}

customElements.define("random-card", RandomCard);