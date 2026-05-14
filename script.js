const API_URL = "https://script.google.com/macros/s/AKfycbzA_pSP6Ak-V6dtGWorfgCpA_2OYparnQT8mKL8ac79t5O5ZF3L1kDFDPpIXB-iwcjHSg/exec";

let allData = [];

async function loadData(){

  try{

    const response = await fetch(API_URL);

    const data = await response.json();

    allData = data;

    renderMetrics(data);

    renderTable(data);

    renderChart(data);

  }

  catch(error){

    console.error(error);

  }

}

function renderMetrics(data){

  document.getElementById("totalStudents")
  .innerText = data.length;

  document.getElementById("totalCompetitions")
  .innerText =
  new Set(data.map(d => d.Program)).size;

  document.getElementById("totalAchievements")
  .innerText =
  data.filter(d => d.Achievement).length;

  document.getElementById("totalPrograms")
  .innerText =
  new Set(data.map(d => d.Category)).size;

}

function renderTable(data){

  const tableHead =
  document.getElementById("tableHead");

  const tableBody =
  document.getElementById("tableBody");

  if(data.length === 0) return;

  const headers =
  Object.keys(data[0]);

  tableHead.innerHTML =
  `<tr>
    ${headers.map(h=>`<th>${h}</th>`).join("")}
  </tr>`;

  tableBody.innerHTML =
  data.map(row => `
    <tr>
      ${headers.map(h=>`<td>${row[h]}</td>`).join("")}
    </tr>
  `).join("");

}

function renderChart(data){

  const ctx =
  document.getElementById("participationChart");

  new Chart(ctx,{

    type:"bar",

    data:{

      labels:[
        "Participants",
        "Competitions",
        "Achievements"
      ],

      datasets:[{

        label:"Nexus Metrics",

        data:[
          data.length,
          new Set(data.map(d => d.Program)).size,
          data.filter(d => d.Achievement).length
        ],

        backgroundColor:[
          "#06b6d4",
          "#8b5cf6",
          "#22c55e"
        ]

      }]

    }

  });

}

document
.getElementById("searchInput")
.addEventListener("input",function(){

  const keyword =
  this.value.toLowerCase();

  const filtered =
  allData.filter(row =>
    Object.values(row).some(value =>
      String(value)
      .toLowerCase()
      .includes(keyword)
    )
  );

  renderTable(filtered);

});

loadData();
