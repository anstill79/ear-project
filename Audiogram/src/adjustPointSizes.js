import {
  audiogramData,
  BC_R,
  BC_L,
  BC_R_M,
  BC_L_M,
  R_NR,
  L_NR,
} from "./dataAndImages.js";

import { updateCharts, options_R, options_L } from "./audiogram.js";

export let acPointSize = 10;
export let bcPointSize = 10;

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
  R_NR.height = BCpointSizeMap[desiredPointSize][0];
  R_NR.width = BCpointSizeMap[desiredPointSize][0];
  L_NR.height = BCpointSizeMap[desiredPointSize][0];
  L_NR.width = BCpointSizeMap[desiredPointSize][0];
  updateCharts();
}
