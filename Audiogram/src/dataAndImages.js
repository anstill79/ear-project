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
export const R_NR = new Image();
R_NR.src = "src/R_NR.png";
R_NR.width = 40;
R_NR.height = 40;
export const L_NR = new Image();
L_NR.src = "src/L_NR.png";
L_NR.width = 40;
L_NR.height = 40;

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
  interOctTested_AC_R: [
    null,
    null,
    0,
    null,
    0,
    null,
    0,
    null,
    0,
    null,
    0,
    null,
  ],
  interOctTested_AC_L: [
    null,
    null,
    0,
    null,
    0,
    null,
    0,
    null,
    0,
    null,
    0,
    null,
  ],
  pointSize_AC_R: [10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  pointSize_AC_L: [10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  pointSize_hover_AC_R: [0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10],
  pointSize_hover_AC_L: [0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10],
  pointSize_NR_R: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_L: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_BC_R: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_BC_L: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
  maskAll_AC_R_L_BC_R_L: [0, 0, 0, 0],
  legend: {
    ACunmasked: "hide",
    BCunmasked: "hide",
    ACmasked: "hide",
    BCmasked: "hide",
    NR: "hide",
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
  interOctTested_AC_R: [
    null,
    null,
    null,
    null,
    0,
    0,
    null,
    0,
    null,
    0,
    null,
    0,
    null,
  ],
  interOctTested_AC_L: [
    null,
    null,
    null,
    null,
    0,
    0,
    null,
    0,
    null,
    0,
    null,
    0,
    null,
  ],
  pointSize_AC_R: [10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  pointSize_AC_L: [10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  pointSize_NR_R: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_L: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_BC_R: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pointSize_NR_BC_L: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  maskAll_AC_R_L_BC_R_L: [0, 0, 0, 0],
  DateOfTest: "6/1/2021",
};
