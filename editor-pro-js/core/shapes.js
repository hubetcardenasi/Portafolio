import { setTransform } from "./transform.js";

const svgNS = "http://www.w3.org/2000/svg";

export function mk(tag, attrs) {
  const el = document.createElementNS(svgNS, tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

export function createShape(type, x, y, id) {
  let el;

  switch (type) {
    case "rect":
      el = mk("rect", { x: x - 60, y: y - 40, width: 120, height: 80, fill: "#3498db", stroke: "#000", "stroke-width": 1 });
      break;
    case "circle":
      el = mk("circle", { cx: x, cy: y, r: 40, fill: "#e74c3c", stroke: "#000", "stroke-width": 1 });
      break;
    case "text":
      el = mk("text", { x, y, "font-size": 24, fill: "#000" });
      el.textContent = "Texto";
      break;
    case "line":
      el = mk("line", { x1: x - 50, y1: y - 50, x2: x + 50, y2: y + 50, stroke: "#000", "stroke-width": 2 });
      break;
    case "arrow":
      el = mk("line", { x1: x - 50, y1: y, x2: x + 50, y2: y, stroke: "#000", "stroke-width": 2, "marker-end": "url(#arrowHead)" });
      break;
    case "polygon": {
      const pts = `${x},${y - 50} ${x - 40},${y + 30} ${x + 40},${y + 30}`;
      el = mk("polygon", { points: pts, fill: "#9b59b6", stroke: "#000", "stroke-width": 1 });
      break;
    }
    case "image":
      el = mk("image", { x: x - 60, y: y - 60, width: 120, height: 120 });
      el.setAttribute("href", "editor-pro-assets/ejemplo.png");
      break;
    case "ui-button":
      el = mk("rect", { x: x - 60, y: y - 20, width: 120, height: 40, rx: 8, fill: "#ffffff", stroke: "#333", "stroke-width": 1 });
      break;
    case "ui-card":
      el = mk("rect", { x: x - 100, y: y - 60, width: 200, height: 120, rx: 10, fill: "#f7f7f7", stroke: "#aaa", "stroke-width": 1 });
      break;
    case "sensor-node":
      el = mk("circle", { cx: x, cy: y, r: 30, fill: "#2ecc71", stroke: "#145a32", "stroke-width": 2 });
      break;
    case "actuator-node":
      el = mk("rect", { x: x - 40, y: y - 20, width: 80, height: 40, fill: "#e67e22", stroke: "#6e2c00", "stroke-width": 2 });
      break;
  }

  if (!el) return null;
  el.classList.add("shape");
  el.dataset.id = `obj-${id}`;
  setTransform(el, 0, 0, 0);
  return el;
}