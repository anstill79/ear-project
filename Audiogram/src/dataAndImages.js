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

// Every per-frequency array has one entry per x slot: the 12 standard slots
// (125 Hz to 8 kHz, see FREQUENCIES in audiogram.js), then the extended high
// frequencies 10, 12.5 and 16 kHz, which are air conduction only.
export const N_STANDARD = 12;
export const N_FREQ = 15;
const nulls = () => Array(N_FREQ).fill(null);

export const audiogramData = {
  changeDetails: {
    prevTestDate: "",
    changePTA_R: [null],
    changePTA_L: [null],
    changeResolution_R: "full",
    changeResolution_L: "full",
    LMH_R: [null, null, null],
    LMH_L: [null, null, null],
    change_R: nulls(),
    change_L: nulls(),
  },
  PTA_R: null,
  PTA_L: null,
  SRT_R: [null],
  SRT_L: [null],
  thresh_AC_R: nulls(),
  thresh_AC_L: nulls(),
  thresh_BC_R: nulls(),
  thresh_BC_L: nulls(),
  thresh_NR_R: nulls(),
  thresh_NR_L: nulls(),
  thresh_NR_BC_R: nulls(),
  thresh_NR_BC_L: nulls(),
  thresh_Aided_R: nulls(),
  thresh_Aided_L: nulls(),
  thresh_NR_Aided_R: nulls(),
  thresh_NR_Aided_L: nulls(),
  interOctTested_AC_R: [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
  interOctTested_AC_L: [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
  interOctTested_Aided_R: [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
  interOctTested_Aided_L: [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
  pointSize_AC_R: [10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  pointSize_AC_L: [10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  pointSize_hover_AC_R: [0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 10, 10, 10],
  pointSize_hover_AC_L: [0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 10, 10, 10],
  pointSize_NR_R: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_L: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_BC_R: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_BC_L: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_Aided_R: [10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  pointSize_Aided_L: [10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  pointSize_NR_Aided_R: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_Aided_L: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  symbols_BC_R: Array(N_FREQ).fill(BC_R),
  symbols_BC_L: Array(N_FREQ).fill(BC_L),
  symbols_R: Array(N_FREQ).fill("circle"),
  symbols_L: Array(N_FREQ).fill("crossRot"),
  symbols_Aided_R: Array(N_FREQ).fill(AidedSymbol_R),
  symbols_Aided_L: Array(N_FREQ).fill(AidedSymbol_L),
  symbols_NR_Aided_R: Array(N_FREQ).fill(AidedNR_Symbol_R),
  symbols_NR_Aided_L: Array(N_FREQ).fill(AidedNR_Symbol_L),
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
  thresh_AC_R: [null, 20, null, 35, 35, 40, 45, 55, 55, 60, 70, 80, null, null, null],
  thresh_AC_L: [null, 40, null, 45, null, 55, null, 65, 70, 75, 60, 90, null, null, null],
  thresh_BC_R: nulls(),
  thresh_BC_L: nulls(),
  thresh_NR_R: nulls(),
  thresh_NR_L: nulls(),
  thresh_NR_BC_R: nulls(),
  thresh_NR_BC_L: nulls(),
  interOctTested_AC_R: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  interOctTested_AC_L: [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  pointSize_AC_R: [10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  pointSize_AC_L: [10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  pointSize_NR_R: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_L: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_BC_R: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_BC_L: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  maskAll_AC_R_L_BC_R_L: [0, 0, 0, 0],
  DateOfTest: "6/1/2021",
};
