const audioPlayerA = document.getElementById("audio_player_A");
const audioPlayerB = document.getElementById("audio_player_B");
const allPlayers = [audioPlayerA, audioPlayerB];

const loopToggle = document.getElementById("loopToggle");
const loopLengthGroup = document.getElementById("loopLengthGroup");
const stopAllBtn = document.getElementById("stopAllBtn");
const audioFileInput = document.getElementById("audioFile");

// ── Audio File Selection ───────────────────────────────────────────────────
audioFileInput.addEventListener("change", () => {
  const url = audioFileInput.value;
  if (!url) return;

  allPlayers.forEach((player) => {
    player.src = url;
    player.load();
  });
});

// ── Loop Toggle & Length ────────────────────────────────────────────────────
let loopLengthTimeout = null;

function getLoopDuration() {
  const selected = document.querySelector('input[name="loopLength"]:checked');
  return selected ? selected.value : "forever";
}

function clearLoopTimer() {
  if (loopLengthTimeout !== null) {
    clearTimeout(loopLengthTimeout);
    loopLengthTimeout = null;
  }
}

function applyLoop() {
  const looping = loopToggle.checked;
  allPlayers.forEach((player) => {
    player.loop = looping;
  });
  loopLengthGroup.style.visibility = looping ? "visible" : "hidden";
}

function startLoopTimer() {
  clearLoopTimer();
  if (!loopToggle.checked) return;
  const duration = getLoopDuration();
  if (duration === "forever") return;

  loopLengthTimeout = setTimeout(() => {
    stopAll();
  }, parseInt(duration) * 1000);
}

loopToggle.addEventListener("change", applyLoop);

document.querySelectorAll('input[name="loopLength"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    applyLoop();
    // If audio is currently playing with a timed loop, restart the timer
    if (loopToggle.checked && allPlayers.some((p) => !p.paused)) {
      startLoopTimer();
    }
  });
});

// ── Stop All ───────────────────────────────────────────────────────────────
function setActiveButton(btn) {
  if (activeButton) activeButton.classList.remove("active");
  activeButton = btn;
  if (activeButton) activeButton.classList.add("active");
}

function stopAll() {
  clearLoopTimer();
  allPlayers.forEach((player) => {
    player.pause();
    player.currentTime = 0;
  });
  setActiveButton(null);
  updateStopButtonState();
}

function updateStopButtonState() {
  const anyPlaying = allPlayers.some((p) => !p.paused);
  stopAllBtn.disabled = !anyPlaying;
}

stopAllBtn.addEventListener("click", stopAll);

const sectionForPlayer = new Map([
  [audioPlayerA, document.getElementById("sectionA")],
  [audioPlayerB, document.getElementById("sectionB")],
]);

allPlayers.forEach((player) => {
  const section = sectionForPlayer.get(player);
  player.addEventListener("play", () => {
    section.classList.add("playing");
    updateStopButtonState();
  });
  player.addEventListener("pause", () => {
    section.classList.remove("playing");
    updateStopButtonState();
  });
  player.addEventListener("ended", () => {
    section.classList.remove("playing");
    setActiveButton(null);
    updateStopButtonState();
  });
});

// Keyboard shortcut: Escape or Enter stops all audio (but not when editing a header)
document.addEventListener("keyup", (e) => {
  if (e.target.classList.contains("column-header")) return;
  if (e.key === "Escape" || e.key === "Enter") stopAll();
});

// Prevent newlines and blur on Enter in editable headers
document.querySelectorAll(".column-header").forEach((header) => {
  header.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      header.blur();
    }
  });
});

// ── Volume Buttons & Fill Logic ────────────────────────────────────────────
function setFill(btn) {
  const section = btn.closest(".btn-column");
  const buttons = section.querySelectorAll("button[data-volume]");

  // Clear fill/highlight within this section
  buttons.forEach((b) => b.classList.remove("filled", "highlighted"));

  // Fill clicked button and everything below it (lower volumes)
  btn.classList.add("filled");
  let next = btn.closest(".btn-row").nextElementSibling;
  while (next && next.classList.contains("btn-row")) {
    const b = next.querySelector("button[data-volume]");
    if (b) b.classList.add("filled");
    next = next.nextElementSibling;
  }

  // Cross-section highlighting logic
  const sectionA = document.getElementById("sectionA");
  const sectionB = document.getElementById("sectionB");
  const buttonsA = sectionA.querySelectorAll("button[data-volume]");
  const buttonsB = sectionB.querySelectorAll("button[data-volume]");

  // Find where section A's fill starts
  let startIndex = -1;
  buttonsA.forEach((b, i) => {
    if (b.classList.contains("filled") && startIndex === -1) startIndex = i;
  });

  if (section === sectionA) {
    // Clicking in A clears B's fill and highlights
    buttonsB.forEach((b) => b.classList.remove("filled", "highlighted"));
  } else {
    // Clicking in B: highlight the gap between A's fill start and B's fill start
    buttonsB.forEach((b) => b.classList.remove("highlighted"));

    const filledCountB = Array.from(buttonsB).filter((b) =>
      b.classList.contains("filled")
    ).length;

    if (filledCountB > 0 && startIndex !== -1) {
      for (let i = startIndex; i < buttonsB.length; i++) {
        if (buttonsB[i].classList.contains("filled")) break;
        buttonsB[i].classList.add("highlighted");
      }
    }
  }
}

let activeButton = null;

function playAudio(event) {
  if (!audioFileInput.value) return;

  const button = event.currentTarget;

  if (allPlayers.some((p) => !p.paused) && button === activeButton) {
    stopAll();
    return;
  }

  allPlayers.forEach((p) => {
    p.pause();
    p.currentTime = 0;
  });

  const volume = parseFloat(button.getAttribute("data-volume"));
  const sectionId = button.closest(".btn-column").id;
  const player = sectionId === "sectionA" ? audioPlayerA : audioPlayerB;

  player.volume = volume;
  applyLoop();
  player.play();
  startLoopTimer();
  setActiveButton(button);

  setFill(button);
}

document.querySelectorAll("button[data-volume]").forEach((btn) => {
  btn.addEventListener("click", playAudio);
});

// ── Heard Indicators ───────────────────────────────────────────────────────
document.querySelectorAll(".heard-indicator").forEach((indicator) => {
  indicator.addEventListener("click", (e) => {
    e.stopPropagation();
    const column = indicator.closest(".btn-column");
    const isHeard = indicator.classList.contains("heard");
    column.querySelectorAll(".heard-indicator").forEach((sibling) => {
      sibling.classList.remove("heard");
    });
    if (!isHeard) {
      indicator.classList.add("heard");
    }
  });
});

// ── Help Modal ─────────────────────────────────────────────────────────────
const helpModal = document.getElementById("helpModal");
const helpBtn = document.getElementById("helpBtn");
const helpCloseBtn = document.getElementById("helpCloseBtn");

helpBtn.addEventListener("click", () => { helpModal.hidden = false; });
helpCloseBtn.addEventListener("click", () => { helpModal.hidden = true; });
helpModal.addEventListener("click", (e) => {
  if (e.target === helpModal) helpModal.hidden = true;
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !helpModal.hidden) {
    helpModal.hidden = true;
    e.stopImmediatePropagation();
  }
});

// ── Initial State ──────────────────────────────────────────────────────────
updateStopButtonState();
applyLoop();

setTimeout(() => {
  const url = audioFileInput.value;
  if (url) {
    allPlayers.forEach((player) => {
      player.src = url;
      player.load();
    });
  }
}, 100);
