export function exportSVG(svg) {
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);
  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  download(url, "dibujo.svg");
}

export function exportPNG(svg) {
  const serializer = new XMLSerializer();
  const clone = svg.cloneNode(true);
  const source = serializer.serializeToString(clone);
  const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas");
    c.width = svg.clientWidth;
    c.height = svg.clientHeight;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(url);
    c.toBlob(blob => {
      const pngUrl = URL.createObjectURL(blob);
      download(pngUrl, "dibujo.png");
    });
  };
  img.src = url;
}

function download(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}