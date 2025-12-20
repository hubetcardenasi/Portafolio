import { parseTransform } from "./transform.js";
import { removeHandles, setHandlesGroup, selectedElements } from "./selection.js";
import { onHandleDown } from "./resize.js";

const svgNS = "http://www.w3.org/2000/svg";

export function drawHandlesForSingle(canvas) {
  removeHandles();
  if (selectedElements.size !== 1) return;

  const el = [...selectedElements][0];
  const bbox = el.getBBox();
  const t = parseTransform(el.getAttribute("transform") || "");

  const g = document.createElementNS(svgNS, "g");
  const corners = [
    { x: bbox.x, y: bbox.y },
    { x: bbox.x + bbox.width, y: bbox.y },
    { x: bbox.x + bbox.width, y: bbox.y + bbox.height },
    { x: bbox.x, y: bbox.y + bbox.height }
  ];

  corners.forEach((c, i) => {
    const h = document.createElementNS(svgNS, "rect");
    h.setAttribute("x", c.x - 4);
    h.setAttribute("y", c.y - 4);
    h.setAttribute("width", 8);
    h.setAttribute("height", 8);
    h.classList.add("handle");
    h.dataset.corner = i;
    g.appendChild(h);
  });

  const cx = bbox.x + bbox.width / 2;
  const cy = bbox.y - 20;
  const rot = document.createElementNS(svgNS, "circle");
  rot.setAttribute("cx", cx);
  rot.setAttribute("cy", cy);
  rot.setAttribute("r", 6);
  rot.classList.add("handle", "handle-rotate");
  rot.dataset.type = "rotate";
  g.appendChild(rot);

  g.setAttribute("transform", `translate(${t.tx},${t.ty}) rotate(${t.r}, ${bbox.x + bbox.width/2}, ${bbox.y + bbox.height/2})`);
  canvas.appendChild(g);

  g.addEventListener("mousedown", e => onHandleDown(e, canvas));
  setHandlesGroup(g);
}