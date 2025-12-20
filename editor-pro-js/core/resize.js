import { selectedElements } from "./selection.js";
import { drawHandlesForSingle } from "./handles.js";

let isResizing = false;
let resizeHandleIndex = null;

export function onHandleDown(e, canvas) {
  e.stopPropagation();
  const target = e.target;
  if (target.dataset.type === "rotate") {
    // Rotación avanzada se podría agregar aquí si la quieres
    return;
  }
  isResizing = true;
  resizeHandleIndex = +target.dataset.corner;

  const move = ev => onResizeMove(ev, canvas);
  const up = () => stopResize(move, up);

  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", up);
}

function stopResize(move, up) {
  isResizing = false;
  resizeHandleIndex = null;
  window.removeEventListener("mousemove", move);
  window.removeEventListener("mouseup", up);
}

function onResizeMove(e, canvas) {
  if (!isResizing || selectedElements.size !== 1) return;
  const el = [...selectedElements][0];

  const inv = el.getCTM().inverse();
  const ptCanvas = canvas.createSVGPoint();
  ptCanvas.x = e.clientX;
  ptCanvas.y = e.clientY;
  const ptLocal = ptCanvas.matrixTransform(inv);

  const bbox = el.getBBox();
  let x = bbox.x, y = bbox.y, w = bbox.width, h = bbox.height;

  if (resizeHandleIndex === 0) {
    w = bbox.x + bbox.width - ptLocal.x;
    h = bbox.y + bbox.height - ptLocal.y;
    x = ptLocal.x;
    y = ptLocal.y;
  } else if (resizeHandleIndex === 1) {
    w = ptLocal.x - bbox.x;
    h = bbox.y + bbox.height - ptLocal.y;
    y = ptLocal.y;
  } else if (resizeHandleIndex === 2) {
    w = ptLocal.x - bbox.x;
    h = ptLocal.y - bbox.y;
  } else if (resizeHandleIndex === 3) {
    w = bbox.x + bbox.width - ptLocal.x;
    h = ptLocal.y - bbox.y;
    x = ptLocal.x;
  }

  if (w < 10 || h < 10) return;
  applyResize(el, x, y, w, h);
  drawHandlesForSingle(canvas);
}

function applyResize(el, x, y, w, h) {
  if (["rect", "image"].includes(el.tagName)) {
    el.setAttribute("x", x);
    el.setAttribute("y", y);
    el.setAttribute("width", w);
    el.setAttribute("height", h);
  } else if (el.tagName === "circle") {
    const r = Math.min(w, h)/2;
    el.setAttribute("cx", x + w/2);
    el.setAttribute("cy", y + h/2);
    el.setAttribute("r", r);
  } else if (el.tagName === "polygon") {
    const cx = x + w/2;
    const cy = y + h/2;
    const p1 = `${cx},${cy - h/2}`;
    const p2 = `${cx - w/2},${cy + h/2}`;
    const p3 = `${cx + w/2},${cy + h/2}`;
    el.setAttribute("points", `${p1} ${p2} ${p3}`);
  } else if (el.tagName === "text") {
    el.setAttribute("x", x);
    el.setAttribute("y", y + h);
  }
}