import { selectedElements, updateSelectionStyles, selectOnly } from "../core/selection.js";

export function initLayers(canvas, layerList) {
  function update() {
    layerList.innerHTML = "";
    const shapes = [...canvas.querySelectorAll(".shape")];
    shapes.forEach(el => {
      const li = document.createElement("li");
      li.textContent = el.dataset.id || el.tagName;
      li.dataset.id = el.dataset.id;
      li.classList.toggle("selected", selectedElements.has(el));
      li.addEventListener("click", () => {
        selectOnly(el);
        refresh();
      });
      layerList.prepend(li);
    });
  }

  function refresh() {
    updateSelectionStyles();
    const items = layerList.querySelectorAll("li");
    items.forEach(li => {
      const match = [...selectedElements].find(el => el.dataset.id === li.dataset.id);
      li.classList.toggle("selected", !!match);
    });
  }

  return { update, refresh };
}