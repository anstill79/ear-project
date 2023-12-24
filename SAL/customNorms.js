
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

export function saveNewNorms() {
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
    item.className = "threshold-item sm-text";

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