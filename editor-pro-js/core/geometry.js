export const GRID_SIZE = 20;

export function snap(v) {
  return Math.round(v / GRID_SIZE) * GRID_SIZE;
}

export function getSVGPoint(svg, clientX, clientY) {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

export function getShapesBoundingBoxes(canvas) {
  return [...canvas.querySelectorAll(".shape")].map(el => {
    const bb = el.getBBox();
    return { el, bb };
  });
}