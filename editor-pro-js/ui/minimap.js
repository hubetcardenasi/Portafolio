export function initMinimap(mainCanvas, minimap) {
  function update() {
    const clone = mainCanvas.cloneNode(true);
    clone.removeAttribute("style");
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(clone);
    minimap.innerHTML = source;
  }

  return { update };
}