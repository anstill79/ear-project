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
  const section = document.getElementById(this.parentElement.id);
  const buttons = section.querySelectorAll("button");

  // Clear filled and highlighted classes
  buttons.forEach((btn) => {
    btn.classList.remove("filled", "highlighted");
  });

  // Add filled to clicked button and all following buttons
  this.classList.add("filled");
  let next = this.nextElementSibling;
  while (next) {
    next.classList.add("filled");
    next = next.nextElementSibling;
  }

  // Update columnB highlighting based on columnA
  const sectionA = document.getElementById("sectionA");
  const sectionB = document.getElementById("sectionB");
  const buttonsA = sectionA.querySelectorAll("button");
  const buttonsB = sectionB.querySelectorAll("button");

  // Find the index of the first filled button in columnA
  let startIndex = -1;
  buttonsA.forEach((btn, index) => {
    if (btn.classList.contains("filled") && startIndex === -1) {
      startIndex = index;
    }
  });

  console.log("start", startIndex);

  // Clear any existing highlighting in columnB
  buttonsB.forEach((btn) => btn.classList.remove("highlighted"));

  const filledCountB = Array.from(buttonsB).filter((btn) =>
    btn.classList.contains("filled")
  ).length;

  if (filledCountB > 0 && startIndex !== -1) {
    for (let i = startIndex; i < buttonsB.length; i++) {
      if (buttonsB[i].classList.contains("filled")) {
        break; // Stop at first filled button
      }
      buttonsB[i].classList.add("highlighted");
    }
  }
}

const volumeButtons = document.querySelectorAll("button[data-volume]");
volumeButtons.forEach((btn) => btn.addEventListener("click", setFill));
