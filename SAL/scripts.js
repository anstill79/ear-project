const inputs = document.querySelectorAll("input");
const resultsDisplay = document.querySelectorAll(".result");
const moreInfo = document.querySelectorAll(".info");
inputs.forEach((input) => {
  input.addEventListener("change", doSAL);
});
moreInfo.forEach((info) => {
  info.addEventListener("click", launchResult);
});
//[0] is initial, [1] is masked
const data = {
  R: {
    five: [null, null],
    one: [null, null],
    two: [null, null],
    four: [null, null],
  },
  L: {
    five: [null, null],
    one: [null, null],
    two: [null, null],
    four: [null, null],
  },
};

const shiftNorms = {
  five: 55,
  one: 60,
  two: 60,
  four: 60,
};
//[0] is result, [1] is comment, [2] is symbol, [3] is name for display in modal
const SALresults = {
  R: {
    five: [null, null, null, "Right 500 Hz"],
    one: [null, null, null, "Right 1000 Hz"],
    two: [null, null, null, "Right 2000 Hz"],
    four: [null, null, null, "Right 4000 Hz"],
  },
  L: {
    five: [null, null, null, "Left 500 Hz"],
    one: [null, null, null, "Left 1000 Hz"],
    two: [null, null, null, "Left 2000 Hz"],
    four: [null, null, null, "Left 4000 Hz"],
  },
};

function doSAL() {
  const id = this.id;
  const val = parseInt(this.value);
  const ear = id.charAt(0);
  let freq = "";
  if (id.includes("initial")) {
    freq = id.replace(`${ear}_initial_`, "");
    data[ear][freq][0] = val;
  } else if (id.includes("masked")) {
    freq = id.replace(`${ear}_masked_`, "");
    data[ear][freq][1] = val;
  }
  const targetResult = `${ear}_result_${freq}`;
  const targetInfo = `${ear}_info_${freq}`;
  const shift = data[ear][freq][1] - data[ear][freq][0];
  let capped;
  //why do SAL in this case?
  if (data[ear][freq][0] < 50 && data[ear][freq][0] !== null) {
    //SALresults[ear][freq][0] = null;
    if (data[ear][freq][0] && data[ear][freq][1]) {
      SALresults[ear][freq][0] = shiftNorms[freq] - shift;
      capped =
        SALresults[ear][freq][0] < -10
          ? " Result shift was too large. Displayed value is capped at -10"
          : "";
      if (SALresults[ear][freq][0] < -10) {
        SALresults[ear][freq][0] = -10;
      }
    }
    SALresults[ear][freq][2] = "⚠️";
    SALresults[ear][
      freq
    ][1] = `Initial result is lower than 50dB. Traditional masking may be a better choice for this frequency. The SAL value will be displayed in case traditional masking is not viable due to opposite ear severity but use with caution.${capped}`;

    setResultsToCell(ear, freq, targetResult, targetInfo);
    return;
  }
  if (data[ear][freq][0] > 85) {
    SALresults[ear][freq][2] = "⚠️";
    SALresults[ear][freq][1] =
      "Initial result is greater than 85dB. The limits of most equipment can be an issue here. The SAL value is displayed but use with caution.";
    if (
      typeof data[ear][freq][1] === "number" &&
      typeof data[ear][freq][0] === "number"
    ) {
      SALresults[ear][freq][0] = shiftNorms[freq] - shift;
    }
    setResultsToCell(ear, freq, targetResult, targetInfo);
    return;
  }

  if (data[ear][freq][0] && data[ear][freq][1]) {
    const maxAllowed = data[ear][freq][0] - shiftNorms[freq];
    SALresults[ear][freq][0] = shiftNorms[freq] - shift;
    // if shift is larger than norm, just put it at initial minus norm
    if (shift > shiftNorms[freq]) {
      SALresults[ear][freq][0] = data[ear][freq][0] - shiftNorms[freq];
      SALresults[ear][freq][2] = "🤔";
      SALresults[ear][
        freq
      ][1] = `The result is usable but the shift amount is too large. The displayed result uses norm the value instead of shift (norm at this frequency is ${shiftNorms[freq]}dB)`;
    } else {
      SALresults[ear][freq][1] = "Looks good. Use the displayed result.";
      SALresults[ear][freq][2] = "✅";
    }
    // technical error or typo. masked result is lower than initial result
    if (data[ear][freq][1] < data[ear][freq][0]) {
      SALresults[ear][freq][0] = "!";
      SALresults[ear][freq][1] =
        "The masked result is lower than initial result. Please check for technical error or typo.";
      SALresults[ear][freq][2] = "⚠️";
    }
  } else {
    //wipe out result if one of the inputs is empty
    SALresults[ear][freq][0] = null;
    SALresults[ear][freq][1] = null;
  }
  setResultsToCell(ear, freq, targetResult, targetInfo);
}

