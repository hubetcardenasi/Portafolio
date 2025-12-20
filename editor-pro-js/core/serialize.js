export function exportToJSON(canvas) {
  const shapes = [...canvas.querySelectorAll(".shape")].map(el => {
    const obj = {
      tag: el.tagName,
      attrs: {},
      transform: el.getAttribute("transform") || "",
      id: el.dataset.id || null
    };
    [...el.attributes].forEach(attr => {
      if (attr.name === "transform") return;
      obj.attrs[attr.name] = attr.value;
    });
    return obj;
  });
  return JSON.stringify({ shapes }, null, 2);
}

export function importFromJSON(canvas, json) {
  const data = JSON.parse(json);
  while (canvas.firstChild) canvas.removeChild(canvas.firstChild);

  const svgNS = "http://www.w3.org/2000/svg";
  const defs = document.createElementNS(svgNS, "defs");
  const pattern = document.createElementNS(svgNS, "pattern");
  pattern.setAttribute("id", "grid");
  pattern.setAttribute("width", "20");
  pattern.setAttribute("height", "20");
  pattern.setAttribute("patternUnits", "userSpaceOnUse");
  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("d", "M 20 0 L 0 0 0 20");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "#ddd");
  path.setAttribute("stroke-width", "1");
  pattern.appendChild(path);
  defs.appendChild(pattern);
  canvas.appendChild(defs);
  const bg = document.createElementNS(svgNS, "rect");
  bg.setAttribute("width", "100%");
  bg.setAttribute("height", "100%");
  bg.setAttribute("fill", "url(#grid)");
  canvas.appendChild(bg);

  data.shapes.forEach(s => {
    const el = document.createElementNS(svgNS, s.tag);
    Object.entries(s.attrs).forEach(([k, v]) => el.setAttribute(k, v));
    if (s.transform) el.setAttribute("transform", s.transform);
    if (s.id) el.dataset.id = s.id;
    el.classList.add("shape");
    canvas.appendChild(el);
  });
}