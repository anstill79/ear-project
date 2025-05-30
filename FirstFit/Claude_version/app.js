const globalVolumeSlider = document.getElementById("global-volume");
const volumeValueDisplay = document.getElementById("volume-value");
const cardContainer = document.getElementById("card-container");

const cards = document.querySelectorAll(".sound-card");
const audios = document.querySelectorAll("audio");
// Set initial volume for all audio elements
audios.forEach((player) => {
  player.volume = globalVolumeSlider.value;
});

globalVolumeSlider.addEventListener("input", function () {
  const volumeValue = (this.value * 100).toFixed(0);
  volumeValueDisplay.textContent = `${volumeValue}%`;

  audios.forEach((player) => {
    player.volume = this.value;
  });
});

stop_all_btn2.addEventListener("click", stopPrevAudio);
stop_all_btn1.addEventListener("click", stopPrevAudio);

cards.forEach((card) => {
  card.addEventListener("click", () => {
    cards.forEach((c) => c.classList.remove("highlight-card"));
    card.classList.add("highlight-card");
    playThisAudio(card);
  });
});

function playThisAudio(card) {
  audios.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
  const audio = card.querySelector("audio");
  audio.play();
  stop_all_btn2.innerText = "⬛️ Stop";
}

function stopPrevAudio() {
  cards.forEach((card) => {
    const audio = card.querySelector("audio");
    audio.pause();
    audio.currentTime = 0;
  });

  cards.forEach((c) => c.classList.remove("highlight-card"));
  stop_all_btn2.innerText = "";
}

function setAllLoopOn() {
  if (loop_all.checked) {
    audios.forEach((audio) => {
      audio.loop = true;
    });
  } else {
    audios.forEach((audio) => {
      audio.loop = false;
    });
  }
}

const body = document.querySelector("body");
body.addEventListener("keyup", function (e) {
  if (e.key === "Escape" || e.key === "Return" || e.key === " ") {
    stopPrevAudio();
  }
});

loop_all.addEventListener("change", setAllLoopOn);

audios.forEach((audio) => {
  audio.addEventListener("play", () => {
    stop_all_btn2.innerText = "⬛️ Stop";
  });
  audio.addEventListener("pause", () => {
    stop_all_btn2.innerText = "";
  });
});

//TO DO

// sound samples:
//  steady airplane noise
//  multi group convo
// loud restaurant
// knife hitting a plate
// super simple speech utterance that makes sense but is not distracting
// paper crinkling
//
