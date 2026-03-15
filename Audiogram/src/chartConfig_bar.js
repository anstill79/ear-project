import { audiogramData } from "./dataAndImages.js";

export const lilHz = ["", 250, "", 500, "", 1000, "", 2000, "", 4000, "", 8000];

export const barColors_R = [
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
];
export const barColors_L = [
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(255, 0, 0, 0.2)",
];

export const options_bar_R = {
  type: "bar",
  data: {
    labels: lilHz,
    datasets: [
      {
        label: "R Change",
        data: audiogramData.changeDetails.change_R,
        borderWidth: 0.5,
        backgroundColor: barColors_R,
        borderColor: "gray",
      },
    ],
  },
  plugins: [ChartDataLabels],
  options: {
    animation: {
      delay: 50,
      duration: 1000,
      easing: "easeOutSine",
    },
    layout: {
      padding: {
        right: 4,
        left: 3,
      },
    },
    responsive: false,
    plugins: {
      datalabels: {
        color: "red",
        formatter: function (value, context) {
          if (value === null) return "";
          var direction = context.dataset.data[context.dataIndex];
          if (direction > 0) return "▲\n" + Math.abs(value);
          if (direction < 0) return Math.abs(value) + "\n▼";
          return "=";
        },
        align: function (context) {
          var val = context.dataset.data[context.dataIndex];
          return val > 0 ? "end" : val < 0 ? "start" : "center";
        },
        padding: 4,
      },
      crosshair: {
        line: {
          width: 1,
          color: "red",
        },
        zoom: {
          enabled: false,
        },
        snap: {
          enabled: false,
        },
      },
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      annotation: {
        annotations: {
          line0: {
            type: "line",
            yMin: 0,
            yMax: 0,
            borderColor: "rgb(0, 0, 0)",
            borderWidth: 1,
          },
          line1: {
            type: "line",
            yMin: 10,
            yMax: 10,
            borderColor: "rgba(0, 0, 0, 0.5)",
            borderWidth: 1,
            borderDash: [3, 3],
          },
          line2: {
            type: "line",
            yMin: -10,
            yMax: -10,
            borderColor: "rgba(0, 0, 0, 0.5)",
            borderWidth: 1,
            borderDash: [3, 3],
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
        },
        ticks: {
          maxRotation: 0,
          autoSkip: false,
          color: "rgb(255, 0, 0)",
        },
      },
      y: {
        display: false,
        min: -60,
        max: 60,
        ticks: {
          stepSize: 10,
        },
        reverse: false,
      },
    },
  },
};

export const options_bar_L = {
  type: "bar",
  data: {
    labels: lilHz,
    datasets: [
      {
        label: "L Change",
        data: audiogramData.changeDetails.change_L,
        borderWidth: 0.2,
        backgroundColor: barColors_L,
        borderColor: "gray",
      },
    ],
  },
  plugins: [ChartDataLabels],
  options: {
    animation: {
      delay: 50,
      duration: 1000,
      easing: "easeOutSine",
    },
    layout: {
      padding: {
        right: 13,
      },
    },
    responsive: false,
    plugins: {
      datalabels: {
        color: "blue",
        formatter: function (value, context) {
          if (value === null) return "";
          var direction = context.dataset.data[context.dataIndex];
          if (direction > 0) return "▲\n" + Math.abs(value);
          if (direction < 0) return Math.abs(value) + "\n▼";
          return "=";
        },
        align: function (context) {
          var val = context.dataset.data[context.dataIndex];
          return val > 0 ? "end" : val < 0 ? "start" : "center";
        },
        padding: 4,
      },
      crosshair: {
        line: {
          width: 1,
          color: "blue",
        },
        zoom: {
          enabled: false,
        },
        snap: {
          enabled: false,
        },
      },
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: "Change L",
      },
      annotation: {
        annotations: {
          line0: {
            type: "line",
            yMin: 0,
            yMax: 0,
            borderColor: "rgb(0, 0, 0)",
            borderWidth: 1,
          },
          line1: {
            type: "line",
            yMin: 10,
            yMax: 10,
            borderColor: "rgba(0, 0, 0,0.5)",
            borderWidth: 1,
            borderDash: [3, 3],
          },
          line2: {
            type: "line",
            yMin: -10,
            yMax: -10,
            borderColor: "rgb(0, 0, 0,0.5)",
            borderWidth: 1,
            borderDash: [3, 3],
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
        },
        ticks: {
          maxRotation: 0,
          autoSkip: false,
          color: "rgb(0, 0, 255)",
        },
      },
      y: {
        display: false,
        min: -60,
        max: 60,
        ticks: {
          stepSize: 10,
        },
        reverse: false,
      },
    },
  },
};
