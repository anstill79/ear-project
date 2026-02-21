const cards = document.querySelectorAll(".card");
const audios = document.querySelectorAll("audio");
const stopBtn = document.getElementById("stop_all_btn");
const loop_all = document.getElementById("loop_all");
const volumeValue = document.getElementById("volumeValue");

function updateStopButtonState() {
  const isAnyPlaying = Array.from(audios).some((audio) => !audio.paused);
  stopBtn.disabled = !isAnyPlaying;
}

function stopPrevAudio() {
  audios.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
  cards.forEach((c) => c.classList.remove("highlight-card"));
  updateStopButtonState();
}

cards.forEach((card) => {
  const audio = card.querySelector("audio");

  card.addEventListener("click", (e) => {
    // Prevent double-triggering if the user clicks the native audio controls
    if (e.target.tagName === "AUDIO") return;

    const wasPlaying = card.classList.contains("highlight-card");

    stopPrevAudio();

    if (!wasPlaying) {
      card.classList.add("highlight-card");
      audio.play();
    }
  });

  audio.addEventListener("play", updateStopButtonState);
  audio.addEventListener("pause", updateStopButtonState);
  audio.addEventListener("ended", () => {
    card.classList.remove("highlight-card");
    updateStopButtonState();
  });
});

function setAllLoopOn() {
  audios.forEach((audio) => {
    audio.loop = loop_all.checked;
  });
}

function setVolume(value) {
  audios.forEach((audio) => {
    audio.volume = value / 100;
  });
  volumeValue.value = value;
}

// Global hotkeys
document.addEventListener("keyup", (e) => {
  if (e.key === "Escape" || e.key === "Enter") {
    stopPrevAudio();
  }
});

loop_all.addEventListener("change", setAllLoopOn);

// Initial state
updateStopButtonState();
setAllLoopOn();
setVolume(document.getElementById("volume").value);
