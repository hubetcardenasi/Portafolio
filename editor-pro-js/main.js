// main.js — Proyecto B PRO COMPLETO

import { initTools } from "./ui/tools.js";
import { initLayers } from "./ui/layers.js";
import { initProperties } from "./ui/properties.js";
import { initMarquee } from "./ui/marquee.js";
import { initDrag } from "./ui/drag.js";
import { initZoom } from "./ui/zoom.js";
import { initMinimap } from "./ui/minimap.js";
import { initGuides } from "./ui/guides.js";
import { exportSVG, exportPNG } from "./core/export.js";
import { initHistory } from "./core/history.js";
import { exportToJSON, importFromJSON } from "./core/serialize.js";
import { selectedElements, selectOnly, toggleSelect, clearSelection } from "./core/selection.js";
import { drawHandlesForSingle } from "./core/handles.js";
import { parseTransform, setTransform } from "./core/transform.js";
import { initGrid } from "./core/grid.js";
import { initSim3D } from "./ui/sim3d.js";

// -------------------------------
// ELEMENTOS DEL DOM
// -------------------------------

const canvas = document.getElementById("canvas");
const selectionOverlay = document.getElementById("selectionOverlay");
const guidesOverlay = document.getElementById("guidesOverlay");
const layerList = document.getElementById("layerList");

const propFill = document.getElementById("propFill");
const propStroke = document.getElementById("propStroke");
const propStrokeWidth = document.getElementById("propStrokeWidth");
const propFontSize = document.getElementById("propFontSize");
const propRotation = document.getElementById("propRotation");

const btnDelete = document.getElementById("btnDelete");
const btnDuplicate = document.getElementById("btnDuplicate");
const btnBringFront = document.getElementById("btnBringFront");
const btnSendBack = document.getElementById("btnSendBack");
const btnExportPNG = document.getElementById("btnExportPNG");
const btnExportSVG = document.getElementById("btnExportSVG");
const btnSaveProject = document.getElementById("btnSaveProject");
const loadProject = document.getElementById("loadProject");

const sidebar = document.getElementById("sidebar");
const rightPanel = document.getElementById("rightPanel");
const toggleSidebar = document.getElementById("toggleSidebar");
const toggleTheme = document.getElementById("toggleTheme");
const imageLoader = document.getElementById("imageLoader");

const minimapSvg = document.getElementById("minimap");

// Panel de Grid
const gridSizeInput = document.getElementById("gridSizeInput");
const gridSubInput = document.getElementById("gridSubInput");
const gridColorInput = document.getElementById("gridColorInput");

const gridModeNormal = document.getElementById("gridModeNormal");
const gridModeFigma = document.getElementById("gridModeFigma");
const gridModeIso = document.getElementById("gridModeIso");
const gridModeBlueprint = document.getElementById("gridModeBlueprint");
const gridMode3D = document.getElementById("gridMode3D");
const gridToggle = document.getElementById("gridToggle");


// -------------------------------
// SISTEMAS PRINCIPALES
// -------------------------------

const currentIdRef = { value: 0 };

const layers = initLayers(canvas, layerList);
const props = initProperties(canvas, {
  propFill,
  propStroke,
  propStrokeWidth,
  propFontSize,
  propRotation
});

const guides = initGuides(guidesOverlay);
const zoom = initZoom(canvas);
const minimap = initMinimap(canvas, minimapSvg);
const history = initHistory(canvas);

// GRID PRO
const grid = initGrid(canvas, zoom);
grid.init();
window.grid = grid; // para que zoom.js pueda refrescarlo


// -------------------------------
// TOOLS (crear shapes)
// -------------------------------

initTools(canvas, currentIdRef, shape => {
  enableShapeInteractions(shape);
  layers.update();
  onSelectionChanged();
  history.snapshot();
});


// -------------------------------
// MARQUEE (selección múltiple)
// -------------------------------

initMarquee(canvas, selectionOverlay, () => {
  layers.refresh();
  props.syncWithSelection();
  if (selectedElements.size === 1) drawHandlesForSingle(canvas);
  minimap.update();
  history.snapshot();
});


// -------------------------------
// SIDEBAR
// -------------------------------

toggleSidebar.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
});


// -------------------------------
// MODO OSCURO
// -------------------------------

toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  grid.refresh();
});


// -------------------------------
// CANVAS RESPONSIVO
// -------------------------------

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.setAttribute("width", rect.width);
  canvas.setAttribute("height", rect.height);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();


// -------------------------------
// INTERACCIÓN CON SHAPES
// -------------------------------

function enableShapeInteractions(el) {
  el.addEventListener("mousedown", e => {
    e.stopPropagation();
    const additive = e.ctrlKey || e.metaKey;

    if (additive) toggleSelect(el);
    else selectOnly(el);

    props.syncWithSelection();

    if (selectedElements.size === 1) drawHandlesForSingle(canvas);

    drag.startDrag(e);
  });
}


