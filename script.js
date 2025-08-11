// === Your data from the code you sent ===
const imageUrls = [
  "https://i.postimg.cc/sXw4Q1T5/cricket-stadium-1.jpg",
  "https://i.postimg.cc/Qd1n4Lg7/cricket-stadium-2.jpg",
  "https://i.postimg.cc/1352v65k/cricket-stadium-3.jpg",
  "https://i.postimg.cc/Nj0v20f1/cricket-stadium-4.jpg",
  "https://i.postimg.cc/Wb710p45/cricket-stadium-5.jpg",
  "https://i.postimg.cc/Y95PqX4t/cricket-stadium-6.jpg",
  "https://i.postimg.cc/26LdJ1j4/cricket-stadium-7.jpg",
  "https://i.postimg.cc/qRJ18Qp8/cricket-stadium-8.jpg",
  "https://i.postimg.cc/Rhp45q9t/cricket-stadium-9.jpg",
  "https://i.postimg.cc/Wb9hD2zW/cricket-stadium-10.jpg"
];

const levelDescriptions = [
  "📅 Jan 18, 2015: AB de Villiers smashed the fastest ODI century in just 31 balls against the West Indies.",
  "📅 Mar 21, 2022: Babar Azam scored a magnificent 196 runs against Australia in the Karachi Test.",
  "📅 Aug 22, 2019: Ben Stokes played a match-winning innings of 135 against Australia in the Ashes.",
  "📅 Mar 14, 1996: Michael Bevan hit a last-ball boundary to win vs West Indies in the World Cup.",
  "📅 Mar 3, 2016: Carlos Brathwaite hit 4 sixes in a row to win the 2016 T20 World Cup Final.",
  "📅 Jun 14, 2017: Bumrah bowled a lethal yorker to Maxwell in the Champions Trophy Final.",
  "📅 Apr 2, 2011: MS Dhoni's iconic six sealed the 2011 World Cup win for India.",
  "📅 Nov 2021: Rizwan went from ICU to semi-final hero in T20 WC 2021.",
  "📅 Mar 25, 1992: Imran Khan led Pakistan to their first World Cup victory.",
  "📅 Mar 2019: Kusal Perera scored an unforgettable 153* vs South Africa."
];

const levels = [
  { words: ["SIX", "SPIN", "PACE"], hint: "Big boundary hit over fence, Ball turns on the pitch, Fast bowling speed" },
  { words: ["SLIP", "SEAM", "BAIL"], hint: "Fielder next to the wicketkeeper, Raised stitch on the ball, Small piece on top of stumps" },
  { words: ["BEAM", "JUMP", "OUT"], hint: "Bright light or laser (used for DRS), Quick move by a fielder, When a batsman is dismissed" },
  { words: ["DROP", "BAT", "YARD"], hint: "Fielder misses the catch, Equipment to hit the ball, Measurement of the cricket ground" },
  { words: ["FLY", "JERK", "ASH"], hint: "Ball hit high in the air, Sudden movement or twist, Historic Test cricket series" },
  { words: ["RUN", "HIT", "LEG"], hint: "Single point scored, Strike the ball with bat, Part of the body, also a fielding area" },
  { words: ["GAP", "PAD", "TIP"], hint: "Space between fielders, Protective gear for legs, Edge of the bat" },
  { words: ["WIDE", "DOT", "RUNS"], hint: "Ball outside batsman's reach, Ball with no runs scored, Total points scored" },
  { words: ["BALL", "FIELD", "CATCH"], hint: "Spherical object bowled, Area where game is played, Grabbing the ball in the air" },
  { words: ["BOWL", "PLAY", "TEAM"], hint: "Deliver the ball to batsman, Participate in the game, Group of players" }
];

// --- Variables ---
let currentLevel = 0;
let selected = ""; // Stores the current word formed by clicked/dragged letters
let foundWords = new Set();
let hintsUsed = 0;
let playerDiamonds = parseInt(localStorage.getItem("playerDiamonds") || "0");
const diamondReward = 500;

// Dragging related variables
let isDragging = false;
let selectedLetterElements = []; // To keep track of actual DOM elements currently selected in a drag
let dragCanvas;
let dragCtx;


