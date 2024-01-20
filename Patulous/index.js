async function insertImage(event) {
  const imageDiv = document.getElementById(event.target.closest("div").id);
  if (this.innerText === "Insert") {
    const clipboardItems = await navigator.clipboard.read();
    const paste = clipboardItems[0];
    this.innerText = "Delete";
    const img = new Image();
    img.classList.add("constrain-image");
    if (paste) {
      for (const type of paste.types) {
        if (type.startsWith("image/")) {
          const blob = await paste.getType(type);
          const reader = new FileReader();
          reader.onload = function (evt) {
            img.src = evt.target.result;
            imageDiv.appendChild(img);
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  } else {
    //get ref to image and remove it
    const img = imageDiv.querySelector("img");
    img.remove();
    this.innerText = "Insert";
  }
}

function zoomImage(event) {
  const graphItemsDiv = event.target.closest(".graph-items");
  const img = graphItemsDiv.querySelector("img");
  let scale = img.style.getPropertyValue("transform");
  if (!scale) {
    scale = 1;
  } else {
    scale = scale.replace("scale(", "").replace(")", "");
  }
  if (event.target.innerText === "+") {
    scale = `${parseFloat(scale) + 0.1}`;
    //console.log(scale);
  } else {
    scale = `${parseFloat(scale) - 0.1}`;
  }
  img.style.transform = `scale(${scale})`;
  //img.style.zIndex = "-5";
}

const insertBtns = document.querySelectorAll(".control-btns");

insertBtns.forEach((btn) => {
  btn.addEventListener("click", insertImage);
});

const zoomBtns = document.querySelectorAll(".zoom-btns");

zoomBtns.forEach((btn) => {
  btn.addEventListener("click", zoomImage);
});
