export function parseTransform(t) {
  if (!t) return { tx: 0, ty: 0, r: 0 };
  const tr = /translate\(([^,]+),([^,]+)\)/.exec(t);
  const rr = /rotate\(([^)]+)\)/.exec(t);
  return {
    tx: tr ? parseFloat(tr[1]) : 0,
    ty: tr ? parseFloat(tr[2]) : 0,
    r: rr ? parseFloat(rr[1]) : 0
  };
}

export function setTransform(el, tx, ty, r) {
  el.setAttribute("transform", `translate(${tx},${ty}) rotate(${r})`);
}