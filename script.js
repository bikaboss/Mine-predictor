
const size = 25; // 5x5 grid
const mineCount = 5;
let mines = new Set();
let revealed = new Set();
let safeClicks = 0;
let mineClicks = 0;

function startGame() {
  mines.clear();
  revealed.clear();
  safeClicks = 0;
  mineClicks = 0;

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
    document.getElementById("status").textContent = "Game Over!";
  } else {
    cell.classList.add("safe");
    cell.textContent = "✅";
    safeClicks++;
  }

  cell.onclick = null;
  updateStats();
}

// Prédiction probabiliste : sélectionne les 8 cases les moins probables d'être des mines
function predictSafeCells() {
  let scores = Array(size).fill(0.2); // 20% proba par défaut

  mines.forEach(idx => {
    let neighbors = getNeighbors(idx);
    neighbors.forEach(n => {
      if (n >= 0 && n < size) scores[n] += 0.1; // augmente la suspicion
    });
  });

  // On retourne les indexes avec les scores les plus faibles
  return scores
    .map((score, index) => ({ index, score }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 8)
    .map(item => item.index);
}

function getNeighbors(index) {
  const row = Math.floor(index / 5);
  const col = index % 5;
  const positions = [-1, 1, -5, 5];
  const neighbors = [];

  for (let pos of positions) {
    const n = index + pos;
    if (n >= 0 && n < size) {
      const nRow = Math.floor(n / 5);
      if (Math.abs(nRow - row) <= 1) {
        neighbors.push(n);
      }
    }
  }
  return neighbors;
}

function updateStats() {
  document.getElementById("status").innerHTML = 
    "✅ Safe Clicks: " + safeClicks + 
    " | 💣 Mines Hit: " + mineClicks + 
    " | 🔄 Remaining: " + (size - revealed.size);
}
