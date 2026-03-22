import {
  audiogramData,
  BC_R,
  BC_L,
  BC_R_M,
  BC_L_M,
  R_NR,
  L_NR,
  AidedSymbol_R,
  AidedSymbol_L,
  AidedNR_Symbol_R,
  AidedNR_Symbol_L,
  drawNRArrow,
} from "./dataAndImages.js";

import { updateCharts, options_R, options_L } from "./audiogram.js";

export let acPointSize = 10;
export let bcPointSize = 10;
export let aidedPointSize = 10;

export function adjustAllACpointSizes() {
  let desiredPointSize = ac_point_size_slider.value;
  if (!desiredPointSize) {
    return;
  }
  const ACpointSizeMap = {
    "-2": 4,
    "-1": 8,
    0: 10,
    1: 12,
    2: 15,
  };

  acPointSize = ACpointSizeMap[desiredPointSize];

  audiogramData.pointSize_AC_R = audiogramData.pointSize_AC_R.map((size) => {
    if (size > 0) {
      return ACpointSizeMap[desiredPointSize];
    }
    return size;
  });
  audiogramData.pointSize_AC_L = audiogramData.pointSize_AC_L.map((size) => {
    if (size > 0) {
      return ACpointSizeMap[desiredPointSize];
    }
    return size;
  });
  audiogramData.pointSize_hover_AC_R = audiogramData.pointSize_hover_AC_R.map(
    (size) => {
      if (size > 0) {
        return ACpointSizeMap[desiredPointSize];
      }
      return size;
    }
  );
  audiogramData.pointSize_hover_AC_L = audiogramData.pointSize_hover_AC_L.map(
    (size) => {
      if (size > 0) {
        return ACpointSizeMap[desiredPointSize];
      }
      return size;
    }
  );
  audiogramData.pointSize_NR_BC_R = audiogramData.pointSize_NR_BC_R.map(
    (size) => {
      if (size > 0) {
        return ACpointSizeMap[desiredPointSize];
      }
      return size;
    }
  );
  audiogramData.pointSize_NR_BC_L = audiogramData.pointSize_NR_BC_L.map(
    (size) => {
      if (size > 0) {
        return ACpointSizeMap[desiredPointSize];
      }
      return size;
    }
  );
  audiogramData.pointSize_NR_R = audiogramData.pointSize_NR_R.map((size) => {
    if (size > 0) {
      return ACpointSizeMap[desiredPointSize];
    }
    return size;
  });
  audiogramData.pointSize_NR_L = audiogramData.pointSize_NR_L.map((size) => {
    if (size > 0) {
      return ACpointSizeMap[desiredPointSize];
    }
    return size;
  });

  options_R.data.datasets[0].pointRadius = audiogramData.pointSize_AC_R;
  //bc point sizes, set directly since there is no pointSize_BC_R in audiogramData
  const rBCradius = options_R.data.datasets[1].pointRadius;
  options_R.data.datasets[1].pointRadius = rBCradius.map((size) => {
    if (size > 0) {
      return ACpointSizeMap[desiredPointSize];
    }
    return size;
  });
  options_R.data.datasets[3].pointRadius = audiogramData.pointSize_NR_R;

  options_L.data.datasets[0].pointRadius = audiogramData.pointSize_AC_L;
  const lBCradius = options_L.data.datasets[1].pointRadius;
  options_L.data.datasets[1].pointRadius = lBCradius.map((size) => {
    if (size > 0) {
      return ACpointSizeMap[desiredPointSize];
    }
    return size;
  });
  options_L.data.datasets[3].pointRadius = audiogramData.pointSize_NR_L;

  options_R.data.datasets[0].pointHoverRadius =
    audiogramData.pointSize_hover_AC_R;
  options_L.data.datasets[0].pointHoverRadius =
    audiogramData.pointSize_hover_AC_L;

  updateCharts();
}

