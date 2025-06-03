
const size = 25;
const mineCount = 5;
let mines = new Set();
let revealed = new Set();
let safeClicks = 0;
let mineClicks = 0;
let totalGames = 0;
let totalWins = 0;

function startGame() {
  mines.clear();
  revealed.clear();
  safeClicks = 0;
  mineClicks = 0;
  totalGames++;
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  document.getElementById("status").textContent = "";

  while (mines.size < mineCount) {
    mines.add(Math.floor(Math.random() * size));
  }

  const predictedSafe = predictSafeCells();
  for (let i = 0; i < size; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    if (predictedSafe.includes(i)) {
      cell.classList.add("predict");
    }
    cell.onclick = () => reveal(cell, i);
    grid.appendChild(cell);
  }
  updateStats();
}

function reveal(cell, index) {
  if (revealed.has(index)) return;
  revealed.add(index);

  if (mines.has(index)) {
    cell.classList.add("mine");
    cell.textContent = "💣";
    mineClicks++;
    document.getElementById("status").textContent = "💥 BOOM! You hit a mine!";
    saveStats(false);
    disableAll();
  } else {
    cell.classList.add("safe");
    cell.textContent = "✅";
    safeClicks++;
    if (safeClicks === size - mineCount) {
      document.getElementById("status").textContent = "🎉 YOU WIN!";
      totalWins++;
      saveStats(true);
      disableAll();
    }
  }
  cell.onclick = null;
  updateStats();
}

function disableAll() {
  document.querySelectorAll(".cell").forEach(cell => {
    cell.onclick = null;
  });
}

function predictSafeCells() {
  const riskMap = Array(size).fill(0);
  mines.forEach(idx => {
    getNeighbors(idx).forEach(n => {
      if (n >= 0 && n < size) riskMap[n] += 1;
    });
  });
  return riskMap
    .map((r, i) => ({ i, r }))
    .sort((a, b) => a.r - b.r)
    .slice(0, 8)
    .map(e => e.i);
}

function getNeighbors(i) {
  const row = Math.floor(i / 5);
  const col = i % 5;
  const offsets = [-1, 1, -5, 5];
  return offsets.map(o => i + o).filter(n => n >= 0 && n < size);
}

function updateStats() {
  const winRate = totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(1) : 0;
  document.getElementById("stats").innerText =
    `✅ Safe: ${safeClicks} | 💣 Mines: ${mineClicks} | Games: ${totalGames} | Wins: ${totalWins} (${winRate}%)`;
}

function saveStats(won) {
  const saved = JSON.parse(localStorage.getItem("mineStats") || "{}");
  saved.games = (saved.games || 0) + 1;
  saved.wins = (saved.wins || 0) + (won ? 1 : 0);
  localStorage.setItem("mineStats", JSON.stringify(saved));
  totalGames = saved.games;
  totalWins = saved.wins;
}
