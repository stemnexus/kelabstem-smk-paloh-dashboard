const API_URL = "https://script.google.com/macros/s/AKfycbyrcy8iK-0nSS_q9aA2lsTCmee-_YF-Yv3FK656vADnf30ceKZb-ud_UlEwyjBTU0J1/exec";

let allData = {};
let charts = {};

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
  [
    "studentYearLabel",
    "levelYearLabel",
    "categoryYearLabel",
    "subcategoryYearLabel",
    "achievementYearLabel"
  ].forEach(id => {
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

/* KPI */

function renderKPI(year) {
  const totalStudents = sumData(allData.API_TOP5_STUDENT, year);
  const totalCategory = sumData(allData.API_CATEGORY, year);
  const totalAchievement = sumData(allData.API_PENCAPAIAN, year);
  const totalLevel = sumData(allData.API_PERINGKAT, year);

  document.getElementById("totalStudents").textContent = totalStudents;
  document.getElementById("totalCategory").textContent = totalCategory;
  document.getElementById("totalAchievement").textContent = totalAchievement;
  document.getElementById("totalLevel").textContent = totalLevel;
}

/* VALUE LABEL INSIDE BAR */

const valueLabelPlugin = {
  id: "valueLabelPlugin",
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    ctx.save();

    const dataset = chart.data.datasets[0];
    const meta = chart.getDatasetMeta(0);

    ctx.font = "bold 13px Inter, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    meta.data.forEach((bar, index) => {
      const value = dataset.data[index];
      const position = bar.tooltipPosition();

      ctx.fillText(value, position.x, position.y);
    });

    ctx.restore();
  }
};

/* SHARED HORIZONTAL BAR OPTIONS */

function horizontalBarOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          color: "#e5e7eb",
          font: {
            size: 12,
            weight: "600"
          }
        }
      }
    }
  };
}

/* SHARED DOUGHNUT OPTIONS */

function doughnutOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "left",
        labels: {
          color: "#cbd5e1",
          boxWidth: 14,
          padding: 14,
          font: {
            size: 12,
            weight: "600"
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

  const ctx = document.getElementById("topStudentChart");

  charts.topStudentChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Jumlah Penyertaan",
        data: values,
        backgroundColor: "rgba(56,189,248,0.78)",
        borderColor: "#38bdf8",
        borderWidth: 1,
        borderRadius: 10
      }]
    },
    options: horizontalBarOptions(),
    plugins: [valueLabelPlugin]
  });
}

/* LEVEL PERTANDINGAN */

function renderLevel(year) {
  destroyChart("levelChart");

  const data = filterYear(allData.API_PERINGKAT, year);

  const labels = data.map(item => item.LABEL);
  const values = data.map(item => Number(item.JUMLAH || 0));

  const ctx = document.getElementById("levelChart");

  charts.levelChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Jumlah Pertandingan",
        data: values,
        backgroundColor: "rgba(34,211,238,0.78)",
        borderColor: "#22d3ee",
        borderWidth: 1,
        borderRadius: 10
      }]
    },
    options: horizontalBarOptions(),
    plugins: [valueLabelPlugin]
  });
}

/* TOP CATEGORY */

function renderCategory(year) {
  destroyChart("categoryChart");

  const data = filterYear(allData.API_CATEGORY, year);

  const labels = data.map(item => item.LABEL);
  const values = data.map(item => Number(item.JUMLAH || 0));

  const ctx = document.getElementById("categoryChart");

  charts.categoryChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: [
          "#38bdf8",
          "#fb7185",
          "#fb923c",
          "#a78bfa",
          "#22c55e"
        ],
        borderColor: "#0f172a",
        borderWidth: 2
      }]
    },
    options: doughnutOptions()
  });
}

/* TOP SUBCATEGORY */

function renderSubcategory(year) {
  destroyChart("subcategoryChart");

  const data = filterYear(allData.API_SUBCATEGORY, year);

  const labels = data.map(item => item.LABEL);
  const values = data.map(item => Number(item.JUMLAH || 0));

  const ctx = document.getElementById("subcategoryChart");

  charts.subcategoryChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Jumlah",
        data: values,
        backgroundColor: "rgba(167,139,250,0.78)",
        borderColor: "#a78bfa",
        borderWidth: 1,
        borderRadius: 10
      }]
    },
    options: horizontalBarOptions(),
    plugins: [valueLabelPlugin]
  });
}

/* PENCAPAIAN */

function renderAchievement(year) {
  destroyChart("achievementChart");

  const data = filterYear(allData.API_PENCAPAIAN, year);

  const labels = data.map(item => item.LABEL);
  const values = data.map(item => Number(item.JUMLAH || 0));

  const ctx = document.getElementById("achievementChart");

  charts.achievementChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Jumlah",
        data: values,
        backgroundColor: "rgba(251,191,36,0.78)",
        borderColor: "#fbbf24",
        borderWidth: 1,
        borderRadius: 10
      }]
    },
    options: horizontalBarOptions(),
    plugins: [valueLabelPlugin]
  });
}

/* YEAR SELECTOR */

const yearSelect = document.getElementById("yearSelect");

if (yearSelect) {
  yearSelect.addEventListener("change", (e) => {
    renderDashboard(e.target.value);
  });
}

loadData();
