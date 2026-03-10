const audioPlayerA = document.getElementById("audio_player_A");
const audioPlayerB = document.getElementById("audio_player_B");
const allPlayers = [audioPlayerA, audioPlayerB];

const loopToggle = document.getElementById("loopToggle");
const stopAllBtn = document.getElementById("stopAllBtn");
const audioFileInput = document.getElementById("audioFile");
const fileNameDisplay = document.getElementById("fileName");

// ── Audio File Selection ───────────────────────────────────────────────────
let currentObjectURL = null;

audioFileInput.addEventListener("change", () => {
  const file = audioFileInput.files[0];
  if (!file) return;

  // Revoke the previous object URL to free memory
  if (currentObjectURL) {
    URL.revokeObjectURL(currentObjectURL);
  }

  currentObjectURL = URL.createObjectURL(file);

  allPlayers.forEach((player) => {
    player.src = currentObjectURL;
    player.load();
  });

  fileNameDisplay.textContent = file.name;
});

// ── Loop Toggle ────────────────────────────────────────────────────────────
function applyLoop() {
  allPlayers.forEach((player) => {
    player.loop = loopToggle.checked;
  });
}

loopToggle.addEventListener("change", applyLoop);

// ── Stop All ───────────────────────────────────────────────────────────────
function stopAll() {
  allPlayers.forEach((player) => {
    player.pause();
    player.currentTime = 0;
  });
  updateStopButtonState();
}

function updateStopButtonState() {
  const anyPlaying = allPlayers.some((p) => !p.paused);
  stopAllBtn.disabled = !anyPlaying;
}

stopAllBtn.addEventListener("click", stopAll);

allPlayers.forEach((player) => {
  player.addEventListener("play", updateStopButtonState);
  player.addEventListener("pause", updateStopButtonState);
  player.addEventListener("ended", updateStopButtonState);
});

// Keyboard shortcut: Escape or Enter stops all audio
document.addEventListener("keyup", (e) => {
  if (e.key === "Escape" || e.key === "Enter") stopAll();
});

// ── Volume Buttons & Fill Logic ────────────────────────────────────────────
function setFill(btn) {
  const section = btn.parentElement;
  const buttons = section.querySelectorAll("button[data-volume]");

  // Clear fill/highlight within this section
  buttons.forEach((b) => b.classList.remove("filled", "highlighted"));

  // Fill clicked button and everything below it (lower volumes)
  btn.classList.add("filled");
  let next = btn.nextElementSibling;
  while (next && next.matches("button[data-volume]")) {
    next.classList.add("filled");
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

function playAudio(event) {
  if (!currentObjectURL) return;

  // Pause both players before playing the selected one
  allPlayers.forEach((p) => {
    p.pause();
    p.currentTime = 0;
  });

  const button = event.currentTarget;
  const volume = parseFloat(button.getAttribute("data-volume"));
  const sectionId = button.parentElement.id;
  const player = sectionId === "sectionA" ? audioPlayerA : audioPlayerB;

  player.volume = volume;
  applyLoop();
  player.play();

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

// ── Initial State ──────────────────────────────────────────────────────────
updateStopButtonState();
applyLoop();
