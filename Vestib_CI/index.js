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
  if (targetImg) {
    thisDiv.removeChild(targetImg);
  }
  let newImg;
  switch (currentState) {
    case "emptyBox":
      newImg = checkedImage.cloneNode();
      thisDiv.appendChild(newImg);
      thisDiv.setAttribute("data-state", "checkedImage");
      label.classList.remove("DNT");
      thisDiv.classList.remove("DNT-box");
      break;
    case "checkedImage":
      newImg = tildeImage.cloneNode();
      thisDiv.appendChild(newImg);
      thisDiv.setAttribute("data-state", "tildeImage");
      label.classList.remove("DNT");
      thisDiv.classList.remove("DNT-box");
      break;
    case "tildeImage":
      newImg = xImage.cloneNode();
      thisDiv.appendChild(newImg);
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
