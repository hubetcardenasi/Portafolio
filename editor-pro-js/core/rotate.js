import { selectedElements } from "./selection.js";
import { parseTransform, setTransform } from "./transform.js";
import { drawHandlesForSingle } from "./handles.js";

let isRotating = false;
let rotationCenter = null;

export function startRotate(e, canvas) {
  e.stopPropagation();
  if (selectedElements.size !== 1) return;
  const el = [...selectedElements][0];
  const bbox = el.getBBox();
  const t = parseTransform(el.getAttribute("transform") || "");
  rotationCenter = {
    x: bbox.x + bbox.width/2 + t.tx,
    y: bbox.y + bbox.height/2 + t.ty
  };
  isRotating = true;
  window.addEventListener("mousemove", ev => onRotateMove(ev, canvas));
  window.addEventListener("mouseup", stopRotate);
}

function onRotateMove(e, canvas) {
  if (!isRotating || selectedElements.size !== 1) return;
  const el = [...selectedElements][0];

  const pt = getSVGPointFromCanvas(canvas, e.clientX, e.clientY);
  const angle = Math.atan2(pt.y - rotationCenter.y, pt.x - rotationCenter.x) * 180 / Math.PI;
  const t = parseTransform(el.getAttribute("transform") || "");
  setTransform(el, t.tx, t.ty, angle);
  drawHandlesForSingle(canvas);
}

function stopRotate() {
  isRotating = false;
  window.removeEventListener("mousemove", noop);
  window.removeEventListener("mouseup", stopRotate);
}

function noop() {}

function getSVGPointFromCanvas(svg, clientX, clientY) {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}