// -------------------------------
// DRAG
// -------------------------------

const drag = initDrag(canvas, guides, onSelectionChanged);


// -------------------------------
// ACCIONES DE CAPAS
// -------------------------------

btnBringFront.addEventListener("click", () => {
  history.snapshot();
  selectedElements.forEach(el => canvas.appendChild(el));
  layers.update();
  minimap.update();
});

btnSendBack.addEventListener("click", () => {
  history.snapshot();
  selectedElements.forEach(el =>
    canvas.insertBefore(el, canvas.firstChild.nextSibling)
  );
  layers.update();
  minimap.update();
});


// -------------------------------
// ELIMINAR Y DUPLICAR
// -------------------------------

btnDelete.addEventListener("click", () => {
  if (!selectedElements.size) return;
  history.snapshot();
  selectedElements.forEach(el => canvas.removeChild(el));
  clearSelection();
  layers.update();
  minimap.update();
});

btnDuplicate.addEventListener("click", () => {
  if (!selectedElements.size) return;
  history.snapshot();

  const newSet = new Set();

  selectedElements.forEach(el => {
    const clone = el.cloneNode(true);
    currentIdRef.value++;
    clone.dataset.id = `obj-${currentIdRef.value}`;

    const t = parseTransform(clone.getAttribute("transform") || "");
    setTransform(clone, t.tx + 20, t.ty + 20, t.r);

    canvas.appendChild(clone);
    enableShapeInteractions(clone);
    newSet.add(clone);
  });

  selectedElements.clear();
  newSet.forEach(el => selectedElements.add(el));

  layers.update();
  onSelectionChanged();
  minimap.update();
});


// -------------------------------
// EXPORTAR
// -------------------------------

btnExportSVG.addEventListener("click", () => exportSVG(canvas));
btnExportPNG.addEventListener("click", () => exportPNG(canvas));


// -------------------------------
// UNDO / REDO
// -------------------------------

document.addEventListener("keydown", e => {
  if (e.ctrlKey && e.key.toLowerCase() === "z") {
    e.preventDefault();
    history.undo();
    layers.update();
    minimap.update();
  }
  if (e.ctrlKey && e.key.toLowerCase() === "y") {
    e.preventDefault();
    history.redo();
    layers.update();
    minimap.update();
  }
});


// -------------------------------
// GUARDAR / CARGAR JSON
// -------------------------------

btnSaveProject.addEventListener("click", () => {
  const json = exportToJSON(canvas);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "proyecto.json";
  a.click();
  URL.revokeObjectURL(url);
});

loadProject.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = evt => {
    importFromJSON(canvas, evt.target.result);

    [...canvas.querySelectorAll(".shape")].forEach(el =>
      enableShapeInteractions(el)
    );

    layers.update();
    onSelectionChanged();
    minimap.update();
    history.snapshot();
  };

  reader.readAsText(file);
});


// -------------------------------
// CARGA DE IMÁGENES DESDE DISCO
// -------------------------------

imageLoader.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = evt => {
    const href = evt.target.result;
    const svgNS = "http://www.w3.org/2000/svg";

    currentIdRef.value++;
    const el = document.createElementNS(svgNS, "image");
    el.setAttribute("href", href);
    el.setAttribute("x", 100);
    el.setAttribute("y", 100);
    el.setAttribute("width", 200);
    el.setAttribute("height", 200);
    el.classList.add("shape");
    el.dataset.id = `obj-${currentIdRef.value}`;

    canvas.appendChild(el);
    enableShapeInteractions(el);
    selectOnly(el);

    layers.update();
    onSelectionChanged();
    minimap.update();
    history.snapshot();
  };

  reader.readAsDataURL(file);
});


// -------------------------------
// PANEL DE CONFIGURACIÓN DE GRID
// -------------------------------

gridSizeInput.addEventListener("input", () => {
  grid.setBaseSize(parseInt(gridSizeInput.value));
});

gridSubInput.addEventListener("input", () => {
  grid.setSubdivisions(parseInt(gridSubInput.value));
});

gridColorInput.addEventListener("input", () => {
  grid.setColor(gridColorInput.value);
});

gridModeNormal.onclick = () => grid.setMode("normal");
gridModeFigma.onclick = () => grid.setMode("figma");
gridModeIso.onclick = () => grid.setMode("iso");
gridModeBlueprint.onclick = () => grid.setMode("blueprint");
gridMode3D.onclick = () => grid.setMode("grid3d");

gridToggle.onclick = () => grid.toggle();


// -------------------------------
// ACTUALIZAR SELECCIÓN
// -------------------------------

function onSelectionChanged() {
  layers.refresh();
  props.syncWithSelection();
  if (selectedElements.size === 1) drawHandlesForSingle(canvas);
  minimap.update();
}


const sim3d = initSim3D(canvas);
document.getElementById("toggle3D").onclick = () => {
  sim3d.toggle();
  grid.setMode("grid3d"); // cambia grid automáticamente
};