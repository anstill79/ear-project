const cards = document.querySelectorAll(".card");
const audios = document.querySelectorAll("audio");
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
}

function stopPrevAudio() {
  cards.forEach((card) => {
    const audio = card.querySelector("audio");
    audio.pause();
    audio.currentTime = 0;
  });

  cards.forEach((c) => c.classList.remove("highlight-card"));
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
  if (e.key === "Escape" || e.key === "Return") {
    stopPrevAudio();
  }
});

function setVolume(value) {
  const level = new Number(value);
  audios.forEach((audio) => {
    audio.volume = value / 100;
  });
  volumeValue.value = value;
}

//what is the listener type for a checkbox?
loop_all.addEventListener("change", setAllLoopOn);

//TO DO

// sound samples:
//  steady airplane noise
//  multi group convo
// loud restaurant
// knife hitting a plate
// super simple speech utterance that makes sense but is not distracting
// paper crinkling
//
