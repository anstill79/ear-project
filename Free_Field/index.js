const setupScreen = document.getElementById("setupScreen");
const testScreen = document.getElementById("testScreen");
const confirmBtn = document.getElementById("confirmBtn");

confirmBtn.addEventListener("click", () => {
  setupScreen.style.display = "none";
  const main = document.querySelector("main");
  main.style.display = "block";
});

function setFill(btn) {
  const section = document.getElementById(btn.parentElement.id);
  const buttons = section.querySelectorAll("button");
  buttons.forEach((btn) => {
    btn.classList.remove("filled", "highlighted");
  });
  btn.classList.add("filled");
  let next = btn.nextElementSibling;
  while (next) {
    next.classList.add("filled");
    next = next.nextElementSibling;
  }
  const sectionA = document.getElementById("sectionA");
  const sectionB = document.getElementById("sectionB");
  const buttonsA = sectionA.querySelectorAll("button");
  const buttonsB = sectionB.querySelectorAll("button");
  let startIndex = -1;
  buttonsA.forEach((btn, index) => {
    if (btn.classList.contains("filled") && startIndex === -1) {
      startIndex = index;
    }
  });
  if (section === sectionA) {
    buttonsB.forEach((btn) => btn.classList.remove("filled", "highlighted"));
  } else {
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
}
const volumeButtons = document.querySelectorAll("button[data-volume]");
volumeButtons.forEach((btn) => btn.addEventListener("click", playAudio));

function playAudio(event) {
  const audio_player_A = document.getElementById("audio_player_A");
  const audio_player_B = document.getElementById("audio_player_B");
  if (audio_player_A) {
    audio_player_A.pause();
    audio_player_A.currentTime = 0;
  }
  if (audio_player_B) {
    audio_player_B.pause();
    audio_player_B.currentTime = 0;
  }
  const button = event.currentTarget;
  const volume = parseFloat(button.getAttribute("data-volume"));
  const sectionId = button.parentElement.id;
  const audioPlayerId =
    sectionId === "sectionA" ? "audio_player_A" : "audio_player_B";
  const audioPlayer = document.getElementById(audioPlayerId);

  if (audioPlayer) {
    audioPlayer.volume = volume;
    audioPlayer.play();
  } else {
    console.error(`Audio player with ID ${audioPlayerId} not found.`);
  }
  setFill(button);
}