function setResultsToCell(ear, freq, targetResult, targetInfo) {
  resultsDisplay.forEach(
    (result) => {
      if (result.id === targetResult) {
        result.textContent = SALresults[ear][freq][0];
      }
    },
    moreInfo.forEach((info) => {
      if (info.id === targetInfo) {
        info.textContent = SALresults[ear][freq][2];
      }
    })
  );
}

const result_modal = document.getElementById("result_modal");
const help_modal = document.getElementById("help_text_modal");
const norms_modal = document.getElementById("custom_norms_modal");
let activeModal;
//used by result and help modals
function closeModal(event) {
  if (event.target === activeModal) {
    activeModal.style.display = "none";
    activeModal.removeEventListener("click", closeModal);
  }
}
//only used by result modal
function launchResult(event) {
  closeModal(event);
  activeModal = result_modal;
  activeModal.style.display = "block";
  activeModal.addEventListener("click", closeModal);
  const id = event.target.id;
  const ear = id.charAt(0);
  const freq = id.replace(`${ear}_info_`, "");
  const targetComment = document.getElementById("result_modal_content");
  targetComment.innerText = "";
  const title = document.createElement("span");
  const content = document.createElement("span");
  const div = document.createElement("div");
  div.classList.add("spacer");
  title.innerText = SALresults[ear][freq][3];
  title.classList.add("card-title");
  content.innerText = SALresults[ear][freq][1];
  content.classList.add("card-content");
  targetComment.appendChild(title);
  targetComment.appendChild(div);
  targetComment.appendChild(content);
}

helpButton.addEventListener("click", launchModal);
normsButton.addEventListener("click", launchModal);

function launchModal(event) {
  closeModal(event);
  const target = this.id;

  if (target === "helpButton") {
    activeModal = help_modal;
  }
  if (target === "normsButton") {
    activeModal = norms_modal;
  }
  activeModal.style.display = "block";
  activeModal.addEventListener("click", closeModal);
}

function validateNormsInputs() {
  const normsContainer = document.querySelector(".norms-container");
  const inputs = normsContainer.querySelectorAll("input");

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const value = input.value.trim();

    if (value === "" || !Number.isInteger(Number(value))) {
      alert("Please enter numeric values for all 4 frequencies.");
      return false;
    }
  }
  return inputs;
}

saveNormsButton.addEventListener("click", saveNewNorms);

function saveNewNorms() {
  const inputs = validateNormsInputs();

  if (inputs instanceof NodeList) {
    //check if local storage object customNorms exists
    //if not, create it
    if (!localStorage.getItem("customNorms")) {
      localStorage.setItem("customNorms", JSON.stringify({}));
    }

    //create a variable with today's date as a string
    const today = new Date();
    const todayString = today.toLocaleDateString();

    const newNorms = {
      todayString: {
        five: newNorm500.value,
        one: newNorm1k.value,
        two: newNorm2k.value,
        four: newNorm4k.value,
        label: newNormLabel.value,
      },
    };
    const normsAsArray = Object.values(newNorms.todayString);
    normsAsArray.unshift(todayString);
    localStorage.setItem("shiftNorms", JSON.stringify(newNorms));
    alert("New norms saved!");
    newNorm500.value = "";
    newNorm1k.value = "";
    newNorm2k.value = "";
    newNorm4k.value = "";
    newNormLabel.value = "";
    updateNormsTable(normsAsArray);
  }
}

function updateNormsTable(values) {
  const normsContainer = document.querySelector(".norms-container");

  values.forEach((value) => {
    const item = document.createElement("div");
    item.className = "threshold-item";

    const span = document.createElement("span");
    span.textContent = value;

    item.appendChild(span);
    normsContainer.appendChild(item);
  });
  let btnContainer = document.createElement("div");
  btnContainer.className = "flex-btns";
  let btn = document.createElement("button");
  btn.textContent = "Load";
  btn.className = "btn-norms load-norms";
  btnContainer.appendChild(btn);
  btn = "";
  btn = document.createElement("button");
  btn.textContent = "Delete";
  btn.className = "btn-norms delete-norms";
  btnContainer.appendChild(btn);
  normsContainer.appendChild(btnContainer);
}
