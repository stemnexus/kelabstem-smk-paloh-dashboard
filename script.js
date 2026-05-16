const API_URL = "https://script.google.com/macros/s/AKfycbyrcy8iK-0nSS_q9aA2lsTCmee-_YF-Yv3FK656vADnf30ceKZb-ud_UlEwyjBTU0J1/exec";

let allData = {};

async function loadData() {

  const response = await fetch(API_URL);

  allData = await response.json();

  renderDashboard(2026);

}

function renderDashboard(year){

  renderTopStudent(year);
  renderCategory(year);
  renderSubcategory(year);
  renderAchievement(year);
  renderLevel(year);

}

function filterYear(data, year){

  return data.filter(item => item.TAHUN == year);

}

/* TOP STUDENT */

function renderTopStudent(year){

  const data = filterYear(allData.API_TOP5_STUDENT, year);

  const labels = data.map(item => item.LABEL);

  const values = data.map(item => item.JUMLAH);

  const ctx = document.getElementById('topStudentChart');

  new Chart(ctx,{
    type:'bar',
    data:{
      labels:labels,
      datasets:[{
        label:'Jumlah Penyertaan',
        data:values
      }]
    },
    options:{
      responsive:true
    }
  });

}

/* CATEGORY */

function renderCategory(year){

  const data = filterYear(allData.API_CATEGORY, year);

  const labels = data.map(item => item.LABEL);

  const values = data.map(item => item.JUMLAH);

  const ctx = document.getElementById('categoryChart');

  new Chart(ctx,{
    type:'doughnut',
    data:{
      labels:labels,
      datasets:[{
        data:values
      }]
    }
  });

}

/* SUBCATEGORY */

function renderSubcategory(year){

  const data = filterYear(allData.API_SUBCATEGORY, year);

  const labels = data.map(item => item.LABEL);

  const values = data.map(item => item.JUMLAH);

  const ctx = document.getElementById('subcategoryChart');

  new Chart(ctx,{
    type:'polarArea',
    data:{
      labels:labels,
      datasets:[{
        data:values
      }]
    }
  });

}

/* ACHIEVEMENT */

function renderAchievement(year){

  const data = filterYear(allData.API_PENCAPAIAN, year);

  const labels = data.map(item => item.LABEL);

  const values = data.map(item => item.JUMLAH);

  const ctx = document.getElementById('achievementChart');

  new Chart(ctx,{
    type:'pie',
    data:{
      labels:labels,
      datasets:[{
        data:values
      }]
    }
  });

}

/* LEVEL */

function renderLevel(year){

  const data = filterYear(allData.API_PERINGKAT, year);

  const labels = data.map(item => item.LABEL);

  const values = data.map(item => item.JUMLAH);

  const ctx = document.getElementById('levelChart');

  new Chart(ctx,{
    type:'radar',
    data:{
      labels:labels,
      datasets:[{
        label:'Jumlah',
        data:values
      }]
    }
  });

}

/* YEAR SELECTOR */

const yearSelect = document.getElementById('yearSelect');

if(yearSelect){

  yearSelect.addEventListener('change',(e)=>{

    document.querySelectorAll('canvas').forEach(canvas => {
      const chart = Chart.getChart(canvas);
      if(chart){
        chart.destroy();
      }
    });

    renderDashboard(e.target.value);

  });

}

loadData();
