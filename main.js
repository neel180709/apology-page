// --- Screen Routing ---
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function checkPassword() {
  const entered = document.getElementById('pass-input').value.trim();
  if (entered === "bebo&neel") {
    showScreen('dashboard-screen');
    createFallingAnimation(['💖', '💕', '🌸', '✨'], 4000);
  } else {
    document.getElementById('pass-error').innerText = "Galat password hai Cupcake! Firse try karo.";
  }
}

function goBack() {
  showScreen('dashboard-screen');
}

function stopAndBack() {
  const vid = document.getElementById('apology-video');
  vid.pause();
  document.getElementById('video-wrapper').style.display = 'none';
  goBack();
}

function openBox(boxNum) {
  if (boxNum === 1) {
    showScreen('box1-screen');
    createFallingAnimation(['😭', '💧'], 3000);
  } else if (boxNum === 2) {
    showScreen('box2-screen');
    createFallingAnimation(['😓', '💭'], 3000);
  } else if (boxNum === 3) {
    showScreen('box3-screen');
    createFallingAnimation(['💖', '💗', '❤️', '💌'], 3000);
  } else if (boxNum === 4) {
    showScreen('box4-screen');
  } else if (boxNum === 5) {
    showScreen('box5-screen');
  } else if (boxNum === 6) {
    showScreen('box6-screen');
  }
}

// --- Falling Emojis Generator ---
function createFallingAnimation(emojis, durationMs) {
  const layer = document.getElementById('animation-layer');
  layer.innerHTML = "";
  
  const interval = setInterval(() => {
    const item = document.createElement('div');
    item.classList.add('falling-element');
    item.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    item.style.left = Math.random() * 92 + "vw";
    item.style.fontSize = (Math.random() * 20 + 20) + "px";
    item.style.animationDuration = (Math.random() * 1.5 + 2) + "s";
    
    layer.appendChild(item);
    
    setTimeout(() => {
      item.remove();
    }, 3500);
  }, 120);

  setTimeout(() => {
    clearInterval(interval);
  }, durationMs);
}

// --- Box 4 Video Handler ---
function playVideoChoice(choice) {
  const container = document.getElementById('video-wrapper');
  const video = document.getElementById('apology-video');
  const src = document.getElementById('video-src');

  if (choice === 1) {
    src.src = "video1.mp4";
  } else {
    src.src = "video2.mp4";
  }

  video.load();
  container.style.display = "block";
  video.play().catch(e => {
    console.log("Autoplay blocked or file not found yet.");
  });
}

// --- Box 6: Tic-Tac-Toe Engine ---
// Logic: 5 games cycle -> 3 Loss for AI (AI intentionally loses), 2 Try to Win
let gameCycleCount = 0; // 0, 1, 2, 3, 4
let grid = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
const human = "X";
const computer = "O";

const winLines = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function startGameSession() {
  document.getElementById('game-lobby').style.display = 'none';
  document.getElementById('game-arena').style.display = 'block';
  resetBoard();
}

function closeGameArena() {
  document.getElementById('game-arena').style.display = 'none';
  document.getElementById('game-lobby').style.display = 'flex';
  goBack();
}

function resetBoard() {
  grid = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  document.getElementById('turn-indicator').innerText = "YOUR TURN (X)";
  document.querySelectorAll('.t-cell').forEach(cell => cell.innerText = "");
}

function cellTap(index) {
  if (grid[index] !== "" || !gameActive) return;

  grid[index] = human;
  document.querySelectorAll('.t-cell')[index].innerText = human;

  if (checkWin(grid, human)) {
    document.getElementById('turn-indicator').innerText = "Aap Jeet Gaye! 🎉❤️";
    gameActive = false;
    gameCycleCount = (gameCycleCount + 1) % 5;
    return;
  }

  if (!grid.includes("")) {
    document.getElementById('turn-indicator').innerText = "Match Draw ho gaya! 🤝";
    gameActive = false;
    gameCycleCount = (gameCycleCount + 1) % 5;
    return;
  }

  document.getElementById('turn-indicator').innerText = "Computer Soch Raha Hai...";
  gameActive = false;
  setTimeout(runComputerTurn, 450);
}

function runComputerTurn() {
  const emptyCells = grid.map((v, i) => v === "" ? i : null).filter(v => v !== null);
  if (emptyCells.length === 0) return;

  // Har 5 mein se:
  // Count 0, 1, 2 => AI intentionally loses (Avoid blocks, pick random)
  // Count 3, 4 => AI tries to win (Standard AI)
  const shouldIntentionallyLose = (gameCycleCount % 5) < 3;
  let chosenIndex = null;

  if (!shouldIntentionallyLose) {
    // 1. Check if AI can win
    for (let idx of emptyCells) {
      let temp = [...grid];
      temp[idx] = computer;
      if (checkWin(temp, computer)) {
        chosenIndex = idx;
        break;
      }
    }
    // 2. Block human
    if (chosenIndex === null) {
      for (let idx of emptyCells) {
        let temp = [...grid];
        temp[idx] = human;
        if (checkWin(temp, human)) {
          chosenIndex = idx;
          break;
        }
      }
    }
  }

  // Intentionally lose ya fallback: avoid blocking if possible
  if (chosenIndex === null) {
    chosenIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  grid[chosenIndex] = computer;
  const cells = document.querySelectorAll('.t-cell');
  cells[chosenIndex].innerText = computer;
  cells[chosenIndex].style.color = "#4cc9f0";

  if (checkWin(grid, computer)) {
    document.getElementById('turn-indicator').innerText = "Computer Jeet Gaya! 🤖";
    gameActive = false;
    gameCycleCount = (gameCycleCount + 1) % 5;
    return;
  }

  if (!grid.includes("")) {
    document.getElementById('turn-indicator').innerText = "Match Draw ho gaya! 🤝";
    gameActive = false;
    gameCycleCount = (gameCycleCount + 1) % 5;
    return;
  }

  document.getElementById('turn-indicator').innerText = "YOUR TURN (X)";
  gameActive = true;
}

function checkWin(boardState, player) {
  return winLines.some(combo => combo.every(idx => boardState[idx] === player));
  }