// DOM Elements (initial selection, these will be updated for dynamic elements)
const splashScreen = document.getElementById("splash-screen");
const mainMenu = document.getElementById("main-menu");
const levelSelect = document.getElementById("level-select");
const gameContainer = document.getElementById("game");
const pillboxes = document.getElementById("pillboxes");
const selectedWordDisplay = document.getElementById("selected-word");
const circle = document.getElementById("letter-circle");
const hintBox = document.getElementById("hint");
const resultBox = document.getElementById("result");
const btnHint = document.getElementById("btn-hint");
const btnClear = document.getElementById("btn-clear");
const btnNext = document.getElementById("btn-next");
const playerDiamondsDisplay = document.getElementById("player-diamonds");
let btnShuffle; // This will be assigned dynamically after re-rendering
const rewardModal = document.getElementById("rewardModal");
const previewImage = document.getElementById("preview-image");
const previewText = document.getElementById("preview-text");

// Sounds
const soundSelect = new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg");
const soundComplete = new Audio("https://actions.google.com/sounds/v1/cartoon/concussive_hit_guitar_boing.ogg");
const soundError = new Audio("https://actions.google.com/sounds/v1/foley/whoosh_foley.ogg");
const soundShuffle = new Audio("https://actions.google.com/sounds/v1/ui/swipe_to_select.ogg"); // Sound for shuffle
const soundReward = new Audio("https://actions.google.com/sounds/v1/ui/puzzle_game_star_win.ogg");

// Fireworks canvas setup
const fwCanvas = document.getElementById("fireworks-container");
const fwCtx = fwCanvas.getContext("2d");
fwCanvas.width = window.innerWidth;
fwCanvas.height = window.innerHeight;
window.addEventListener("resize", () => {
  fwCanvas.width = window.innerWidth;
  fwCanvas.height = window.innerHeight;
});


// --- Fireworks classes and functions ---
class Firework {
  constructor() {
    this.x = Math.random() * fwCanvas.width;
    this.y = fwCanvas.height;
    this.targetY = Math.random() * fwCanvas.height / 2;
    this.speed = 5 + Math.random() * 3;
    this.particles = [];
    this.exploded = false;
    this.hue = Math.random() * 360; // Base hue for firework trail
  }
  update() {
    if (!this.exploded) {
      this.y -= this.speed;
      // Draw a small trail behind the ascending firework
      fwCtx.beginPath();
      fwCtx.arc(this.x, this.y + 15, 2, 0, Math.PI * 2); // Slight offset for trail effect
      fwCtx.fillStyle = `hsl(${this.hue}, 100%, 70%, 0.5)`;
      fwCtx.fill();

      if (this.y <= this.targetY) {
        this.explode();
      }
    }
    this.particles.forEach(p => p.update());
    this.particles = this.particles.filter(p => !p.done);
  }
  explode() {
    this.exploded = true;
    const count = 30 + Math.floor(Math.random() * 20);
    for(let i=0; i<count; i++){
      this.particles.push(new Particle(this.x, this.y, this.hue)); // Pass hue to particles
    }
  }
  draw() {
    // Firework body is drawn by the trail in update(), particles draw themselves
    this.particles.forEach(p => p.draw());
  }
  isDone() {
    return this.exploded && this.particles.length === 0;
  }
}

class Particle {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.speedX = (Math.random() - 0.5) * 8; // Slightly faster initial spread
    this.speedY = (Math.random() - 0.5) * 8;
    this.alpha = 1;
    this.size = 3 + Math.random() * 2;
    this.gravity = 0.05;
    this.done = false;
    this.color = `hsl(${hue + (Math.random() * 60 - 30)}, 100%, 60%)`; // Vary color slightly
  }
  update() {
    this.speedY += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= 0.02;
    if (this.alpha <= 0) {
      this.done = true;
    }
  }
  draw() {
    fwCtx.save();
    fwCtx.globalAlpha = this.alpha;
    fwCtx.fillStyle = this.color;
    fwCtx.beginPath();
    fwCtx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    fwCtx.fill();
    fwCtx.restore();
  }
}

let fireworks = [];
function launchFireworks(){
  fireworks.push(new Firework());
}

