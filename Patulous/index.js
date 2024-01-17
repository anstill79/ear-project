// Import stylesheets
import './style.css';

async function insertImage(event) {
  const imageDiv = document.getElementById(event.target.closest('div').id);
  const clipboardItems = await navigator.clipboard.read();
  const paste = clipboardItems[0];
  if (this.innerText === 'Insert') {
    this.innerText = 'Delete';
    const img = new Image();
    img.classList.add('constrain-image');
    if (paste) {
      for (const type of paste.types) {
        if (type.startsWith('image/')) {
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
    imageDiv.innerHTML = '';
    const singleInsertBtn = document.createElement('button');
    singleInsertBtn.classList.add('no-print', 'control-btns');
    singleInsertBtn.addEventListener('click', insertImage);
    singleInsertBtn.innerText = 'Insert';
    imageDiv.appendChild(singleInsertBtn);
  }
}

const insertBtns = document.querySelectorAll('button');

insertBtns.forEach((btn) => {
  btn.addEventListener('click', insertImage);
});
