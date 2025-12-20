import { getSVGPoint, snap } from "../core/geometry.js";
import { createShape } from "../core/shapes.js";
import { selectOnly } from "../core/selection.js";

export function initTools(canvas, currentIdRef, onShapeCreated) {
  document.querySelectorAll(".tool").forEach(tool => {
    tool.addEventListener("dragstart", e => {
      e.dataTransfer.setData("type", tool.dataset.type);
    });
  });

  canvas.addEventListener("dragover", e => e.preventDefault());

  canvas.addEventListener("drop", e => {
    e.preventDefault();
    const type = e.dataTransfer.getData("type");
    const pt = getSVGPoint(canvas, e.clientX, e.clientY);
    currentIdRef.value++;
    const shape = createShape(type, snap(pt.x), snap(pt.y), currentIdRef.value);
    if (!shape) return;
    canvas.appendChild(shape);
    selectOnly(shape);
    onShapeCreated(shape);
  });
}