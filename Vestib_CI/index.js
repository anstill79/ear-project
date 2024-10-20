const emptyBoxes = document.querySelectorAll(".result");
const checkedImage = new Image();
checkedImage.src = "Checked1.png";
checkedImage.classList.add("img-sizer");
const tildeImage = new Image();
tildeImage.src = "Tilde1.png";
tildeImage.classList.add("img-sizer");
const xImage = new Image();
xImage.src = "Xmark1.png";
xImage.classList.add("img-sizer");

emptyBoxes.forEach((div) => {
  div.setAttribute("data-state", "emptyBox");
  div.addEventListener("click", changeSymbol);
});

function changeSymbol() {
  let thisDiv = this;
  const currentState = this.getAttribute("data-state");
  const currentTest = this.getAttribute("data-test");
  const label = document.getElementById(currentTest);
  const targetImg = this.querySelector("img");
  const targetAnimation = this.querySelector("sl-animation");
  if (targetImg) {
    thisDiv.removeChild(targetAnimation);
  }
  let newImg;
  let newAnimation = document.createElement("sl-animation");
  const attributes = {
    name: "fadeIn",
    duration: "1000",
    iterations: "1",
    play: "",
  };
  for (const [key, value] of Object.entries(attributes)) {
    newAnimation.setAttribute(key, value);
  }

  switch (currentState) {
    case "emptyBox":
      newImg = checkedImage.cloneNode();
      newAnimation.appendChild(newImg);
      thisDiv.appendChild(newAnimation);
      thisDiv.setAttribute("data-state", "checkedImage");
      label.classList.remove("DNT");
      thisDiv.classList.remove("DNT-box");
      break;
    case "checkedImage":
      newImg = tildeImage.cloneNode();
      newAnimation.appendChild(newImg);
      thisDiv.appendChild(newAnimation);
      thisDiv.setAttribute("data-state", "tildeImage");
      label.classList.remove("DNT");
      thisDiv.classList.remove("DNT-box");
      break;
    case "tildeImage":
      newImg = xImage.cloneNode();
      newAnimation.appendChild(newImg);
      thisDiv.appendChild(newAnimation);
      thisDiv.setAttribute("data-state", "xImage");
      label.classList.remove("DNT");
      thisDiv.classList.remove("DNT-box");
      break;
    case "xImage":
      thisDiv.setAttribute("data-state", "emptyBox");
      const string = `[data-test="${currentTest}"]`;
      const sameTest = document.querySelectorAll(string);
      let sameTestState = [];
      sameTest.forEach((item, index) => {
        sameTestState[index] = item.getAttribute("data-state");
      });
      if (
        (sameTestState[0] === "emptyBox" && sameTestState[1] === "emptyBox") ||
        (sameTestState.length === 1 && sameTestState[0] === "emptyBox")
      ) {
        label.classList.add("DNT");
      }
      thisDiv.classList.add("DNT-box");
      break;
  }
  showCriteria2();
}

function setKeyImages() {
  const keyX = document.getElementById("keyX");
  const keyTilde = document.getElementById("keyTilde");
  const keyChecked = document.getElementById("keyChecked");
  keyX.src = xImage.src;
  keyTilde.src = tildeImage.src;
  keyChecked.src = checkedImage.src;
}
setKeyImages();

function showCriteria() {
  const results = document.querySelectorAll(".test-label:not(.DNT");
  results.forEach((result) => {
    if (result.id === "vHIT_label") {
      key_checked_vHIT.style.display = "block";
      key_tilde_vHIT.style.display = "block";
      key_X_vHIT.style.display = "block";
    }
    if (result.id === "caloric_label") {
      key_checked_caloric.style.display = "block";
      key_tilde_caloric.style.display = "block";
      key_X_caloric.style.display = "block";
    }
    if (result.id === "step_label") {
      key_checked_step.style.display = "block";
      key_tilde_step.style.display = "block";
      key_X_step.style.display = "block";
    }
    if (result.id === "sha_label") {
      key_checked_SHA.style.display = "block";
      key_tilde_SHA.style.display = "block";
      key_X_SHA.style.display = "block";
    }
    if (result.id === "vemp_label") {
      key_checked_VEMP.style.display = "block";
      key_tilde_VEMP.style.display = "block";
      key_X_VEMP.style.display = "block";
    }
  });
}

function showCriteria2() {
  const results = document.querySelectorAll(".test-label:not(.DNT)");
  const criteriaMap = {
    vHIT_label: ["key_checked_vHIT", "key_tilde_vHIT", "key_X_vHIT"],
    caloric_label: [
      "key_checked_caloric",
      "key_tilde_caloric",
      "key_X_caloric",
    ],
    step_label: ["key_checked_step", "key_tilde_step", "key_X_step"],
    sha_label: ["key_checked_SHA", "key_tilde_SHA", "key_X_SHA"],
    vemp_label: ["key_checked_VEMP", "key_tilde_VEMP", "key_X_VEMP"],
  };

  // First, set all elements to "none"
  Object.values(criteriaMap)
    .flat()
    .forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.style.display = "none";
      }
    });

  // Then, set to "block" only for present IDs
  results.forEach((result) => {
    const elementsToShow = criteriaMap[result.id];
    if (elementsToShow) {
      elementsToShow.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          element.style.display = "block";
        }
      });
    }
  });
}
