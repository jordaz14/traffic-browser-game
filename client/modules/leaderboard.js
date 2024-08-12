export function sayHi() {
  console.log("hello");
}

const url = "http://localhost:3000/";
const tbody = document.querySelector("tbody");

fetchData("").then((leaderboard) => {
  console.log(leaderboard);
  for (const entry of leaderboard) {
    const newRow = document.createElement("tr");
    for (const data in entry) {
      if (data != "id") {
        const newTableData = document.createElement("td");
        newTableData.textContent = entry[data];
        newRow.appendChild(newTableData);
        console.log(entry[data]);
      }
    }
    tbody.appendChild(newRow);
  }
});

const partyForm = document.querySelector(".party-form");
partyForm.addEventListener("submit", (e) => {
  e.preventDefault();
  fetchData("join-party").then((result) => {
    console.log(result);
  });
});

const scoreForm = document.querySelector(".score-form");
scoreForm.addEventListener("submit", (e) => {
  e.preventDefault();
  postData("submit-score", {
    username: "testuser3",
    party: "global",
    score: 1000,
  }).then((result) => {
    console.log(result);
  });
});

async function fetchData(endpoint) {
  try {
    const response = await fetch(`${url}${endpoint}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}

async function postData(endpoint, data = {}) {
  const response = await fetch(`${url}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response.json();
}
