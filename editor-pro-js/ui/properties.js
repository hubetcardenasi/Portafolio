import { selectedElements } from "../core/selection.js";
import { parseTransform, setTransform } from "../core/transform.js";

export function initProperties(canvas, controls) {
  const { propFill, propStroke, propStrokeWidth, propFontSize, propRotation } = controls;

  propFill.addEventListener("input", () => {
    selectedElements.forEach(el => {
      if (["rect", "circle", "polygon", "text"].includes(el.tagName)) {
        el.setAttribute("fill", propFill.value);
      }
    });
  });

  propStroke.addEventListener("input", () => {
    selectedElements.forEach(el => {
      if (["rect", "circle", "polygon", "line"].includes(el.tagName)) {
        el.setAttribute("stroke", propStroke.value);
      }
    });
  });

  propStrokeWidth.addEventListener("input", () => {
    selectedElements.forEach(el => {
      if (["rect", "circle", "polygon", "line"].includes(el.tagName)) {
        el.setAttribute("stroke-width", propStrokeWidth.value);
      }
    });
  });

  propFontSize.addEventListener("input", () => {
    selectedElements.forEach(el => {
      if (el.tagName === "text") {
        el.setAttribute("font-size", propFontSize.value);
      }
    });
  });

  propRotation.addEventListener("input", () => {
    selectedElements.forEach(el => {
      const t = parseTransform(el.getAttribute("transform") || "");
      setTransform(el, t.tx, t.ty, parseFloat(propRotation.value) || 0);
    });
  });

  function syncWithSelection() {
    if (selectedElements.size !== 1) return;
    const el = [...selectedElements][0];
    const t = parseTransform(el.getAttribute("transform") || "");
    propRotation.value = Math.round(t.r);

    if (["rect", "circle", "polygon", "text"].includes(el.tagName)) {
      propFill.value = el.getAttribute("fill") || "#000000";
    }
    if (["rect", "circle", "polygon", "line"].includes(el.tagName)) {
      propStroke.value = el.getAttribute("stroke") || "#000000";
      propStrokeWidth.value = parseFloat(el.getAttribute("stroke-width") || "1");
    }
    if (el.tagName === "text") {
      propFontSize.value = parseFloat(el.getAttribute("font-size") || "24");
    }
  }

  return { syncWithSelection };
}