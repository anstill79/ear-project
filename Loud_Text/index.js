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
  }
  displayArea.style.color = textColorPicker.value;
  displayArea.style.backgroundColor = bgColorPicker.value;
  document.documentElement.style.setProperty(
    "--border-color",
    hexToRgb(textColorPicker.value)
  );
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
});
textSizeUpBtn.addEventListener("click", function () {
  if (textSizeSlider.value < textSizeSlider.max) {
    textSizeSlider.value = parseFloat(textSizeSlider.value) + 0.5;
    displayArea.style.fontSize = `${textSizeSlider.value}rem`;
  }
});

bgColorPicker.addEventListener("input", function () {
  displayArea.style.backgroundColor = this.value;
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

// Function to convert hex to rgb values
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

// Update the CSS variable when the color picker value changes
textColorPicker.addEventListener("input", function () {
  // Update the RGB values for use with alpha
  document.documentElement.style.setProperty(
    "--border-color",
    hexToRgb(this.value)
  );
  displayArea.style.color = this.value;
});
