const API_URL = "https://script.google.com/macros/s/AKfycbyrcy8iK-0nSS_q9aA2lsTCmee-_YF-Yv3FK656vADnf30ceKZb-ud_UlEwyjBTU0J1/exec";

let allData = {};
let charts = {};

const palette = [
  "#38bdf8",
  "#8b5cf6",
  "#22c55e",
  "#f97316",
  "#ec4899",
  "#facc15",
  "#14b8a6"
];

async function loadData() {
  const response = await fetch(API_URL);
  allData = await response.json();

  const yearSelect = document.getElementById("yearSelect");
  const defaultYear = yearSelect ? yearSelect.value : "2026";

  renderDashboard(defaultYear);
}

function filterYear(data, year) {
  return (data || []).filter(item => String(item.TAHUN) === String(year));
}

function sumData(data, year) {
  return filterYear(data, year)
    .reduce((total, item) => total + Number(item.JUMLAH || 0), 0);
}

function destroyChart(id) {
  if (charts[id]) {
    charts[id].destroy();
    delete charts[id];
  }
}

function updateYearLabels(year) {
  ["studentYearLabel","levelYearLabel","categoryYearLabel","subcategoryYearLabel","achievementYearLabel"]
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = year;
    });
}

function renderDashboard(year) {
  updateYearLabels(year);
  renderKPI(year);
  renderTopStudent(year);
  renderLevel(year);
  renderCategory(year);
  renderSubcategory(year);
  renderAchievement(year);
}

function renderKPI(year) {
  document.getElementById("totalStudents").textContent = sumData(allData.API_TOP5_STUDENT, year);
  document.getElementById("totalCategory").textContent = sumData(allData.API_CATEGORY, year);
  document.getElementById("totalAchievement").textContent = sumData(allData.API_PENCAPAIAN, year);
  document.getElementById("totalLevel").textContent = sumData(allData.API_PERINGKAT, year);
}

/* DATA LABEL TENGAH BAR */

const centerValueLabelPlugin = {
  id: "centerValueLabelPlugin",
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const dataset = chart.data.datasets[0];
    const meta = chart.getDatasetMeta(0);

    ctx.save();
    ctx.font = "bold 14px Inter, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    meta.data.forEach((bar, index) => {
      const value = dataset.data[index];

      const centerX = (bar.x + bar.base) / 2;
      const centerY = bar.y;

      ctx.fillText(value, centerX, centerY);
    });

    ctx.restore();
  }
};

function colorSet(count) {
  return Array.from({ length: count }, (_, i) => palette[i % palette.length]);
}

function horizontalBarOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: {
        display: false,
        grid: { display: false }
      },
      y: {
        grid: { display: false },
        ticks: {
          color: "#e5e7eb",
          font: {
            size: 12,
            weight: "700"
          }
        }
      }
    }
  };
}

/* TOP 5 STUDENT */

function renderTopStudent(year) {
  destroyChart("topStudentChart");

  const data = filterYear(allData.API_TOP5_STUDENT, year);
  const labels = data.map(item => item.LABEL);
  const values = data.map(item => Number(item.JUMLAH || 0));

  charts.topStudentChart = new Chart(document.getElementById("topStudentChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colorSet(values.length),
        borderColor: colorSet(values.length),
        borderWidth: 1,
        borderRadius: 10
      }]
    },
    options: horizontalBarOptions(),
    plugins: [centerValueLabelPlugin]
  });
}

/* LEVEL PERTANDINGAN */

function renderLevel(year) {
  destroyChart("levelChart");

  const data = filterYear(allData.API_PERINGKAT, year);
  const labels = data.map(item => item.LABEL);
  const values = data.map(item => Number(item.JUMLAH || 0));

  charts.levelChart = new Chart(document.getElementById("levelChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colorSet(values.length),
        borderColor: colorSet(values.length),
        borderWidth: 1,
        borderRadius: 10
      }]
    },
    options: horizontalBarOptions(),
    plugins: [centerValueLabelPlugin]
  });
}

/* CATEGORY */

function renderCategory(year) {
  destroyChart("categoryChart");

  const data = filterYear(allData.API_CATEGORY, year);
  const labels = data.map(item => item.LABEL);
  const values = data.map(item => Number(item.JUMLAH || 0));

  charts.categoryChart = new Chart(document.getElementById("categoryChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colorSet(values.length),
        borderColor: colorSet(values.length),
        borderWidth: 1,
        borderRadius: 10
      }]
    },
    options: horizontalBarOptions(),
    plugins: [centerValueLabelPlugin]
  });
}

/* SUBCATEGORY */

function renderSubcategory(year) {
  destroyChart("subcategoryChart");

  const data = filterYear(allData.API_SUBCATEGORY, year);
  const labels = data.map(item => item.LABEL);
  const values = data.map(item => Number(item.JUMLAH || 0));

  charts.subcategoryChart = new Chart(document.getElementById("subcategoryChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colorSet(values.length),
        borderColor: colorSet(values.length),
        borderWidth: 1,
        borderRadius: 10
      }]
    },
    options: horizontalBarOptions(),
    plugins: [centerValueLabelPlugin]
  });
}

/* PENCAPAIAN */

function renderAchievement(year) {
  destroyChart("achievementChart");

  const data = filterYear(allData.API_PENCAPAIAN, year);
  const labels = data.map(item => item.LABEL);
  const values = data.map(item => Number(item.JUMLAH || 0));

  charts.achievementChart = new Chart(document.getElementById("achievementChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colorSet(values.length),
        borderColor: colorSet(values.length),
        borderWidth: 1,
        borderRadius: 10
      }]
    },
    options: horizontalBarOptions(),
    plugins: [centerValueLabelPlugin]
  });
}

const yearSelect = document.getElementById("yearSelect");

if (yearSelect) {
  yearSelect.addEventListener("change", (e) => {
    renderDashboard(e.target.value);
  });
}

loadData();
