// Pen tool: freehand marks over the audiograms and change charts. Each chart
// canvas gets a transparent canvas on top. While the pen is on, that layer
// takes the pointer, so drawing never reaches the chart (nothing is plotted
// and the change charts don't switch view). Marks print with the report.

const PEN = { color: "#222", width: 2 };
const SURFACE_IDS = ["audiogram_R", "audiogram_L", "audiogram_overlay", "change_R", "change_L"];

const surfaces = [];
const history = []; // the surface each stroke went on, oldest first, for Undo
let penOn = false;

function redraw(surface) {
  const { canvas, strokes } = surface;
  const ctx = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = PEN.color;
  ctx.lineWidth = PEN.width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  strokes.forEach((stroke) => {
    ctx.beginPath();
    stroke.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    if (stroke.length === 1) ctx.lineTo(stroke[0][0] + 0.1, stroke[0][1]);
    ctx.stroke();
  });
}

// Match the chart's size. A hidden chart (e.g. the overlay in split view)
// measures 0 and is sized when it appears.
function resize(surface) {
  const { width, height } = surface.target.getBoundingClientRect();
  if (!width || !height) return;
  const ratio = window.devicePixelRatio || 1;
  surface.canvas.width = Math.round(width * ratio);
  surface.canvas.height = Math.round(height * ratio);
  surface.canvas.style.width = `${width}px`;
  surface.canvas.style.height = `${height}px`;
  redraw(surface);
}

function addSurface(target) {
  const wrap = document.createElement("span");
  wrap.className = "pen-wrap";
  target.replaceWith(wrap);
  const canvas = document.createElement("canvas");
  canvas.className = "pen-layer";
  wrap.append(target, canvas);

  const surface = { target, canvas, strokes: [] };
  surfaces.push(surface);
  new ResizeObserver(() => resize(surface)).observe(target);

  let stroke = null;
  const pointAt = (event) => {
    const rect = canvas.getBoundingClientRect();
    return [event.clientX - rect.left, event.clientY - rect.top];
  };
  canvas.addEventListener("pointerdown", (event) => {
    if (!penOn) return;
    canvas.setPointerCapture(event.pointerId);
    stroke = [pointAt(event)];
    surface.strokes.push(stroke);
    history.push(surface);
    redraw(surface);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (!stroke) return;
    stroke.push(pointAt(event));
    redraw(surface);
  });
  const end = () => (stroke = null);
  canvas.addEventListener("pointerup", end);
  canvas.addEventListener("pointercancel", end);
}

export function setPen(on) {
  penOn = on;
  document.querySelector(".grid-container").classList.toggle("pen-on", on);
  document.getElementById("pen_button").setAttribute("aria-pressed", String(on));
}

function undo() {
  const surface = history.pop();
  if (!surface) return;
  surface.strokes.pop();
  redraw(surface);
}

function clearAll() {
  history.length = 0;
  surfaces.forEach((surface) => {
    surface.strokes.length = 0;
    redraw(surface);
  });
}

// Call before the charts are created: it wraps each chart canvas.
export function initPen() {
  SURFACE_IDS.forEach((id) => addSurface(document.getElementById(id)));
  document.getElementById("pen_button").addEventListener("click", () => setPen(!penOn));
  document.getElementById("pen_undo").addEventListener("click", undo);
  document.getElementById("pen_clear").addEventListener("click", clearAll);
}
