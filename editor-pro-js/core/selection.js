export const selectedElements = new Set();
export let handlesGroup = null;

export function clearSelection() {
  selectedElements.forEach(el => el.classList.remove("selected-shape"));
  selectedElements.clear();
  removeHandles();
}

export function selectOnly(el) {
  clearSelection();
  selectedElements.add(el);
  el.classList.add("selected-shape");
}

export function toggleSelect(el) {
  if (selectedElements.has(el)) {
    selectedElements.delete(el);
    el.classList.remove("selected-shape");
  } else {
    selectedElements.add(el);
    el.classList.add("selected-shape");
  }
}

export function updateSelectionStyles() {
  document.querySelectorAll(".shape").forEach(el => {
    el.classList.toggle("selected-shape", selectedElements.has(el));
  });
}

export function removeHandles() {
  if (handlesGroup && handlesGroup.parentNode) {
    handlesGroup.parentNode.removeChild(handlesGroup);
  }
  handlesGroup = null;
}

export function setHandlesGroup(g) {
  handlesGroup = g;
}