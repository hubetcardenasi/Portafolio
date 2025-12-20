import { selectedElements } from "../core/selection.js";
import { getSVGPoint, snap, getShapesBoundingBoxes } from "../core/geometry.js";
import { parseTransform, setTransform } from "../core/transform.js";
import { drawHandlesForSingle } from "../core/handles.js";

export function initDrag(canvas, guides, onSelectionChanged) {
  let isDragging = false;
  let dragStart = null;

  function startDrag(e) {
    if (!selectedElements.size) return;
    isDragging = true;
    dragStart = getSVGPoint(canvas, e.clientX, e.clientY);

    const move = ev => onMove(ev);
    const up = () => stopDrag(move, up);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  }

  function onMove(e) {
    if (!isDragging) return;
    const pt = getSVGPoint(canvas, e.clientX, e.clientY);
    const dx = pt.x - dragStart.x;
    const dy = pt.y - dragStart.y;
    dragStart = pt;

    guides.clearGuides();

    const allBbs = getShapesBoundingBoxes(canvas);
    const SNAP_DIST = 5;

    selectedElements.forEach(el => {
      const t = parseTransform(el.getAttribute("transform") || "");
      let ntx = snap(t.tx + dx);
      let nty = snap(t.ty + dy);

      const bb = el.getBBox();
      let elCenter = { x: bb.x + bb.width/2 + ntx, y: bb.y + bb.height/2 + nty };

      allBbs.forEach(({ el: other, bb: obb }) => {
        if (other === el) return;
        const ocx = obb.x + obb.width/2;
        const ocy = obb.y + obb.height/2;

        if (Math.abs(elCenter.x - ocx) < SNAP_DIST) {
          ntx += ocx - elCenter.x;
          elCenter.x = ocx;
          guides.showVertical(e.clientX);
        }
        if (Math.abs(elCenter.y - ocy) < SNAP_DIST) {
          nty += ocy - elCenter.y;
          elCenter.y = ocy;
          guides.showHorizontal(e.clientY);
        }
      });

      setTransform(el, ntx, nty, t.r);
    });

    if (selectedElements.size === 1) {
      drawHandlesForSingle(canvas);
    }
  }

  function stopDrag(move, up) {
    isDragging = false;
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", up);
    guides.clearGuides();
    onSelectionChanged();
  }

  return { startDrag };
}