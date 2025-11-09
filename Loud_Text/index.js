const displayArea = document.getElementById("displayArea");
const inputText = document.getElementById("inputText");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const textSizeSlider = document.getElementById("textSizeSlider");
const textColorPicker = document.getElementById("textColorPicker");
const bgColorPicker = document.getElementById("bgColorPicker");

color_presets.addEventListener("change", function () {
  switch (this.value) {
    case "1":
      textColorPicker.value = "#ffffff";
      bgColorPicker.value = "#000000";
      break;
    case "2":
      textColorPicker.value = "#000000";
      bgColorPicker.value = "#ffffff";
      break;
    case "3":
      textColorPicker.value = "#00FF00";
      bgColorPicker.value = "#000000";
      break;
    case "4":
      textColorPicker.value = "#080808";
      bgColorPicker.value = "#2DF505";
      break;
    case "5":
      textColorPicker.value = "#FFFFFF";
      bgColorPicker.value = "#4D4D4D";
      break;
    case "6":
      textColorPicker.value = "#cdd6f4";
      bgColorPicker.value = "#073751";
      break;
    case "7":
      this.value = "--";
      return;
  }
  displayArea.style.color = textColorPicker.value;
  displayArea.style.backgroundColor = bgColorPicker.value;
  document.documentElement.style.setProperty(
    "--border-color",
    hexToRgb(textColorPicker.value)
  );
  saveSettings();
});

const splash = document.querySelector(".splash-container");

function appendMessage() {
  if (splash) {
    splash.remove();
  }
  if (inputText.value.trim() !== "") {
    const p = document.createElement("p");
    p.innerText = inputText.value;
    p.setAttribute("contenteditable", "true");
    displayArea.appendChild(p);

    // Scroll to the bottom to show the latest text
    displayArea.scrollTop = displayArea.scrollHeight;
    inputText.value = "";
  }
}

sendBtn.addEventListener("click", appendMessage);

inputText.addEventListener("keydown", function (e) {
  // Handle Enter key
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    appendMessage();
    return;
  }
});

clearBtn.addEventListener("click", clearDisplayText);

function clearDisplayText() {
  displayArea.innerHTML = "";
  inputText.value = "";
}

window.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.key === "Enter") {
    clearDisplayText();
    e.preventDefault();
    return;
  }
});

textSizeSlider.addEventListener("input", function () {
  displayArea.style.fontSize = `${this.value}rem`;
});

textSizeDownBtn.addEventListener("click", function () {
  if (textSizeSlider.value > textSizeSlider.min) {
    textSizeSlider.value = parseFloat(textSizeSlider.value) - 0.5;
    displayArea.style.fontSize = `${textSizeSlider.value}rem`;
  }
  saveSettings();
});
textSizeUpBtn.addEventListener("click", function () {
  if (textSizeSlider.value < textSizeSlider.max) {
    textSizeSlider.value = parseFloat(textSizeSlider.value) + 0.5;
    displayArea.style.fontSize = `${textSizeSlider.value}rem`;
  }
  saveSettings();
});

window.onload = function () {
  inputText.focus();
};

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    fullscreen.innerText = "Turn Fullscreen Off";
    inputText.focus();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
    fullscreen.innerText = "Turn Fullscreen On";
  }
}

function hexToRgb(hex) {
  // Remove the # if present
  hex = hex.replace("#", "");

  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `${r}, ${g}, ${b}`;
}

// Set initial RGB values
document.documentElement.style.setProperty(
  "--border-color",
  hexToRgb(textColorPicker.value)
);

textColorPicker.addEventListener("input", function () {
  document.documentElement.style.setProperty(
    "--border-color",
    hexToRgb(this.value)
  );
  displayArea.style.color = this.value;
  color_presets.value = "7";
  saveSettings();
});

bgColorPicker.addEventListener("input", function () {
  displayArea.style.backgroundColor = this.value;
  color_presets.value = "7";
  saveSettings();
});

function saveSettings() {
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();
  const timeStamp = `${date} ${time}`;
  const obj = {
    textColor: textColorPicker.value,
    bgColor: bgColorPicker.value,
    textSize: textSizeSlider.value,
    colorPreset: color_presets.value,
    savedAt: timeStamp,
  };
  localStorage.setItem("loudTextSettings", JSON.stringify(obj));
}
function loadSettings() {
  const settings = JSON.parse(localStorage.getItem("loudTextSettings"));
  if (settings) {
    textColorPicker.value = settings.textColor;
    bgColorPicker.value = settings.bgColor;
    textSizeSlider.value = settings.textSize;
    displayArea.style.color = settings.textColor;
    displayArea.style.backgroundColor = settings.bgColor;
    color_presets.value = settings.colorPreset;
    displayArea.style.fontSize = `${settings.textSize}rem`;
    document.documentElement.style.setProperty(
      "--border-color",
      hexToRgb(settings.textColor)
    );
  }
}
loadSettings();