function animateFireworks(){
  fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
  fireworks.forEach(fw => {
    fw.update();
    fw.draw();
  });
  fireworks = fireworks.filter(fw => !fw.isDone());
  if (fireworks.length > 0) {
    requestAnimationFrame(animateFireworks);
  }
}

// --- Player Data ---
function updateDiamonds(amount) {
  playerDiamonds += amount;
  localStorage.setItem("playerDiamonds", playerDiamonds);
  playerDiamondsDisplay.textContent = playerDiamonds;
}
function getDiamonds() {
  return parseInt(localStorage.getItem("playerDiamonds") || "0");
}
playerDiamondsDisplay.textContent = getDiamonds();

// --- Splash Screen Timer ---
setTimeout(() => {
  splashScreen.style.display = "none";
  showMainMenu();
}, 3000); // Reduced to 3 seconds for faster entry

// --- Show Main Menu ---
function showMainMenu() {
  hideAllScreens();
  mainMenu.style.display = "flex";
}
// --- Show Challenges/Level Select ---
function showChallenges() {
  showLevelSelect();
}
// --- Show Level Select ---
function showLevelSelect(){
  hideAllScreens();
  levelSelect.innerHTML = "<div class='back-button' onclick='showMainMenu()'>Back</div>"; // Add back button dynamically
  levelSelect.style.display = "flex";

  const maxUnlockedLevel = getSavedProgress();

  for(let i=0; i<levels.length; i++){
    const lvl = document.createElement("div");
    lvl.classList.add("level-card");
    lvl.setAttribute("role","listitem");
    lvl.setAttribute("tabindex","0");

    const img = document.createElement("img");
    img.src = imageUrls[i];
    img.alt = `Background image for level ${i+1}`;
    lvl.appendChild(img);

    const num = document.createElement("div");
    num.classList.add("level-number");
    num.textContent = i+1;
    lvl.appendChild(num);

    const unlocked = i <= maxUnlockedLevel;
    if (!unlocked) {
      lvl.classList.add("locked");
      lvl.setAttribute("aria-disabled","true");
      lvl.removeAttribute("tabindex");
    } else {
      lvl.addEventListener("click", () => {
        currentLevel = i;
        startLevel(i);
      });
      lvl.addEventListener("keypress", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          currentLevel = i;
          startLevel(i);
        }
      });
    }
    levelSelect.appendChild(lvl);
  }
}

// --- Start Level ---
function startLevel(levelIndex){
  hideAllScreens();
  gameContainer.style.display = "flex";
  resetGame();

  currentLevel = levelIndex;
  foundWords.clear();
  hintsUsed = 0;
  hintBox.textContent = "";
  resultBox.textContent = "";
  btnNext.disabled = true;

  gameContainer.style.backgroundImage = `url('${imageUrls[levelIndex]}')`;

  setupLevel(levels[levelIndex].words);

  hints = levels[currentLevel].hint.split(",").map(h => h.trim());
  hints = hints.slice(0,3);

  pillboxes.innerHTML = "";
  levels[levelIndex].words.forEach(word => {
    const pill = document.createElement("div");
    pill.classList.add("pill");
    pill.textContent = "_".repeat(word.length);
    pillboxes.appendChild(pill);
  });

  selected = "";
  updateSelectedWord();
}

// Helper to shuffle letters (Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- Setup level words and letter circle ---
let allLetters = [];
function setupLevel(words) {
  let lettersSet = new Set();
  words.forEach(w => {
    w.split("").forEach(l => lettersSet.add(l));
  });
  allLetters = Array.from(lettersSet);

  while(allLetters.length < 5) {
    const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetter = alpha.charAt(Math.floor(Math.random()*alpha.length));
    if(!lettersSet.has(randomLetter)) {
      lettersSet.add(randomLetter);
      allLetters.push(randomLetter);
    }
  }

  shuffleLetters(false);
}

