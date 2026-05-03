// TODO: style date picker better
// add a textarea for comments
// add very simple markup freehand, circle,line,  arrow, and square and *
// rename contain cover something simpler
// combine images, overlay
// remove help text at top now
// helpp btn popover target

const imageRows = document.getElementById("imageRows");
const fileInput = document.getElementById("fileInput");
let activeSlot = null;
let selectedSlot = null;

// Set today's date
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");
document.getElementById("sheetDate").value = `${yyyy}-${mm}-${dd}`;

// Build 2 rows × 2 columns
for (let row = 0; row < 2; row++) {
  const rowEl = document.createElement("div");
  rowEl.className = "image-row";

  ["right", "left"].forEach((ear) => {
    const cell = createCell(ear, row + 1);
    rowEl.appendChild(cell);
  });

  imageRows.appendChild(rowEl);
}

function createCell(ear, rowNum) {
  const cell = document.createElement("div");
  cell.className = "cell";

  // Slot
  const slot = document.createElement("div");
  slot.className = `slot ear-${ear}`;

  const label = document.createElement("div");
  label.className = "slot-label";
  label.innerHTML = `
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
      <span>${ear} ${rowNum}</span>
    `;

  const removeBtn = document.createElement("button");
  removeBtn.className = "slot-remove";
  removeBtn.textContent = "×";
  removeBtn.title = "Remove image";
  removeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    clearSlot(slot);
  });

  const fitBtn = document.createElement("button");
  fitBtn.className = "fit-toggle";
  fitBtn.textContent = "contain";
  fitBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    fitBtn.textContent = slot.classList.toggle("cover") ? "cover" : "contain";
  });

  const pasteHint = document.createElement("div");
  pasteHint.className = "paste-hint";
  pasteHint.textContent = "Ctrl+V to paste / double-click to open";

  slot.append(label, removeBtn, fitBtn, pasteHint);

  slot.addEventListener("click", (e) => {
    if (e.target === removeBtn || e.target === fitBtn) return;
    selectSlot(slot);
  });

  slot.addEventListener("dragover", (e) => {
    e.preventDefault();
    slot.classList.add("dragover");
  });
  slot.addEventListener("dragleave", () => slot.classList.remove("dragover"));
  slot.addEventListener("drop", (e) => {
    e.preventDefault();
    slot.classList.remove("dragover");
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) loadImageFile(file, slot);
  });

  // Caption
  const captionWrap = document.createElement("div");
  captionWrap.className = "caption-wrap";

  const caption = document.createElement("input");
  caption.type = "text";
  caption.className = `caption ear-${ear}`;
  caption.placeholder =
    ear === "right" ? `Right ear label ${rowNum}` : `Left ear label ${rowNum}`;
  caption.maxLength = 120;
  caption.setAttribute("list", "test-label-options");
  caption.addEventListener("click", (e) => e.stopPropagation());

  captionWrap.appendChild(caption);
  cell.append(slot, captionWrap);
  return cell;
}

/* ── Selection ── */
function selectSlot(slot) {
  if (selectedSlot && selectedSlot !== slot)
    selectedSlot.classList.remove("selected");
  if (selectedSlot === slot) {
    if (!slot.classList.contains("has-image")) {
      activeSlot = slot;
      fileInput.value = "";
      fileInput.click();
    }
    return;
  }
  slot.classList.add("selected");
  selectedSlot = slot;
}

document.addEventListener("click", (e) => {
  if (
    !e.target.closest(".slot") &&
    !e.target.closest(".caption") &&
    !e.target.closest(".sheet-header") &&
    selectedSlot
  ) {
    selectedSlot.classList.remove("selected");
    selectedSlot = null;
  }
});

/* ── File input ── */
fileInput.addEventListener("change", () => {
  if (fileInput.files[0] && activeSlot) {
    loadImageFile(fileInput.files[0], activeSlot);
    activeSlot = null;
  }
});

/* ── Image loading ── */
function loadImageFile(file, slot) {
  const reader = new FileReader();
  reader.onload = (e) => setSlotImage(slot, e.target.result);
  reader.readAsDataURL(file);
}

function setSlotImage(slot, src) {
  slot.querySelector("img")?.remove();
  const img = document.createElement("img");
  img.src = src;
  slot.insertBefore(img, slot.firstChild);
  slot.classList.add("has-image");
  slot.classList.remove("selected");
  if (selectedSlot === slot) selectedSlot = null;
}

function clearSlot(slot) {
  slot.querySelector("img")?.remove();
  slot.classList.remove("has-image", "cover", "selected");
  if (selectedSlot === slot) selectedSlot = null;
  const fitBtn = slot.querySelector(".fit-toggle");
  if (fitBtn) fitBtn.textContent = "contain";
}

function clearAll() {
  confirm("Are you sure you want to clear all images?") &&
    document.querySelectorAll(".slot").forEach(clearSlot);
  document.querySelectorAll(".caption").forEach((c) => (c.value = ""));
}

/* ── Paste ── */
document.addEventListener("paste", (e) => {
  if (!selectedSlot) return;
  let imageItem = null;
  for (const item of e.clipboardData.items) {
    if (item.type.startsWith("image/")) {
      imageItem = item;
      break;
    }
  }
  if (!imageItem) return;
  loadImageFile(imageItem.getAsFile(), selectedSlot);
});

function printPreview(onOff) {
  if (onOff === "on") {
    const nav = document.querySelector(".ui-bar");
    nav.style.display = "none";
    const previewBtn = document.querySelector(".btn-exit-preview");
    previewBtn.style.display = "block";
  } else {
    const nav = document.querySelector(".ui-bar");
    nav.style.display = "flex";
    const previewBtn = document.querySelector(".btn-exit-preview");
    previewBtn.style.display = "none";
  }
}
