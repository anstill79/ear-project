function createAidedCanvas(color) {
  const canvas = document.createElement("canvas");
  canvas.width = 24;
  canvas.height = 24;
  const ctx = canvas.getContext("2d");
  ctx.font = "bold 17px Rubik, sans-serif";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("A", 12, 12);
  return canvas;
}
function createAidedNRCanvas(color) {
  const canvas = document.createElement("canvas");
  canvas.width = 24;
  canvas.height = 24;
  const ctx = canvas.getContext("2d");
  ctx.globalAlpha = 0.35;
  ctx.font = "bold 17px Rubik, sans-serif";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("A", 12, 12);
  return canvas;
}
export const AidedSymbol_R = createAidedCanvas("rgb(255, 0, 0)");
export const AidedSymbol_L = createAidedCanvas("rgb(0, 0, 255)");
export const AidedNR_Symbol_R = createAidedNRCanvas("rgb(255, 0, 0)");
export const AidedNR_Symbol_L = createAidedNRCanvas("rgb(0, 0, 255)");

export const BC_R = new Image();
BC_R.src = "src/BC_R.png";
BC_R.width = 40;
BC_R.height = 20;
export const BC_L = new Image();
BC_L.src = "src/BC_L.png";
BC_L.width = 40;
BC_L.height = 20;
export const BC_R_M = new Image();
BC_R_M.src = "src/BC_R_M.png";
BC_R_M.width = 40;
BC_R_M.height = 20;
export const BC_L_M = new Image();
BC_L_M.src = "src/BC_L_M.png";
BC_L_M.width = 40;
BC_L_M.height = 20;
export function drawNRArrow(canvas, direction, color, size) {
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1.5, size * 0.062);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const cx = size / 2;
  const cy = size / 2;
  const shaftLen = size * 0.325;
  const barbLen = size * 0.225;

  // tip always points downward at 45° left (SW) or right (SE)
  const tipX = direction === "SW" ? cx - shaftLen : cx + shaftLen;
  const tipY = cy + shaftLen;

  // shaft: from data point (canvas center) to arrowhead tip
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(tipX, tipY);
  ctx.stroke();

  // arrowhead barbs: one pointing North, one pointing back along x-axis
  ctx.beginPath();
  if (direction === "SW") {
    ctx.moveTo(tipX, tipY - barbLen);   // North barb
    ctx.lineTo(tipX, tipY);
    ctx.lineTo(tipX + barbLen, tipY);   // East barb
  } else {
    ctx.moveTo(tipX - barbLen, tipY);   // West barb
    ctx.lineTo(tipX, tipY);
    ctx.lineTo(tipX, tipY - barbLen);   // North barb
  }
  ctx.stroke();
}

export const R_NR = document.createElement("canvas");
export const L_NR = document.createElement("canvas");
drawNRArrow(R_NR, "SW", "rgb(255, 0, 0)", 40);
drawNRArrow(L_NR, "SE", "rgb(0, 0, 255)", 40);

export const audiogramData = {
  changeDetails: {
    prevTestDate: "",
    changePTA_R: [null],
    changePTA_L: [null],
    changeResolution_R: "full",
    changeResolution_L: "full",
    LMH_R: [null, null, null],
    LMH_L: [null, null, null],
    change_R: [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    change_L: [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
  },
  PTA_R: null,
  PTA_L: null,
  SRT_R: [null],
  SRT_L: [null],
  wordRec_R: [null],
  wordRec_L: [null],
  thresh_AC_R: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  thresh_AC_L: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  thresh_BC_R: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  thresh_BC_L: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  thresh_NR_R: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  thresh_NR_L: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  thresh_NR_BC_R: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  thresh_NR_BC_L: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  thresh_Aided_R: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  thresh_Aided_L: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  thresh_NR_Aided_R: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  thresh_NR_Aided_L: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  interOctTested_AC_R: [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  interOctTested_AC_L: [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  interOctTested_Aided_R: [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  interOctTested_Aided_L: [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  pointSize_AC_R: [10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  pointSize_AC_L: [10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  pointSize_hover_AC_R: [0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10],
  pointSize_hover_AC_L: [0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10],
  pointSize_NR_R: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_L: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_BC_R: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_BC_L: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_Aided_R: [10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  pointSize_Aided_L: [10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  pointSize_NR_Aided_R: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_Aided_L: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  symbols_BC_R: [
    BC_R,
    BC_R,
    BC_R,
    BC_R,
    BC_R,
    BC_R,
    BC_R,
    BC_R,
    BC_R,
    BC_R,
    BC_R,
    BC_R,
  ],
  symbols_BC_L: [
    BC_L,
    BC_L,
    BC_L,
    BC_L,
    BC_L,
    BC_L,
    BC_L,
    BC_L,
    BC_L,
    BC_L,
    BC_L,
    BC_L,
  ],
  symbols_R: [
    "circle",
    "circle",
    "circle",
    "circle",
    "circle",
    "circle",
    "circle",
    "circle",
    "circle",
    "circle",
    "circle",
    "circle",
  ],
  symbols_L: [
    "crossRot",
    "crossRot",
    "crossRot",
    "crossRot",
    "crossRot",
    "crossRot",
    "crossRot",
    "crossRot",
    "crossRot",
    "crossRot",
    "crossRot",
    "crossRot",
  ],
  symbols_Aided_R: Array(12).fill(AidedSymbol_R),
  symbols_Aided_L: Array(12).fill(AidedSymbol_L),
  symbols_NR_Aided_R: Array(12).fill(AidedNR_Symbol_R),
  symbols_NR_Aided_L: Array(12).fill(AidedNR_Symbol_L),
  maskAll_AC_R_L_BC_R_L: [0, 0, 0, 0],
  legend: {
    ACunmasked: "hide",
    BCunmasked: "hide",
    ACmasked: "hide",
    BCmasked: "hide",
    NR: "hide",
    Aided: "hide",
  },
};

export const oldAudiogramData = {
  thresh_AC_R: [null, 20, null, 35, 35, 40, 45, 55, 55, 60, 70, 80],
  thresh_AC_L: [null, 40, null, 45, null, 55, null, 65, 70, 75, 60, 90],
  thresh_BC_R: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  thresh_BC_L: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  thresh_NR_R: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  thresh_NR_L: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  thresh_NR_BC_R: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  thresh_NR_BC_L: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  interOctTested_AC_R: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  interOctTested_AC_L: [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
  pointSize_AC_R: [10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  pointSize_AC_L: [10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  pointSize_NR_R: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_L: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_BC_R: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_BC_L: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  maskAll_AC_R_L_BC_R_L: [0, 0, 0, 0],
  DateOfTest: "6/1/2021",
};