// --- Shuffle Letters Function ---
function shuffleLetters(playSound = true) {
    clearActiveLetters(false);
    if (playSound) {
        soundShuffle.play().catch(() => {});
    }

    shuffleArray(allLetters);

    circle.innerHTML = "";
    const dragLineCanvas = document.createElement("canvas");
    dragLineCanvas.id = "drag-line-canvas";
    circle.appendChild(dragLineCanvas);

    const shuffleButton = document.createElement("div");
    shuffleButton.id = "shuffle-button";
    shuffleButton.innerHTML = "🔀";
    circle.appendChild(shuffleButton);

    btnShuffle = document.getElementById("shuffle-button");
    btnShuffle.addEventListener("click", () => shuffleLetters(true));

    dragCanvas = document.getElementById("drag-line-canvas");
    dragCtx = dragCanvas.getContext("2d");

    const circleRect = circle.getBoundingClientRect();
    dragCanvas.width = circleRect.width;
    dragCanvas.height = circleRect.height;
    dragCanvas.style.top = "0";
    dragCanvas.style.left = "0";

    const centerX = 160;
    const centerY = 160;
    const radius = 110;
    const len = allLetters.length;

    allLetters.forEach((letter, i) => {
        const angle = (i / len) * 2 * Math.PI - Math.PI/2;
        const x = centerX + radius * Math.cos(angle) - 30;
        const y = centerY + radius * Math.sin(angle) - 30;

        const letterDiv = document.createElement("div");
        letterDiv.classList.add("letter");
        letterDiv.textContent = letter;
        letterDiv.style.left = `${x}px`;
        letterDiv.style.top = `${y}px`;
        letterDiv.setAttribute("data-letter", letter);
        letterDiv.setAttribute("role","button");
        letterDiv.setAttribute("tabindex","0");

        letterDiv.addEventListener("mousedown", handleDragStart);
        letterDiv.addEventListener("touchstart", handleDragStart, { passive: false });

        circle.appendChild(letterDiv);
    });
}


// Helper to get center of a letter element relative to its parent (#letter-circle)
function getLetterCenter(letterElem) {
    const rect = letterElem.getBoundingClientRect();
    const circleRect = circle.getBoundingClientRect();
    return {
        x: (rect.left + rect.right) / 2 - circleRect.left,
        y: (rect.top + rect.bottom) / 2 - circleRect.top
    };
}

function handleDragStart(e) {
    e.preventDefault();
    const letterElem = e.target.closest(".letter");
    if (!letterElem) return;

    isDragging = true;
    selected = "";
    selectedLetterElements = [];
    clearActiveLetters();

    addLetterToSelection(letterElem);

    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("touchmove", handleDragMove, { passive: false });
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchend", handleDragEnd);
}

function addLetterToSelection(letterElem) {
    const letter = letterElem.getAttribute("data-letter");
    if (!selectedLetterElements.includes(letterElem)) {
        selected += letter;
        letterElem.classList.add("active");
        selectedLetterElements.push(letterElem);
        soundSelect.play().catch(() => {});
        updateSelectedWord();
        resultBox.textContent = "";
    }
}

function handleDragMove(e) {
    if (!isDragging) return;
    e.preventDefault();

    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    const circleRect = circle.getBoundingClientRect();
    const relativeX = clientX - circleRect.left;
    const relativeY = clientY - circleRect.top;

    dragCtx.clearRect(0, 0, dragCanvas.width, dragCanvas.height);

    for (let i = 0; i < selectedLetterElements.length - 1; i++) {
        const p1 = getLetterCenter(selectedLetterElements[i]);
        const p2 = getLetterCenter(selectedLetterElements[i + 1]);
        drawLine(p1.x, p1.y, p2.x, p2.y);
    }

    if (selectedLetterElements.length > 0) {
        const lastLetterCenter = getLetterCenter(selectedLetterElements[selectedLetterElements.length - 1]);
        drawLine(lastLetterCenter.x, lastLetterCenter.y, relativeX, relativeY);
    }

    const allLettersInCircle = circle.querySelectorAll(".letter");
    allLettersInCircle.forEach(letterElem => {
        if (!selectedLetterElements.includes(letterElem)) {
            const rect = letterElem.getBoundingClientRect();
            if (clientX > rect.left && clientX < rect.right &&
                clientY > rect.top && clientY < rect.bottom) {
                addLetterToSelection(letterElem);
            }
        }
    });
}

function handleDragEnd() {
    if (!isDragging) return;
    isDragging = false;

    dragCtx.clearRect(0, 0, dragCanvas.width, dragCanvas.height);

    if (selected.length > 0) {
        checkWord();
    } else {
        clearActiveLetters(false);
    }

    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("touchmove", handleDragMove);
    document.removeEventListener("mouseup", handleDragEnd);
    document.removeEventListener("touchend", handleDragEnd);
}

