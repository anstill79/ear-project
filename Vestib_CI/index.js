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
const asterisk = new Image();
asterisk.src = "Asterisk.png";

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

  // Remove existing image if present
  if (targetImg) {
    targetImg.remove();
  }

  let newImg;

  // Remove all state classes first
  thisDiv.classList.remove("good", "mild", "severe", "DNT-box");

  switch (currentState) {
    case "emptyBox":
      newImg = checkedImage.cloneNode();
      newImg.classList.add("fade-in");
      thisDiv.appendChild(newImg);
      thisDiv.setAttribute("data-state", "checkedImage");
      label.classList.remove("DNT");
      thisDiv.classList.add("good");
      break;

    case "checkedImage":
      newImg = tildeImage.cloneNode();
      newImg.classList.add("fade-in");
      thisDiv.appendChild(newImg);
      thisDiv.setAttribute("data-state", "tildeImage");
      label.classList.remove("DNT");
      thisDiv.classList.add("mild");
      break;

    case "tildeImage":
      newImg = xImage.cloneNode();
      newImg.classList.add("fade-in");
      thisDiv.appendChild(newImg);
      thisDiv.setAttribute("data-state", "xImage");
      label.classList.remove("DNT");
      thisDiv.classList.add("severe");
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
  const keyAsterisk = document.getElementById("keyAsterisk");
  keyX.src = xImage.src;
  keyTilde.src = tildeImage.src;
  keyChecked.src = checkedImage.src;
  keyAsterisk.src = asterisk.src;
  keyAsterisk.classList.remove("key-symbol");
  keyAsterisk.style.width = "50px";
  keyAsterisk.style.height = "50px";
  keyAsterisk.style.margin = "-11px";
}
setKeyImages();

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
