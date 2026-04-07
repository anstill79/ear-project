let audioContext;
let microphone;
let workletNode;
let peak = -Infinity;
let smoothedDb = 0;
const SMOOTHING = 0.75; // exponential smoothing factor (0 = none, 1 = frozen)

const canvas = document.getElementById("levelChart");
const ctx = canvas.getContext("2d");
const CHART_WINDOW = 5000; // ms
let chartData = [];

function resizeChart() {
  const dpr = window.devicePixelRatio || 1;
  const cssWidth = canvas.offsetWidth;
  const cssHeight = canvas.offsetHeight;
  canvas.width = cssWidth * dpr;
  canvas.height = cssHeight * dpr;
  ctx.scale(dpr, dpr);
}

function pushChartData(value) {
  const now = Date.now();
  chartData.push({ time: now, value });
  const cutoff = now - CHART_WINDOW;
  chartData = chartData.filter((e) => e.time >= cutoff);
  drawChart(now);
}

function drawChart(now) {
  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;
  ctx.clearRect(0, 0, w, h);

  // Subtle grid lines at 25 / 50 / 75
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  for (const level of [25, 50, 75]) {
    const y = h - (level / 100) * h;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  if (chartData.length < 2) return;

  // Filled area under the line
  ctx.beginPath();
  for (let i = 0; i < chartData.length; i++) {
    const x = w - ((now - chartData[i].time) / CHART_WINDOW) * w;
    const y = h - (chartData[i].value / 100) * h;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  const lastX = w - ((now - chartData[chartData.length - 1].time) / CHART_WINDOW) * w;
  ctx.lineTo(lastX, h);
  ctx.lineTo(w - ((now - chartData[0].time) / CHART_WINDOW) * w, h);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "rgba(20,184,166,0.25)");
  grad.addColorStop(1, "rgba(20,184,166,0)");
  ctx.fillStyle = grad;
  ctx.fill();

  // Line on top
  ctx.beginPath();
  ctx.strokeStyle = "#14b8a6";
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  for (let i = 0; i < chartData.length; i++) {
    const x = w - ((now - chartData[i].time) / CHART_WINDOW) * w;
    const y = h - (chartData[i].value / 100) * h;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
}

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const meterFill = document.getElementById("meterFill");
const levelText = document.getElementById("levelText");
const levelUnit = document.getElementById("levelUnit");
const peakText = document.getElementById("peakText");

// Session data: { label, readings: { "250 Hz": db, ... } }
let sessions = JSON.parse(localStorage.getItem("spotcheck_sessions") || "[]");
let currentSessionIndex = null;

startBtn.addEventListener("click", startMonitoring);
stopBtn.addEventListener("click", stopMonitoring);
document.addEventListener("keydown", (e) => {
  const tag = e.target.tagName;
  if (e.code === "Space" && tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") {
    e.preventDefault();
    audioContext ? stopMonitoring() : startMonitoring();
  }
});
peakText.addEventListener("click", () => {
  if (audioContext) {
    peak = -Infinity;
    peakText.textContent = "—";
  }
});
document.getElementById("save").addEventListener("click", saveReading);
document.getElementById("saveDelay").addEventListener("click", saveWithDelay);

async function startMonitoring() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    resizeChart();
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    await audioContext.audioWorklet.addModule("audio-processor.js");

    microphone = audioContext.createMediaStreamSource(stream);
    workletNode = new AudioWorkletNode(audioContext, "level-processor");

    microphone.connect(workletNode);
    // No need to connect workletNode to destination — we're only reading levels.

    workletNode.port.onmessage = (event) => {
      const rms = event.data;
      // Convert RMS (-1..1 range) to a 0–100 display scale.
      // 20*log10(rms) gives dBFS (0 = full scale). Shift +100 to get a
      // useful positive range; clamp to [0, 100].
      const rawDb = 20 * Math.log10(rms + 1e-10) + 100;
      const displayDb = Math.max(0, Math.min(100, rawDb));

      // Exponential smoothing
      smoothedDb = SMOOTHING * smoothedDb + (1 - SMOOTHING) * displayDb;

      if (smoothedDb > peak) {
        peak = smoothedDb;
        peakText.textContent = Math.round(peak) + " dB";
      }

      meterFill.style.width = smoothedDb + "%";
      levelText.textContent = Math.round(smoothedDb);
      pushChartData(smoothedDb);
    };

    levelText.classList.add("level-value--active");
    levelUnit.style.display = "";
    startBtn.style.display = "none";
    document.getElementById("monitorActiveRow").style.display = "flex";
    document.getElementById("save").disabled = false;
    document.getElementById("saveDelay").disabled = false;
  } catch (err) {
    console.error("Error accessing microphone:", err);
  }
}

function stopMonitoring() {
  if (workletNode) workletNode.disconnect();
  if (microphone) microphone.disconnect();
  if (audioContext) audioContext.close();

  peak = -Infinity;
  smoothedDb = 0;
  chartData = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  peakText.textContent = "—";

  startBtn.style.display = "";
  document.getElementById("monitorActiveRow").style.display = "none";
  document.getElementById("save").disabled = true;
  document.getElementById("saveDelay").disabled = true;
  meterFill.style.width = "0%";
  levelText.classList.remove("level-value--active");
  levelText.textContent = "Click to start monitoring";
  levelUnit.style.display = "none";
}

