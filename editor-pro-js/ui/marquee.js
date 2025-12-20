import { selectedElements, clearSelection, updateSelectionStyles } from "../core/selection.js";

export function initMarquee(canvas, selectionOverlay, onSelectionChanged) {
  let isMarquee = false;
  let marqueeDiv = null;
  let start = null;

  function startMarquee(e) {
    if (e.target !== canvas) return;
    clearSelection();
    isMarquee = true;
    start = { x: e.clientX, y: e.clientY };
    marqueeDiv = document.createElement("div");
    marqueeDiv.classList.add("selection-rect");
    selectionOverlay.appendChild(marqueeDiv);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", endMarquee);
  }

  function onMove(e) {
    if (!isMarquee) return;
    const x = Math.min(e.clientX, start.x);
    const y = Math.min(e.clientY, start.y);
    const w = Math.abs(e.clientX - start.x);
    const h = Math.abs(e.clientY - start.y);
    marqueeDiv.style.left = x + "px";
    marqueeDiv.style.top = y + "px";
    marqueeDiv.style.width = w + "px";
    marqueeDiv.style.height = h + "px";
  }

  function endMarquee() {
    isMarquee = false;
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", endMarquee);

    if (!marqueeDiv) return;
    const rect = marqueeDiv.getBoundingClientRect();
    selectionOverlay.removeChild(marqueeDiv);
    marqueeDiv = null;

    const shapes = [...canvas.querySelectorAll(".shape")];
    shapes.forEach(el => {
      const bb = el.getBoundingClientRect();
      if (
        bb.left >= rect.left &&
        bb.right <= rect.right &&
        bb.top >= rect.top &&
        bb.bottom <= rect.bottom
      ) {
        selectedElements.add(el);
      }
    });

    updateSelectionStyles();
    onSelectionChanged();
  }

  canvas.addEventListener("mousedown", startMarquee);
}