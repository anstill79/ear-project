const ctx = document.getElementById("salChart").getContext("2d");

// Clinical Visual Parameters
const bcOffset = 12;
const acOffset = 20;
const pathOffset = 35;
let hoveredData = null;

const salPlugin = {
  id: "salPlugin",
  afterDatasetsDraw(chart) {
    const {
      ctx,
      scales: { x, y },
    } = chart;
    ctx.save();
    ctx.lineWidth = 2;

    chart.data.datasets.forEach((dataset) => {
      const isRight = dataset.label.includes("Right");
      const sign = isRight ? -1 : 1;

      dataset.data.forEach((point) => {
        const xCenter = x.getPixelForValue(point.x);
        const yPos = y.getPixelForValue(point.y);
        ctx.strokeStyle = dataset.borderColor;

        if (dataset.isAC) {
          const xSym = xCenter + acOffset * sign;
          const xPath = xCenter + pathOffset * sign;

          ctx.beginPath();
          if (isRight) {
            ctx.arc(xSym, yPos, 5, 0, Math.PI * 2);
          } else {
            const s = 6;
            ctx.moveTo(xSym - s, yPos - s);
            ctx.lineTo(xSym + s, yPos + s);
            ctx.moveTo(xSym + s, yPos - s);
            ctx.lineTo(xSym - s, yPos + s);
          }
          ctx.stroke();

          if (point.pairedY !== null) {
            const yPaired = y.getPixelForValue(point.pairedY);
            ctx.beginPath();
            ctx.moveTo(xSym, yPos);
            ctx.lineTo(xPath, yPos);
            ctx.lineTo(xPath, yPaired);
            ctx.lineTo(xSym, yPaired);
            ctx.stroke();
          }
        }

        if (dataset.isBC) {
          const xBC = xCenter + bcOffset * sign;
          const s = 8;
          ctx.beginPath();
          if (isRight) {
            ctx.moveTo(xBC + s, yPos - s);
            ctx.lineTo(xBC, yPos - s);
            ctx.lineTo(xBC, yPos + s);
            ctx.lineTo(xBC + s, yPos + s);
          } else {
            ctx.moveTo(xBC - s, yPos - s);
            ctx.lineTo(xBC, yPos - s);
            ctx.lineTo(xBC, yPos + s);
            ctx.lineTo(xBC - s, yPos + s);
          }
          ctx.stroke();
        }
      });
    });
    ctx.restore();
  },
};

const hoverHighlightPlugin = {
  id: "hoverHighlight",
  afterDraw(chart) {
    if (!hoveredData) return;
    const {
      ctx,
      scales: { x, y },
      chartArea: { left, right },
    } = chart;
    const snappedY = Math.round(hoveredData.y / 5) * 5;
    const yPixel = y.getPixelForValue(snappedY);

    ctx.save();
    const color = hoveredData.color;
    ctx.fillStyle = color.replace("rgb", "rgba").replace(")", ", 0.08)");
    ctx.fillRect(left, yPixel - 8, right - left, 16);
    ctx.strokeStyle = color;
    ctx.setLineDash([6, 3]);
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(left, yPixel);
    ctx.lineTo(right, yPixel);
    ctx.stroke();
    ctx.restore();
  },
};

const chart = new Chart(ctx, {
  type: "scatter",
  data: {
    datasets: [
      {
        label: "Right AC",
        data: [],
        borderColor: "rgb(231, 76, 60)",
        isAC: true,
        pointRadius: 0,
        pointHitRadius: 15,
        pointHoverRadius: 0,
        showLine: false,
      },
      {
        label: "Right BC",
        data: [],
        borderColor: "rgb(231, 76, 60)",
        isBC: true,
        pointRadius: 0,
        pointHitRadius: 15,
        pointHoverRadius: 0,
        showLine: false,
      },
      {
        label: "Left AC",
        data: [],
        borderColor: "rgb(52, 152, 219)",
        isAC: true,
        pointRadius: 0,
        pointHitRadius: 15,
        pointHoverRadius: 0,
        showLine: false,
      },
      {
        label: "Left BC",
        data: [],
        borderColor: "rgb(52, 152, 219)",
        isBC: true,
        pointRadius: 0,
        pointHitRadius: 15,
        pointHoverRadius: 0,
        showLine: false,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    interaction: { mode: "nearest", intersect: false },
    onHover: (event, elements) => {
      if (elements.length > 0) {
        const el = elements[0];
        const ds = chart.data.datasets[el.datasetIndex];
        if (ds.isBC) {
          hoveredData = { y: ds.data[el.index].y, color: ds.borderColor };
          chart.render();
          return;
        }
      }
      if (hoveredData) {
        hoveredData = null;
        chart.render();
      }
    },
    scales: {
      x: {
        type: "category",
        labels: ["500", "750", "1kHz", "1500", "2kHz", "3000", "4kHz"],
        grid: {
          color: (c) =>
            ["500", "1kHz", "2kHz", "4kHz"].includes(c.tick.label)
              ? "#350909"
              : "#f2f2f2",
        },
        ticks: {
          callback: function (v) {
            const lbl = this.getLabelForValue(v);
            const active = ["500", "1kHz", "2kHz", "4kHz"];
            return active.includes(lbl) ? lbl : null;
          },
          padding: 10,
        },
        offset: true,
      },
      y: {
        reverse: true,
        min: -10,
        max: 120,
        ticks: { stepSize: 10 },
        grid: { color: (c) => (c.tick.value === 0 ? "#000" : "#e9ecef") },
      },
    },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
  },
  plugins: [salPlugin, hoverHighlightPlugin],
});

function updateChart() {
  const ears = ["r", "l"];
  const freqs = ["500", "1kHz", "2kHz", "4kHz"];
  let d = { rAC: [], rBC: [], lAC: [], lBC: [] };

  ears.forEach((ear) => {
    freqs.forEach((f) => {
      const acIn = document.getElementById(`ac${ear}${f}`);
      const macIn = document.getElementById(`mac${ear}${f}`);
      const ac = parseFloat(acIn.value);
      const mac = parseFloat(macIn.value);
      const norm =
        parseFloat(document.getElementById(`n${ear}${f}`).value) || 0;

      if (!isNaN(ac) && !isNaN(mac) && mac < ac)
        macIn.classList.add("input-error");
      else macIn.classList.remove("input-error");

      if (!isNaN(ac) && !isNaN(mac)) {
        const estBC = norm - (mac - ac);
        document.getElementById(`res${ear}${f}`).innerText = estBC + " dB";
        const points = [
          { x: f, y: ac, pairedY: mac },
          { x: f, y: mac, pairedY: null },
        ];
        if (ear === "r") {
          d.rAC.push(...points);
          d.rBC.push({ x: f, y: estBC });
        } else {
          d.lAC.push(...points);
          d.lBC.push({ x: f, y: estBC });
        }
      } else {
        document.getElementById(`res${ear}${f}`).innerText = "-";
      }
    });
  });
  chart.data.datasets[0].data = d.rAC;
  chart.data.datasets[1].data = d.rBC;
  chart.data.datasets[2].data = d.lAC;
  chart.data.datasets[3].data = d.lBC;
  chart.update();
}