function saveReading() {
  const currentDb = parseFloat(levelText.textContent);
  stopMonitoring();

  const freq = document.getElementById("stim_freq").value;
  const booth = document.getElementById("booth_name").value.trim();
  const rawDate = document.getElementById("date").value;
  const date = rawDate
    ? rawDate.split("-").slice(1).concat(rawDate.split("-")[0]).join("/")
    : "—";
  const note = document.getElementById("note").value.trim();

  if (isNaN(currentDb)) return;

  const label = booth ? booth + " " + date : date;

  // Find or create session
  let session = sessions.find((s) => s.label === label);
  if (!session) {
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    session = { label, timestamp, note, readings: {} };
    sessions.push(session);
  }

  session.readings[freq] = Math.round(currentDb);
  renderTable();
  setStatus("Saved " + freq + ": " + currentDb.toFixed(1) + " dB", "active");
}

let saveTimer = null;

function saveWithDelay() {
  if (saveTimer) return;
  const btn = document.getElementById("saveDelay");
  let count = 3;
  btn.textContent = "Saving in " + count + " s…";
  btn.disabled = true;

  saveTimer = setInterval(() => {
    count--;
    if (count > 0) {
      btn.textContent = "Saving in " + count + " s…";
    } else {
      clearInterval(saveTimer);
      saveTimer = null;
      btn.textContent = "Save in 3 s";
      btn.disabled = false;
      saveReading();
    }
  }, 1000);
}

const FREQ_COLS = ["250 Hz", "500 Hz", "1000 Hz", "2000 Hz", "3000 Hz", "4000 Hz", "6000 Hz", "8000 Hz"];

function renderTable() {
  localStorage.setItem("spotcheck_sessions", JSON.stringify(sessions));
  const tbody = document.getElementById("resultsBody");
  tbody.innerHTML = "";

  for (let i = 0; i < sessions.length; i++) {
    const session = sessions[i];
    const tr = document.createElement("tr");

    const tdDel = document.createElement("td");
    const delBtn = document.createElement("button");
    delBtn.textContent = "×";
    delBtn.className = "row-delete-btn";
    delBtn.addEventListener("click", () => {
      sessions.splice(i, 1);
      renderTable();
    });
    tdDel.appendChild(delBtn);
    tr.appendChild(tdDel);

    const tdLabel = document.createElement("td");
    tdLabel.textContent = session.note ? session.label + " · " + session.note : session.label;
    tdLabel.title = session.timestamp ?? "";
    tr.appendChild(tdLabel);

    for (const freq of FREQ_COLS) {
      const td = document.createElement("td");
      td.textContent = session.readings[freq] ?? "";
      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  }
}

renderTable();

function setDate() {
  const dateField = document.querySelector("#date");
  if (dateField && dateField.value === "") {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    dateField.value = `${year}-${month}-${day}`;
  }
}
setDate();

function formatFreqLabel(freqString) {
  const hz = parseInt(freqString, 10);
  return hz >= 1000 ? hz / 1000 + "kHz" : hz + "Hz";
}

function updateSaveButtonText() {
  const freqString = document.getElementById("stim_freq").value;
  document.getElementById("save").textContent = "Save Now (" + formatFreqLabel(freqString) + ")";
}

function buildFreqViz() {
  const viz = document.getElementById("freqViz");
  const select = document.getElementById("stim_freq");
  for (const option of select.options) {
    const span = document.createElement("span");
    span.className = "freq-viz-label";
    span.textContent = formatFreqLabel(option.value);
    viz.appendChild(span);
  }
}

function updateFreqViz() {
  const select = document.getElementById("stim_freq");
  document.querySelectorAll(".freq-viz-label").forEach((label, i) => {
    label.classList.toggle("active", i === select.selectedIndex);
  });
}

document.getElementById("stim_freq").addEventListener("change", updateSaveButtonText);
document.getElementById("stim_freq").addEventListener("change", updateFreqViz);
buildFreqViz();
updateSaveButtonText();
updateFreqViz();

function changeFreq(direction) {
  const select = document.getElementById("stim_freq");
  const currentIndex = select.selectedIndex;
  if (direction === "up" && currentIndex > 0) {
    select.selectedIndex = currentIndex - 1;
  } else if (direction === "down" && currentIndex < select.options.length - 1) {
    select.selectedIndex = currentIndex + 1;
  }
  select.dispatchEvent(new Event("change"));
}

function changeLevel(direction) {
  const select = document.getElementById("pres_level");
  const currentIndex = select.selectedIndex;
  if (direction === "up" && currentIndex > 0) {
    select.selectedIndex = currentIndex - 1;
  } else if (direction === "down" && currentIndex < select.options.length - 1) {
    select.selectedIndex = currentIndex + 1;
  }
  select.dispatchEvent(new Event("change"));
}
