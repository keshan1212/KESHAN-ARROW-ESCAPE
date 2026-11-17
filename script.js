
const board = document.getElementById("board");
const message = document.getElementById("message");

let level = 1;
let coins = 100;
let moves = 0;
let bestScore = 0;
let puzzle = [];
let cleared = [];
let selected = -1;

const puzzles = [
  [
    ["→", "↓", "→", "↓", "→"],
    ["↓", "→", "↓", "→", "↓"],
    ["→", "↓", "→", "↓", "→"],
    ["↓", "→", "↓", "→", "↓"],
    ["→", "→", "↑", "←", "↑"]
  ],
  [
    ["→", "→", "↓", "→", "↓"],
    ["↑", "↓", "→", "↓", "→"],
    ["→", "↑", "↓", "→", "↓"],
    ["↓", "→", "↑", "↓", "→"],
    ["→", "↓", "→", "↑", "←"]
  ]
];

function createPuzzle() {
  const source = puzzles[(level - 1) % puzzles.length];

  puzzle = source.flat();
  cleared = new Array(25).fill(false);
  selected = -1;
  moves = 0;

  render();
  updateStats();

  message.textContent = "Tap an arrow to clear it!";
}

function render() {
  board.innerHTML = "";

  puzzle.forEach((arrow, index) => {
    const cell = document.createElement("button");

    cell.className = "cell";
    cell.type = "button";

    if (cleared[index]) {
      cell.classList.add("cleared", "empty");
      cell.textContent = "";
    } else {
      cell.textContent = arrow;
    }

    if (selected === index) {
      cell.classList.add("selected");
    }

    cell.addEventListener("click", () => {
      selectArrow(index);
    });

    board.appendChild(cell);
  });
}

function selectArrow(index) {
  if (cleared[index]) return;

  selected = index;
  moves++;

  const row = Math.floor(index / 5);
  const col = index % 5;
  const arrow = puzzle[index];

  // Demo puzzle interaction:
  // An arrow is cleared when selected.
  // A full path and collision system will be
  // added in the next gameplay upgrade.

  cleared[index] = true;
  selected = -1;

  coins += 2;

  message.textContent =
    "Arrow cleared! Keep solving the puzzle.";

  render();
  updateStats();

  if (cleared.every(Boolean)) {
    finishLevel();
  }
}

function finishLevel() {
  coins += 20;
  bestScore = Math.max(bestScore, level);

  message.textContent =
    "🎉 LEVEL COMPLETE! +20 BONUS COINS";

  updateStats();

  setTimeout(() => {
    level++;
    createPuzzle();
  }, 1500);
}

function updateStats() {
  document.getElementById("level").textContent = level;
  document.getElementById("coins").textContent = coins;
  document.getElementById("moves").textContent = moves;
  document.getElementById("bestScore").textContent = bestScore;

  const difficulty = document.getElementById("difficulty");

  difficulty.textContent =
    level <= 5 ? "EASY" :
    level <= 15 ? "MEDIUM" : "HARD";
}

document.getElementById("restartBtn")
  .addEventListener("click", createPuzzle);

document.getElementById("hintBtn")
  .addEventListener("click", () => {
    if (coins < 10) {
      message.textContent = "Not enough coins for a hint!";
      return;
    }

    const next = cleared.findIndex(value => !value);

    if (next === -1) return;

    coins -= 10;
    cleared[next] = true;

    message.textContent = "💡 Hint used! One arrow cleared.";

    render();
    updateStats();

    if (cleared.every(Boolean)) {
      finishLevel();
    }
  });

createPuzzle();
