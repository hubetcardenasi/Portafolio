export function initGuides(guidesOverlay) {
  function clearGuides() {
    guidesOverlay.innerHTML = "";
  }

  function showVertical(x) {
    const div = document.createElement("div");
    div.classList.add("guide-line");
    div.style.left = x + "px";
    div.style.top = "0px";
    div.style.width = "1px";
    div.style.height = "100%";
    guidesOverlay.appendChild(div);
  }

  function showHorizontal(y) {
    const div = document.createElement("div");
    div.classList.add("guide-line");
    div.style.top = y + "px";
    div.style.left = "0px";
    div.style.height = "1px";
    div.style.width = "100%";
    guidesOverlay.appendChild(div);
  }

  return { clearGuides, showVertical, showHorizontal };
}