function drawLine(x1, y1, x2, y2) {
    dragCtx.beginPath();
    dragCtx.moveTo(x1, y1);
    dragCtx.lineTo(x2, y2);
    dragCtx.lineWidth = 5;
    dragCtx.strokeStyle = "#ffcc00";
    dragCtx.lineCap = "round";
    dragCtx.stroke();
}


function updateSelectedWord() {
  selectedWordDisplay.textContent = selected ? selected : "";
}

// --- Check word function ---
function checkWord() {
  const upperWord = selected.toUpperCase();
  if(!upperWord) {
      resultBox.textContent = "Please select letters first!";
      soundError.play().catch(() => {});
      clearActiveLetters();
      return;
  }

  if(levels[currentLevel].words.includes(upperWord) && !foundWords.has(upperWord)) {
    foundWords.add(upperWord);
    soundComplete.play().catch(() => {});
    updatePills();
    hintBox.textContent = "";
    resultBox.textContent = `Great! 👍 You found: ${upperWord}`;
    btnNext.disabled = foundWords.size !== levels[currentLevel].words.length;

    clearActiveLetters(false);

    if(foundWords.size === levels[currentLevel].words.length) {
      setTimeout(showReward, 500);
    }
  } else {
    resultBox.textContent = `❌ "${selected}" is incorrect or already found. Try again!`;
    soundError.play().catch(() => {});
    clearActiveLetters();
  }
}

function clearActiveLetters(playSound = true) {
  const letters = circle.querySelectorAll(".letter.active");
  letters.forEach(l => l.classList.remove("active"));
  selected = "";
  selectedLetterElements = [];
  updateSelectedWord();
  if(playSound) {
      soundError.play().catch(() => {});
  }
}


// --- Update pillboxes ---
function updatePills(){
  const pills = pillboxes.children;
  levels[currentLevel].words.forEach((w, i) => {
    if(foundWords.has(w)) {
      pills[i].textContent = w;
      pills[i].classList.add("completed");
    }
  });
}

// --- Show reward modal ---
function showReward(){
  // Award diamonds when the level is completed
  updateDiamonds(diamondReward);
  soundReward.play().catch(() => {});

  previewImage.src = imageUrls[currentLevel];
  previewText.textContent = levelDescriptions[currentLevel];
  rewardModal.style.display = "block";

  for(let i = 0; i < 5; i++) {
    setTimeout(launchFireworks, i * 300);
  }
  animateFireworks();
}

function closeRewardModal(){
  rewardModal.style.display = "none";
}

// --- Buttons ---
btnHint.addEventListener("click", () => {
  if (hintsUsed >= hints.length) {
    hintBox.textContent = "No more hints for this level. 🤔";
    soundError.play().catch(() => {});
    return;
  }
  hintBox.textContent = "Hint: " + hints[hintsUsed];
  hintsUsed++;
});

btnClear.addEventListener("click", clearActiveLetters);

btnNext.addEventListener("click", () => {
  localStorage.setItem("cricketWordCity_level_" + currentLevel, "completed");
  if(currentLevel + 1 < levels.length){
    currentLevel++;
    startLevel(currentLevel);
  } else {
    alert("🎉 You completed all levels! Congrats! 🎉");
    showLevelSelect();
  }
});

// --- Reset game ---
function resetGame(){
  foundWords.clear();
  selected = "";
  updateSelectedWord();
  hintBox.textContent = "";
  resultBox.textContent = "";
  clearActiveLetters(false);
  btnNext.disabled = true;
  if (dragCtx) {
    dragCtx.clearRect(0, 0, dragCanvas.width, dragCanvas.height);
  }
  const pills = pillboxes.querySelectorAll(".pill");
  pills.forEach(pill => pill.classList.remove("completed"));
}

// --- Utility Functions ---
function hideAllScreens() {
  mainMenu.style.display = "none";
  levelSelect.style.display = "none";
  gameContainer.style.display = "none";
}
function getSavedProgress() {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (localStorage.getItem("cricketWordCity_level_" + i) === "completed") {
      return i + 1;
    }
  }
  return 0;
}

// --- Initialize ---
let hints = [];
