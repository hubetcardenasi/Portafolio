export function initZoom(canvas) {
  let scale = 1;
  let panX = 0;
  let panY = 0;
  let isPanning = false;
  let last = null;

  const MIN_ZOOM = 0.3;
  const MAX_ZOOM = 4;

  function applyTransform() {
    canvas.style.transformOrigin = "0 0";
    canvas.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
    if (window.grid) window.grid.refresh();
  }

  // Zoom con scroll
  canvas.addEventListener("wheel", e => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    zoomAt(e.clientX, e.clientY, delta);
  });

  function zoomAt(clientX, clientY, delta) {
    const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scale + delta));
    const rect = canvas.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;
    panX -= offsetX * (newScale - scale);
    panY -= offsetY * (newScale - scale);
    scale = newScale;
    applyTransform();
  }

  // Pan con barra espaciadora
  window.addEventListener("keydown", e => {
    if (e.code === "Space") {
      canvas.dataset.spacePan = "true";
      canvas.style.cursor = "grab";
    }
  });

  window.addEventListener("keyup", e => {
    if (e.code === "Space") {
      canvas.dataset.spacePan = "false";
      canvas.style.cursor = "default";
      isPanning = false;
    }
  });

  canvas.addEventListener("mousedown", e => {
    if (canvas.dataset.spacePan === "true") {
      isPanning = true;
      last = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = "grabbing";
    }
  });

  window.addEventListener("mousemove", e => {
    if (!isPanning) return;
    const dx = e.clientX - last.x;
    const dy = e.clientY - last.y;
    last = { x: e.clientX, y: e.clientY };
    panX += dx;
    panY += dy;
    applyTransform();
  });

  window.addEventListener("mouseup", () => {
    isPanning = false;
    if (canvas.dataset.spacePan === "true") canvas.style.cursor = "grab";
    else canvas.style.cursor = "default";
  });

  // Pinch-to-zoom táctil
  let lastTouchDist = null;
  let lastTouchCenter = null;

  canvas.addEventListener("touchstart", e => {
    if (e.touches.length === 2) {
      e.preventDefault();
      lastTouchDist = distance(e.touches[0], e.touches[1]);
      lastTouchCenter = center(e.touches[0], e.touches[1]);
    }
  }, { passive: false });

  canvas.addEventListener("touchmove", e => {
    if (e.touches.length === 2 && lastTouchDist) {
      e.preventDefault();
      const newDist = distance(e.touches[0], e.touches[1]);
      const factor = (newDist - lastTouchDist) / 300;
      zoomAt(lastTouchCenter.x, lastTouchCenter.y, factor);
      lastTouchDist = newDist;
    }
  }, { passive: false });

  canvas.addEventListener("touchend", () => {
    lastTouchDist = null;
    lastTouchCenter = null;
  });

  function distance(t1, t2) {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx*dx + dy*dy);
  }

  function center(t1, t2) {
    return {
      x: (t1.clientX + t2.clientX)/2,
      y: (t1.clientY + t2.clientY)/2
    };
  }

  return {
    reset() {
      scale = 1;
      panX = 0;
      panY = 0;
      applyTransform();
    },
    getState() {
      return { scale, panX, panY };
    }
  };
}