export function adjustAllBCpointSizes() {
  let desiredPointSize = bc_point_size_slider.value;
  if (!desiredPointSize) {
    return;
  }
  const BCpointSizeMap = {
    "-2": [30, 10],
    "-1": [35, 15],
    0: [40, 20],
    1: [45, 25],
    2: [50, 30],
  };

  bcPointSize = BCpointSizeMap[desiredPointSize];

  BC_R.height = BCpointSizeMap[desiredPointSize][0];
  BC_R.width = BCpointSizeMap[desiredPointSize][1];
  BC_L.height = BCpointSizeMap[desiredPointSize][0];
  BC_L.width = BCpointSizeMap[desiredPointSize][1];
  BC_R_M.height = BCpointSizeMap[desiredPointSize][0];
  BC_R_M.width = BCpointSizeMap[desiredPointSize][1];
  BC_L_M.height = BCpointSizeMap[desiredPointSize][0];
  BC_L_M.width = BCpointSizeMap[desiredPointSize][1];
  drawNRArrow(R_NR, "SW", "rgb(255, 0, 0)", BCpointSizeMap[desiredPointSize][0]);
  drawNRArrow(L_NR, "SE", "rgb(0, 0, 255)", BCpointSizeMap[desiredPointSize][0]);
  updateCharts();
}

export function adjustAllAidedPointSizes() {
  let desiredPointSize = aided_point_size_slider.value;
  if (!desiredPointSize && desiredPointSize !== "0") {
    return;
  }
  const AidedSizeMap = {
    "-2": { canvas: 14, font: 10 },
    "-1": { canvas: 17, font: 12 },
    0: { canvas: 20, font: 14 },
    1: { canvas: 24, font: 17 },
    2: { canvas: 28, font: 20 },
  };

  const { canvas: canvasSize, font: fontSize } = AidedSizeMap[desiredPointSize];

  AidedSymbol_R.width = canvasSize;
  AidedSymbol_R.height = canvasSize;
  const ctxR = AidedSymbol_R.getContext("2d");
  ctxR.font = `bold ${fontSize}px Rubik, sans-serif`;
  ctxR.fillStyle = "rgb(255, 0, 0)";
  ctxR.textAlign = "center";
  ctxR.textBaseline = "middle";
  ctxR.fillText("A", canvasSize / 2, canvasSize / 2);

  AidedSymbol_L.width = canvasSize;
  AidedSymbol_L.height = canvasSize;
  const ctxL = AidedSymbol_L.getContext("2d");
  ctxL.font = `bold ${fontSize}px Rubik, sans-serif`;
  ctxL.fillStyle = "rgb(0, 0, 255)";
  ctxL.textAlign = "center";
  ctxL.textBaseline = "middle";
  ctxL.fillText("A", canvasSize / 2, canvasSize / 2);

  AidedNR_Symbol_R.width = canvasSize;
  AidedNR_Symbol_R.height = canvasSize;
  const ctxNR_R = AidedNR_Symbol_R.getContext("2d");
  ctxNR_R.globalAlpha = 0.35;
  ctxNR_R.font = `bold ${fontSize}px Rubik, sans-serif`;
  ctxNR_R.fillStyle = "rgb(255, 0, 0)";
  ctxNR_R.textAlign = "center";
  ctxNR_R.textBaseline = "middle";
  ctxNR_R.fillText("A", canvasSize / 2, canvasSize / 2);

  AidedNR_Symbol_L.width = canvasSize;
  AidedNR_Symbol_L.height = canvasSize;
  const ctxNR_L = AidedNR_Symbol_L.getContext("2d");
  ctxNR_L.globalAlpha = 0.35;
  ctxNR_L.font = `bold ${fontSize}px Rubik, sans-serif`;
  ctxNR_L.fillStyle = "rgb(0, 0, 255)";
  ctxNR_L.textAlign = "center";
  ctxNR_L.textBaseline = "middle";
  ctxNR_L.fillText("A", canvasSize / 2, canvasSize / 2);

  updateCharts();
}
