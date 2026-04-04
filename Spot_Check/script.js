let audioContext;
let microphone;
let workletNode;
let peak = -Infinity;
let smoothedDb = 0;
const SMOOTHING = 0.75; // exponential smoothing factor (0 = none, 1 = frozen)

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const meterFill = document.getElementById("meterFill");
const levelText = document.getElementById("levelText");
const peakText = document.getElementById("peakText");
const statusEl = document.getElementById("status");

// Session data: { label, readings: { "250 Hz": db, ... } }
let sessions = [];
let currentSessionIndex = null;

startBtn.addEventListener("click", startMonitoring);
stopBtn.addEventListener("click", stopMonitoring);
document.getElementById("save").addEventListener("click", saveReading);
document.getElementById("saveDelay").addEventListener("click", saveWithDelay);

async function startMonitoring() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

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
        peakText.textContent = peak.toFixed(1) + " dB";
      }

      meterFill.style.width = smoothedDb + "%";
      levelText.textContent = smoothedDb.toFixed(1);
    };

    startBtn.style.display = "none";
    stopBtn.style.display = "block";
    document.getElementById("save").disabled = false;
    document.getElementById("saveDelay").disabled = false;
    setStatus("Monitoring active — play your tones", "active");
  } catch (err) {
    console.error("Error accessing microphone:", err);
    setStatus("Microphone access denied", "error");
  }
}

function stopMonitoring() {
  if (workletNode) workletNode.disconnect();
  if (microphone) microphone.disconnect();
  if (audioContext) audioContext.close();

  peak = -Infinity;
  smoothedDb = 0;
  peakText.textContent = "—";

  startBtn.style.display = "block";
  stopBtn.style.display = "none";
  document.getElementById("save").disabled = true;
  document.getElementById("saveDelay").disabled = true;
  meterFill.style.width = "0%";
  levelText.textContent = "—";
  setStatus("", "");
}

function setStatus(text, type) {
  statusEl.textContent = text;
  statusEl.style.background = type === "active"
    ? "rgba(63, 185, 80, 0.15)"
    : type === "error"
    ? "rgba(248, 81, 73, 0.15)"
    : "transparent";
  statusEl.style.padding = text ? "6px 10px" : "2px 0";
}

function saveReading() {
  const freq = document.getElementById("stim_freq").value;
  const booth = document.getElementById("booth_name").value.trim() || "—";
  const rawDate = document.getElementById("date").value;
  const date = rawDate
    ? rawDate.split("-").slice(1).concat(rawDate.split("-")[0]).join("/")
    : "—";
  const currentDb = parseFloat(levelText.textContent);

  if (isNaN(currentDb)) {
    setStatus("Start monitoring before saving", "error");
    return;
  }

  const label = booth + " " + date;

  // Find or create session
  let session = sessions.find((s) => s.label === label);
  if (!session) {
    session = { label, readings: {} };
    sessions.push(session);
  }

  session.readings[freq] = currentDb.toFixed(1);
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
  const tbody = document.getElementById("resultsBody");
  tbody.innerHTML = "";

  for (const session of sessions) {
    const tr = document.createElement("tr");
    const tdLabel = document.createElement("td");
    tdLabel.textContent = session.label;
    tr.appendChild(tdLabel);

    for (const freq of FREQ_COLS) {
      const td = document.createElement("td");
      td.textContent = session.readings[freq] ?? "";
      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  }
}

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
