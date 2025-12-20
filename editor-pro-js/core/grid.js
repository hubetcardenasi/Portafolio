// js/core/grid.js
//
// Grid avanzado para el editor:
// - Modos: normal | iso | blueprint | figma | grid3d
// - Grid dinámico según zoom
// - Cambia color según modo oscuro
// - Transiciones y fade-in/fade-out
// - Subdivisiones configurables
// - Color configurable
// - Compatible con rotación global del canvas

const svgNS = "http://www.w3.org/2000/svg";

export function initGrid(canvas, zoomController) {
  let mode = "normal";       // normal | iso | blueprint | figma | grid3d
  let baseSize = 20;
  let subdivisions = 5;
  let enabled = true;
  let opacity = 1;
  let customColor = null;

  function getColor() {
    if (customColor) return customColor;
    const dark = document.body.classList.contains("dark");
    return dark ? "#444" : "#ddd";
  }

  function getSubColor() {
    const dark = document.body.classList.contains("dark");
    return dark ? "#555" : "#ccc";
  }

  function getBlueprintColor() {
    return "rgba(0, 180, 255, 0.5)";
  }

  function get3DColor() {
    const dark = document.body.classList.contains("dark");
    return dark ? "#0ff" : "#00aaff";
  }

  function ensureDefs() {
    let defs = canvas.querySelector("defs");
    if (!defs) {
      defs = document.createElementNS(svgNS, "defs");
      canvas.insertBefore(defs, canvas.firstChild);
    }
    return defs;
  }

  function ensureBackground() {
    let bg = canvas.querySelector("#grid-background");
    if (!bg) {
      bg = document.createElementNS(svgNS, "rect");
      bg.setAttribute("id", "grid-background");
      bg.setAttribute("x", 0);
      bg.setAttribute("y", 0);
      bg.setAttribute("width", "100%");
      bg.setAttribute("height", "100%");
      bg.style.transition = "fill-opacity 0.3s ease";
      canvas.insertBefore(bg, canvas.firstChild.nextSibling);
    }
    bg.setAttribute("fill", enabled ? "url(#grid)" : "transparent");
    bg.setAttribute("fill-opacity", enabled ? opacity : 0);
  }

  // ---- patrones ----

  function patternNormal(defs, size) {
    const pattern = document.createElementNS(svgNS, "pattern");
    pattern.setAttribute("id", "grid");
    pattern.setAttribute("patternUnits", "userSpaceOnUse");
    pattern.setAttribute("width", size);
    pattern.setAttribute("height", size);

    pattern.innerHTML = `
      <path d="M ${size} 0 L 0 0 0 ${size}"
            fill="none"
            stroke="${getColor()}"
            stroke-width="1" />
    `;
    defs.appendChild(pattern);
  }

  function patternFigma(defs, size) {
    const big = size * subdivisions;

    const pattern = document.createElementNS(svgNS, "pattern");
    pattern.setAttribute("id", "grid");
    pattern.setAttribute("patternUnits", "userSpaceOnUse");
    pattern.setAttribute("width", big);
    pattern.setAttribute("height", big);

    pattern.innerHTML = `
      <pattern id="subgrid" patternUnits="userSpaceOnUse" width="${size}" height="${size}">
        <path d="M ${size} 0 L 0 0 0 ${size}"
              fill="none"
              stroke="${getSubColor()}"
              stroke-width="0.5" />
      </pattern>

      <rect width="${big}" height="${big}" fill="url(#subgrid)" />

      <path d="M ${big} 0 L 0 0 0 ${big}"
            fill="none"
            stroke="${getColor()}"
            stroke-width="1.5" />
    `;
    defs.appendChild(pattern);
  }

  function patternIso(defs, size) {
    const h = size * Math.sqrt(3) / 2;

    const pattern = document.createElementNS(svgNS, "pattern");
    pattern.setAttribute("id", "grid");
    pattern.setAttribute("patternUnits", "userSpaceOnUse");
    pattern.setAttribute("width", size);
    pattern.setAttribute("height", h);

    pattern.innerHTML = `
      <path d="M 0 0 L ${size} 0"
            stroke="${getColor()}" stroke-width="1"/>
      <path d="M 0 0 L ${size/2} ${h}"
            stroke="${getColor()}" stroke-width="1"/>
      <path d="M ${size} 0 L ${size/2} ${h}"
            stroke="${getColor()}" stroke-width="1"/>
    `;
    defs.appendChild(pattern);
  }

  function patternBlueprint(defs, size) {
    const pattern = document.createElementNS(svgNS, "pattern");
    pattern.setAttribute("id", "grid");
    pattern.setAttribute("patternUnits", "userSpaceOnUse");
    pattern.setAttribute("width", size);
    pattern.setAttribute("height", size);

    pattern.innerHTML = `
      <rect width="${size}" height="${size}" fill="rgba(0,0,40,0.95)" />
      <path d="M ${size} 0 L 0 0 0 ${size}"
            fill="none"
            stroke="${getBlueprintColor()}"
            stroke-width="1" />
    `;
    defs.appendChild(pattern);
  }

  function pattern3D(defs, size) {
    const pattern = document.createElementNS(svgNS, "pattern");
    pattern.setAttribute("id", "grid");
    pattern.setAttribute("patternUnits", "userSpaceOnUse");
    pattern.setAttribute("width", size);
    pattern.setAttribute("height", size);

    const color = get3DColor();

    pattern.innerHTML = `
      <g stroke="${color}" stroke-width="0.7" stroke-opacity="0.7">
        <path d="M 0 ${size} L ${size} ${size}"/>
        <path d="M 0 ${size} L ${size} 0"/>
        <path d="M ${size/2} 0 L ${size/2} ${size}"/>
      </g>
    `;
    defs.appendChild(pattern);
  }

  function getDynamicSize() {
    const { scale } = zoomController.getState();
    if (scale < 0.5) return baseSize * 4;
    if (scale < 1) return baseSize * 2;
    if (scale > 2) return baseSize / 2;
    return baseSize;
  }

  function regenerate() {
    const defs = ensureDefs();
    defs.innerHTML = "";

    const size = getDynamicSize();

    if (mode === "normal") patternNormal(defs, size);
    if (mode === "figma") patternFigma(defs, size);
    if (mode === "iso") patternIso(defs, size);
    if (mode === "blueprint") patternBlueprint(defs, size);
    if (mode === "grid3d") pattern3D(defs, size);

    ensureBackground();
  }

  function fadeIn() {
    opacity = 1;
    ensureBackground();
  }

  function fadeOut() {
    opacity = 0;
    ensureBackground();
  }

  return {
    init() {
      regenerate();
    },

    setMode(newMode) {
      mode = newMode;
      regenerate();
    },

    setBaseSize(size) {
      baseSize = size;
      regenerate();
    },

    setSubdivisions(n) {
      subdivisions = n;
      regenerate();
    },

    setColor(c) {
      customColor = c;
      regenerate();
    },

    toggle() {
      enabled = !enabled;
      if (!enabled) fadeOut();
      else fadeIn();
    },

    enable() {
      enabled = true;
      fadeIn();
    },

    disable() {
      enabled = false;
      fadeOut();
    },

    refresh() {
      regenerate();
    },

    fadeIn,
    fadeOut
  };
}