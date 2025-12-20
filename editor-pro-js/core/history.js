export function initHistory(canvas) {
  const undoStack = [];
  const redoStack = [];

  function snapshot() {
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(canvas);
    undoStack.push(source);
    redoStack.length = 0;
  }

  function restoreFrom(source) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(source, "image/svg+xml");
    const newSvg = doc.documentElement;
    while (canvas.firstChild) canvas.removeChild(canvas.firstChild);
    [...newSvg.childNodes].forEach(n => canvas.appendChild(n));
  }

  function undo() {
    if (!undoStack.length) return;
    const current = new XMLSerializer().serializeToString(canvas);
    redoStack.push(current);
    const prev = undoStack.pop();
    restoreFrom(prev);
  }

  function redo() {
    if (!redoStack.length) return;
      const current = new XMLSerializer().serializeToString(canvas);
      undoStack.push(current);
      const next = redoStack.pop();
      restoreFrom(next);
  }

  return { snapshot, undo, redo };
}