// Generate a simple beep tone
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let currentSource = null;
let currentGain = null;

function playTone(volume) {
  // Stop any currently playing audio
  if (currentSource) {
    currentSource.stop();
    currentSource = null;
  }

  // Create oscillator for a beep sound
  currentSource = audioContext.createOscillator();
  currentGain = audioContext.createGain();

  currentSource.connect(currentGain);
  currentGain.connect(audioContext.destination);

  // Set frequency to a pleasant tone (A4 = 440Hz)
  currentSource.frequency.value = 440;
  currentSource.type = "sine";

  // Set volume
  currentGain.gain.value = volume;

  // Play for 1 second
  currentSource.start();
  currentSource.stop(audioContext.currentTime + 1);

  // Clean up after playing
  currentSource.onended = () => {
    currentSource = null;
    currentGain = null;
  };
}

const setupScreen = document.getElementById("setupScreen");
const testScreen = document.getElementById("testScreen");
const confirmBtn = document.getElementById("confirmBtn");

confirmBtn.addEventListener("click", () => {
  setupScreen.style.display = "none";
  const main = document.querySelector("main");
  main.style.display = "block";
});

function setFill() {
  const thisSection = this.parentElement.id;

  const section = document.getElementById(thisSection);
  const buttons = section.querySelectorAll("button");
  buttons.forEach((btn) => {
    btn.classList.remove("filled");
  });
  this.classList.add("filled");
  let next = this.nextElementSibling;
  while (next) {
    next.classList.add("filled");
    next = next.nextElementSibling;
  }
}

const volumeButtons = document.querySelectorAll("button[data-volume]");
volumeButtons.forEach((btn) => btn.addEventListener("click", setFill));
