// js/ui/sim3d.js
//
// Modo de simulación 3D para el editor.
// Aplica transformaciones CSS 3D al canvas completo.

export function initSim3D(canvas) {
  let enabled = false;
  let rotX = 0;
  let rotY = 0;
  let zoom = 1;
  let dragging = false;
  let last = { x: 0, y: 0 };

  function apply() {
    canvas.style.transformOrigin = "50% 50%";
    canvas.style.transition = "transform 0.2s ease";

    if (!enabled) {
      canvas.style.transform = `scale(${zoom})`;
      return;
    }

    canvas.style.transform =
      `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${zoom})`;
  }

  function enable() {
    enabled = true;
    apply();
  }

  function disable() {
    enabled = false;
    apply();
  }

  function toggle() {
    enabled = !enabled;
    apply();
  }

  // Rotación con ALT + arrastrar
  canvas.addEventListener("mousedown", e => {
    if (!enabled) return;
    if (!e.altKey) return;

    dragging = true;
    last = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener("mousemove", e => {
    if (!dragging) return;

    const dx = e.clientX - last.x;
    const dy = e.clientY - last.y;

    rotY += dx * 0.5;
    rotX -= dy * 0.5;

    last = { x: e.clientX, y: e.clientY };
    apply();
  });

  window.addEventListener("mouseup", () => {
    dragging = false;
  });

  // Zoom 3D con scroll
  canvas.addEventListener("wheel", e => {
    if (!enabled) return;

    e.preventDefault();
    zoom += e.deltaY > 0 ? -0.1 : 0.1;
    zoom = Math.max(0.2, Math.min(zoom, 3));
    apply();
  });

  return { enable, disable, toggle };
}