// Game state variables
let userDiamonds = 1000;
let userPlayers = []; // List to store owned players
const packCost = 1000;
const teamPacks = [
    { name: "India", players: ["IND-01", "IND-02", "IND-03", "IND-04", "IND-05", "IND-06", "IND-07", "IND-08", "IND-09", "IND-10", "IND-11", "IND-12", "IND-13", "IND-14", "IND-15"] },
    { name: "Australia", players: ["AUS-01", "AUS-02", "AUS-03", "AUS-04", "AUS-05", "AUS-06", "AUS-07", "AUS-08", "AUS-09", "AUS-10", "AUS-11", "AUS-12", "AUS-13", "AUS-14", "AUS-15"] },
    { name: "England", players: ["ENG-01", "ENG-02", "ENG-03", "ENG-04", "ENG-05", "ENG-06", "ENG-07", "ENG-08", "ENG-09", "ENG-10", "ENG-11", "ENG-12", "ENG-13", "ENG-14", "ENG-15"] },
    { name: "Pakistan", players: ["PAK-01", "PAK-02", "PAK-03", "PAK-04", "PAK-05", "PAK-06", "PAK-07", "PAK-08", "PAK-09", "PAK-10", "PAK-11", "PAK-12", "PAK-13", "PAK-14", "PAK-15"] },
    { name: "South Africa", players: ["SA-01", "SA-02", "SA-03", "SA-04", "SA-05", "SA-06", "SA-07", "SA-08", "SA-09", "SA-10", "SA-11", "SA-12", "SA-13", "SA-14", "SA-15"] },
    { name: "New Zealand", players: ["NZ-01", "NZ-02", "NZ-03", "NZ-04", "NZ-05", "NZ-06", "NZ-07", "NZ-08", "NZ-09", "NZ-10", "NZ-11", "NZ-12", "NZ-13", "NZ-14", "NZ-15"] },
    { name: "West Indies", players: ["WI-01", "WI-02", "WI-03", "WI-04", "WI-05", "WI-06", "WI-07", "WI-08", "WI-09", "WI-10", "WI-11", "WI-12", "WI-13", "WI-14", "WI-15"] },
    { name: "Sri Lanka", players: ["SL-01", "SL-02", "SL-03", "SL-04", "SL-05", "SL-06", "SL-07", "SL-08", "SL-09", "SL-10", "SL-11", "SL-12", "SL-13", "SL-14", "SL-15"] }
];

const startingPlayers = [
    "IND-11", "AUS-11", "ENG-11", "PAK-11", "SA-11", "NZ-11", "WI-11", "SL-11", "IND-12", "PAK-12", "AUS-12"
];

let allPlayersData = [];

// DOM elements
const diamondCountElement = document.getElementById('diamond-count');
const navButtons = document.querySelectorAll('.nav-button');
const pages = document.querySelectorAll('.page');
const myTeamGrid = document.getElementById('my-team-grid');
const packGrid = document.getElementById('pack-grid');
const cardModal = document.getElementById('card-modal');
const closeButton = document.querySelector('.close-button');
const playerCardContainer = document.getElementById('player-card-container');
const collectButton = document.getElementById('collect-button');
const claimButtons = document.querySelectorAll('.claim-reward-button');

// Function to update the diamond count display
function updateDiamondCount() {
    diamondCountElement.textContent = userDiamonds;
}

// Function to create the HTML for a player card
function createPlayerCardHTML(player) {
    if (!player) return '';
    return `
        <div class="player-card">
            <img src="${player.photo}" alt="${player.name}" />
            <div class="ovr">${player.ovr}</div>
            <h3>${player.name}</h3>
            <p>${player.country} | ${player.role}</p>
        </div>
    `;
}

// Function to render the player cards in "My Team"
function renderMyTeam() {
    myTeamGrid.innerHTML = '';
    userPlayers.forEach(playerId => {
        const player = allPlayersData.find(p => p.id === playerId);
        if (player) {
            myTeamGrid.innerHTML += createPlayerCardHTML(player);
        }
    });
}

// Function to render the market packs
function renderMarketPacks() {
    packGrid.innerHTML = '';
    teamPacks.forEach(pack => {
        const packItem = document.createElement('div');
        packItem.className = 'pack-item';
        packItem.dataset.pack = pack.name;
        packItem.innerHTML = `
            <img src="images/pack-icon.png" alt="${pack.name} Pack" />
            <h3>${pack.name} Pack</h3>
            <p>1000 💎</p>
        `;
        packItem.addEventListener('click', () => buyPack(pack.name));
        packGrid.appendChild(packItem);
    });
}

// Function to handle buying a pack
function buyPack(packName) {
    if (userDiamonds >= packCost) {
        userDiamonds -= packCost;
        updateDiamondCount();
        
        const pack = teamPacks.find(p => p.name === packName);
        const randomPlayerId = pack.players[Math.floor(Math.random() * pack.players.length)];
        const unlockedPlayer = allPlayersData.find(p => p.id === randomPlayerId);

        playerCardContainer.innerHTML = createPlayerCardHTML(unlockedPlayer);
        cardModal.style.display = 'flex';
        collectButton.dataset.playerId = unlockedPlayer.id;

    } else {
        alert('Not enough Diamonds!');
    }
}

// Event listener for the "Collect Player" button
collectButton.addEventListener('click', () => {
    const playerId = collectButton.dataset.playerId;
    if (playerId) {
        userPlayers.push(playerId);
        alert('Player added to your team!');
    }
    cardModal.style.display = 'none';
    renderMyTeam(); // Update My Team view after collecting
});

// Event listener to close the modal
closeButton.addEventListener('click', () => {
    cardModal.style.display = 'none';
});

// Close modal if user clicks outside of it
window.addEventListener('click', (event) => {
    if (event.target === cardModal) {
        cardModal.style.display = 'none';
    }
});

// Navigation logic
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Deactivate all buttons and hide all pages
        navButtons.forEach(btn => btn.classList.remove('active'));
        pages.forEach(page => page.classList.remove('active-page'));
        
        // Activate the clicked button and show the corresponding page
        button.classList.add('active');
        const targetPage = document.getElementById(button.dataset.page + '-page');
        targetPage.classList.add('active-page');
    });
});

// Function to handle claiming challenge rewards
claimButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const rewardText = event.target.textContent;
        const rewardAmount = parseInt(rewardText.match(/\d+/)[0]);
        userDiamonds += rewardAmount;
        updateDiamondCount();
        alert(`You've earned ${rewardAmount} Diamonds!`);
        event.target.disabled = true; // Disable button after claiming
    });
});

// Initialize the game state and UI
function initializeGame() {
    // Add starting players to the user's team
    userPlayers = [...startingPlayers];
    updateDiamondCount();
    renderMyTeam();
    renderMarketPacks();
}
const imageUrls = [
      "https://i.postimg.cc/BLVMxPHM/image.jpg",
      "https://i.postimg.cc/HJ3SkhxG/image.jpg",
      "https://i.postimg.cc/qhR1hxhN/image.jpg",
      "https://i.postimg.cc/JHHKK7Qm/image.jpg",
      "https://i.postimg.cc/WdvS6vqL/image.jpg",
      "https://i.postimg.cc/8s7yTwg3/image.jpg",
      "https://i.postimg.cc/PN0SJZtq/image.jpg",
      "https://i.postimg.cc/JGJPknn5/image.jpg",
      "https://i.postimg.cc/TKJ0t4ny/image.jpg",
      "https://i.postimg.cc/Ty29FJct/image.jpg"
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
let selected = "";
let foundWords = new Set();
let hintsUsed = 0;

// Dragging related variables
let isDragging = false;
let selectedLetterElements = [];
let dragCanvas;
let dragCtx;


// DOM Elements
const splashScreen = document.getElementById("splash-screen");
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
let btnShuffle;
const rewardModal = document.getElementById("rewardModal");
const previewImage = document.getElementById("preview-image");
const previewText = document.getElementById("preview-text");

// Sounds
const soundSelect = new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg");
const soundComplete = new Audio("https://actions.google.com/sounds/v1/cartoon/concussive_hit_guitar_boing.ogg");
const soundError = new Audio("https://actions.google.com/sounds/v1/foley/whoosh_foley.ogg");
const soundShuffle = new Audio("https://actions.google.com/sounds/v1/ui/swipe_to_select.ogg");

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
    this.hue = Math.random() * 360;
  }
  update() {
    if (!this.exploded) {
      this.y -= this.speed;
      fwCtx.beginPath();
      fwCtx.arc(this.x, this.y + 15, 2, 0, Math.PI * 2);
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
      this.particles.push(new Particle(this.x, this.y, this.hue));
    }
  }
  draw() {
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
    this.speedX = (Math.random() - 0.5) * 8;
    this.speedY = (Math.random() - 0.5) * 8;
    this.alpha = 1;
    this.size = 3 + Math.random() * 2;
    this.gravity = 0.05;
    this.done = false;
    this.color = `hsl(${hue + (Math.random() * 60 - 30)}, 100%, 60%)`;
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

// --- Splash Screen Timer ---
setTimeout(() => {
  splashScreen.style.display = "none";
  initializeGame();
}, 3000);

// --- Save/Load progress helper ---
function getSavedProgress() {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (localStorage.getItem("cricketWordCity_level_" + i) === "completed") {
      return i + 1;
    }
  }
  return 0;
}

// --- Show Level Select ---
function showLevelSelect(){
  levelSelect.innerHTML = "";
  gameContainer.style.display = "none";
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
  levelSelect.style.display = "none";
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

// --- Check word function (now called automatically on drag end) ---
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
      // Reward the user 500 diamonds upon completion of a level
      const diamondsToAdd = 500;
      // You need to implement the addDiamonds function on your server side
      // For now, we'll use an alert to simulate the reward
      alert(`Congratulations! You earned ${diamondsToAdd} diamonds for completing this level!`);
      showReward();
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
  }
   else {
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

// --- Initialize ---
let hints = [];
function initializeGame() {
  showLevelSelect();
}

// Player Data (directly in the script for this example)
allPlayersData = [
    // INDIA
    { id: "IND-01", name: "Virat Kohli", ovr: 94, country: "India", role: "Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Virat_Kohli_at_ICC_Awards_2017.jpg" },
    { id: "IND-02", name: "Jasprit Bumrah", ovr: 92, country: "India", role: "Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Jasprit_Bumrah.jpg" },
    { id: "IND-03", name: "Hardik Pandya", ovr: 91, country: "India", role: "All-Rounder", photo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Hardik_Pandya_%28cropped%29.jpg" },
    { id: "IND-04", name: "Suryakumar Yadav", ovr: 90, country: "India", role: "Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Suryakumar_Yadav_%281%29.jpg" },
    { id: "IND-05", name: "Mohammed Siraj", ovr: 88, country: "India", role: "Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Mohammed_Siraj.jpg" },
    { id: "IND-06", name: "Shubman Gill", ovr: 85, country: "India", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Shubman_Gill_%282%29.jpg" },
    { id: "IND-07", name: "Ishan Kishan", ovr: 84, country: "India", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/b/be/Ishan_Kishan_T20I_vs_SL_2021.jpg" },
    { id: "IND-08", name: "Yashasvi Jaiswal", ovr: 83, country: "India", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Yashasvi_Jaiswal_%28cropped%29.jpg" },
    { id: "IND-09", name: "Ruturaj Gaikwad", ovr: 82, country: "India", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Ruturaj_Gaikwad_%281%29.jpg" },
    { id: "IND-10", name: "Ravi Bishnoi", ovr: 81, country: "India", role: "Emerging Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Ravi_Bishnoi_in_2022.jpg" },
    { id: "IND-11", name: "Arshdeep Singh", ovr: 80, country: "India", role: "Emerging Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Arshdeep_Singh_%28cropped%29.jpg" },
    { id: "IND-12", name: "Avesh Khan", ovr: 79, country: "India", role: "Emerging Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Avesh_Khan_%28cropped%29.jpg" },
    { id: "IND-13", name: "Sanju Samson", ovr: 78, country: "India", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Sanju_Samson_%28cropped%29.jpg" },
    { id: "IND-14", name: "Umran Malik", ovr: 77, country: "India", role: "Emerging Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Umran_Malik_%28cropped%29.jpg" },
    { id: "IND-15", name: "Tilak Varma", ovr: 76, country: "India", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/5/52/Tilak_Varma_during_T20I_series_against_West_Indies_in_2023.jpg" },
    // AUSTRALIA
    { id: "AUS-01", name: "David Warner", ovr: 93, country: "Australia", role: "Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/b/b0/David_Warner.jpg" },
    { id: "AUS-02", name: "Pat Cummins", ovr: 95, country: "Australia", role: "Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Pat_Cummins_at_the_ICC_Cricket_World_Cup_2019.jpg" },
    { id: "AUS-03", name: "Glenn Maxwell", ovr: 90, country: "Australia", role: "All-Rounder", photo: "https://upload.wikimedia.org/wikipedia/commons/3/36/Glenn_Maxwell_%28cropped%29.jpg" },
    { id: "AUS-04", name: "Mitchell Starc", ovr: 89, country: "Australia", role: "Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/6/63/Mitchell_Starc_at_the_ICC_Cricket_World_Cup_2019.jpg" },
    { id: "AUS-05", name: "Josh Hazlewood", ovr: 87, country: "Australia", role: "Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Josh_Hazlewood_at_the_2019_Cricket_World_Cup.jpg" },
    { id: "AUS-06", name: "Tim David", ovr: 85, country: "Australia", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Tim_David_%28cropped%29.jpg" },
    { id: "AUS-07", name: "Travis Head", ovr: 84, country: "Australia", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Travis_Head_2023_%28cropped%29.jpg" },
    { id: "AUS-08", name: "Matthew Short", ovr: 83, country: "Australia", role: "Emerging All-Rounder", photo: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Matthew_Short_%28cropped%29.jpg" },
    { id: "AUS-09", name: "Adam Zampa", ovr: 82, country: "Australia", role: "Emerging Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/8/87/Adam_Zampa_%28cropped%29.jpg" },
    { id: "AUS-10", name: "Spencer Johnson", ovr: 81, country: "Australia", role: "Emerging Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Spencer_Johnson_%28cropped%29.jpg" },
    { id: "AUS-11", name: "Aaron Hardie", ovr: 80, country: "Australia", role: "Emerging All-Rounder", photo: "https://upload.wikimedia.org/wikipedia/commons/0/05/Aaron_Hardie_%28cropped%29.jpg" },
    { id: "AUS-12", name: "Nathan Ellis", ovr: 79, country: "Australia", role: "Emerging Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Nathan_Ellis_%28cropped%29.jpg" },
    { id: "AUS-13", name: "Jake Fraser-McGurk", ovr: 78, country: "Australia", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Jake_Fraser-McGurk_in_2024.jpg" },
    { id: "AUS-14", name: "Chris Green", ovr: 77, country: "Australia", role: "Emerging All-Rounder", photo: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Chris_Green_%28cricketer%29.jpg" },
    { id: "AUS-15", name: "Tanveer Sangha", ovr: 76, country: "Australia", role: "Emerging Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Tanveer_Sangha_%28cropped%29.jpg" },
    // ENGLAND
    { id: "ENG-01", name: "Jos Buttler", ovr: 94, country: "England", role: "Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Jos_Buttler_-_2022_%28cropped%29.jpg" },
    { id: "ENG-02", name: "Jonny Bairstow", ovr: 91, country: "England", role: "Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Jonny_Bairstow_2022.jpg" },
    { id: "ENG-03", name: "Adil Rashid", ovr: 90, country: "England", role: "Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Adil_Rashid_%28cropped%29.jpg" },
    { id: "ENG-04", name: "Sam Curran", ovr: 89, country: "England", role: "All-Rounder", photo: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Sam_Curran_during_the_ICC_T20_World_Cup_2022.jpg" },
    { id: "ENG-05", name: "Jofra Archer", ovr: 88, country: "England", role: "Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Jofra_Archer.jpg" },
    { id: "ENG-06", name: "Phil Salt", ovr: 85, country: "England", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Phil_Salt_2023.jpg" },
    { id: "ENG-07", name: "Will Jacks", ovr: 84, country: "England", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Will_Jacks_at_the_2023_World_Cup.jpg" },
    { id: "ENG-08", name: "Harry Brook", ovr: 83, country: "England", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Harry_Brook_%28cropped%29.jpg" },
    { id: "ENG-09", name: "Chris Jordan", ovr: 82, country: "England", role: "Emerging Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Chris_Jordan_at_the_2019_Cricket_World_Cup.jpg" },
    { id: "ENG-10", name: "Ben Duckett", ovr: 81, country: "England", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/3/30/Ben_Duckett_%28cropped%29.jpg" },
    { id: "ENG-11", name: "Gus Atkinson", ovr: 80, country: "England", role: "Emerging Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Gus_Atkinson_%28cricketer%29.jpg" },
    { id: "ENG-12", name: "Tymal Mills", ovr: 79, country: "England", role: "Emerging Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Tymal_Mills_%28cropped%29.jpg" },
    { id: "ENG-13", name: "Reece Topley", ovr: 78, country: "England", role: "Emerging Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Reece_Topley_%28cropped%29.jpg" },
    { id: "ENG-14", name: "Brydon Carse", ovr: 77, country: "England", role: "Emerging Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Brydon_Carse_in_2023.jpg" },
    { id: "ENG-15", name: "Luke Wood", ovr: 76, country: "England", role: "Emerging Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/8/86/Luke_Wood_%28cropped%29.jpg" },
    // PAKISTAN
    { id: "PAK-01", name: "Babar Azam", ovr: 93, country: "Pakistan", role: "Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Babar_Azam.jpg" },
    { id: "PAK-02", name: "Shaheen Afridi", ovr: 91, country: "Pakistan", role: "Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/0/07/Shaheen_Afridi_at_the_2021_T20_World_Cup_vs_India.jpg" },
    { id: "PAK-03", name: "Mohammad Rizwan", ovr: 90, country: "Pakistan", role: "Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Mohammad_Rizwan_%28cropped%29.jpg" },
    { id: "PAK-04", name: "Shadab Khan", ovr: 89, country: "Pakistan", role: "All-Rounder", photo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Shadab_Khan_%28cropped%29.jpg" },
    { id: "PAK-05", name: "Haris Rauf", ovr: 88, country: "Pakistan", role: "Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Haris_Rauf_%28cropped%29.jpg" },
    { id: "PAK-06", name: "Fakhar Zaman", ovr: 85, country: "Pakistan", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Fakhar_Zaman.jpg" },
    { id: "PAK-07", name: "Iftikhar Ahmed", ovr: 84, country: "Pakistan", role: "Emerging All-Rounder", photo: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Iftikhar_Ahmed_%28cropped%29.jpg" },
    { id: "PAK-08", name: "Saim Ayub", ovr: 83, country: "Pakistan", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Saim_Ayub_2023.jpg" },
    { id: "PAK-09", name: "Abrar Ahmed", ovr: 82, country: "Pakistan", role: "Emerging Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/3/30/Abrar_Ahmed_%28cricketer%29.jpg" },
    { id: "PAK-10", name: "Zaman Khan", ovr: 81, country: "Pakistan", role: "Emerging Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Zaman_Khan_%28cricketer%29.jpg" },
    { id: "PAK-11", name: "Usama Mir", ovr: 80, country: "Pakistan", role: "Emerging Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Usama_Mir_%28cropped%29.jpg" },
    { id: "PAK-12", name: "Azam Khan", ovr: 79, country: "Pakistan", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Azam_Khan_%28cricketer%29.jpg" },
    { id: "PAK-13", name: "Mohammad Wasim Jr.", ovr: 78, country: "Pakistan", role: "Emerging All-Rounder", photo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Mohammad_Wasim_Jr..jpg" },
    { id: "PAK-14", name: "Ihsanullah", ovr: 77, country: "Pakistan", role: "Emerging Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Ihsanullah_%28cricketer%29.jpg" },
    { id: "PAK-15", name: "Abbas Afridi", ovr: 76, country: "Pakistan", role: "Emerging All-Rounder", photo: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Abbas_Afridi_%28cricketer%29.jpg" },
    // SOUTH AFRICA
    { id: "SA-01", name: "Quinton de Kock", ovr: 92, country: "South Africa", role: "Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/2/23/Quinton_de_Kock_2023_%28cropped%29.jpg" },
    { id: "SA-02", name: "Kagiso Rabada", ovr: 91, country: "South Africa", role: "Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Kagiso_Rabada_at_the_2019_Cricket_World_Cup.jpg" },
    { id: "SA-03", name: "Anrich Nortje", ovr: 90, country: "South Africa", role: "Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Anrich_Nortje_2022.jpg" },
    { id: "SA-04", name: "Aiden Markram", ovr: 89, country: "South Africa", role: "All-Rounder", photo: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Aiden_Markram_%28cropped%29.jpg" },
    { id: "SA-05", name: "Heinrich Klaasen", ovr: 88, country: "South Africa", role: "Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Heinrich_Klaasen_%28cropped%29.jpg" },
    { id: "SA-06", name: "Rassie van der Dussen", ovr: 85, country: "South Africa", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Rassie_van_der_Dussen_%28cropped%29.jpg" },
    { id: "SA-07", name: "Marco Jansen", ovr: 84, country: "South Africa", role: "Emerging All-Rounder", photo: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Marco_Jansen_%28cropped%29.jpg" },
    { id: "SA-08", name: "Tristan Stubbs", ovr: 83, country: "South Africa", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Tristan_Stubbs_%28cropped%29.jpg" },
    { id: "SA-09", name: "Gerald Coetzee", ovr: 82, country: "South Africa", role: "Emerging Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Gerald_Coetzee_%28cropped%29.jpg" },
    { id: "SA-10", name: "Lungi Ngidi", ovr: 81, country: "South Africa", role: "Emerging Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Lungi_Ngidi_%28cropped%29.jpg" },
    { id: "SA-11", name: "Ryan Rickelton", ovr: 80, country: "South Africa", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Ryan_Rickelton_%28cropped%29.jpg" },
    { id: "SA-12", name: "Keshav Maharaj", ovr: 79, country: "South Africa", role: "Emerging Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Keshav_Maharaj_%28cropped%29.jpg" },
    { id: "SA-13", name: "Bjorn Fortuin", ovr: 78, country: "South Africa", role: "Emerging Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Bjorn_Fortuin_%28cropped%29.jpg" },
    { id: "SA-14", name: "Tabraiz Shamsi", ovr: 77, country: "South Africa", role: "Emerging Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Tabraiz_Shamsi_%28cropped%29.jpg" },
    { id: "SA-15", name: "David Miller", ovr: 76, country: "South Africa", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/f/f6/David_Miller_%28cricketer%29.jpg" },
    // NEW ZEALAND
    { id: "NZ-01", name: "Kane Williamson", ovr: 93, country: "New Zealand", role: "Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Kane_Williamson_2019_%28cropped%29.jpg" },
    { id: "NZ-02", name: "Devon Conway", ovr: 90, country: "New Zealand", role: "Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Devon_Conway_%28cropped%29.jpg" },
    { id: "NZ-03", name: "Trent Boult", ovr: 92, country: "New Zealand", role: "Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/3/36/Trent_Boult_at_the_2019_Cricket_World_Cup.jpg" },
    { id: "NZ-04", name: "Glenn Phillips", ovr: 89, country: "New Zealand", role: "All-Rounder", photo: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Glenn_Phillips_%28cricketer%29_2022.jpg" },
    { id: "NZ-05", name: "Daryl Mitchell", ovr: 88, country: "New Zealand", role: "All-Rounder", photo: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Daryl_Mitchell_%28cropped%29.jpg" },
    { id: "NZ-06", name: "Finn Allen", ovr: 85, country: "New Zealand", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Finn_Allen_%28cropped%29.jpg" },
    { id: "NZ-07", name: "Rachin Ravindra", ovr: 84, country: "New Zealand", role: "Emerging All-Rounder", photo: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Rachin_Ravindra_%28cropped%29.jpg" },
    { id: "NZ-08", name: "Mitchell Santner", ovr: 83, country: "New Zealand", role: "Emerging All-Rounder", photo: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Mitchell_Santner_at_the_2019_Cricket_World_Cup.jpg" },
    { id: "NZ-09", name: "Mark Chapman", ovr: 82, country: "New Zealand", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/2/23/Mark_Chapman_%28cropped%29.jpg" },
    { id: "NZ-10", name: "Tim Southee", ovr: 81, country: "New Zealand", role: "Emerging Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Tim_Southee_%28cropped%29.jpg" },
    { id: "NZ-11", name: "Adam Milne", ovr: 80, country: "New Zealand", role: "Emerging Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Adam_Milne_in_2015.jpg" },
    { id: "NZ-12", name: "Kyle Jamieson", ovr: 79, country: "New Zealand", role: "Emerging All-Rounder", photo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Kyle_Jamieson_%28cropped%29.jpg" },
    { id: "NZ-13", name: "Ish Sodhi", ovr: 78, country: "New Zealand", role: "Emerging Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Ish_Sodhi_%28cropped%29.jpg" },
    { id: "NZ-14", name: "Ben Lister", ovr: 77, country: "New Zealand", role: "Emerging Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Ben_Lister_%28cropped%29.jpg" },
    { id: "NZ-15", name: "Jacob Duffy", ovr: 76, country: "New Zealand", role: "Emerging Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Jacob_Duffy_%28cropped%29.jpg" },
    // WEST INDIES
    { id: "WI-01", name: "Nicholas Pooran", ovr: 94, country: "West Indies", role: "Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/3/36/Nicholas_Pooran_%28cropped%29.jpg" },
    { id: "WI-02", name: "Andre Russell", ovr: 92, country: "West Indies", role: "All-Rounder", photo: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Andre_Russell_%28cropped%29.jpg" },
    { id: "WI-03", name: "Jason Holder", ovr: 91, country: "West Indies", role: "All-Rounder", photo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Jason_Holder_at_the_2019_Cricket_World_Cup.jpg" },
    { id: "WI-04", name: "Rovman Powell", ovr: 90, country: "West Indies", role: "Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Rovman_Powell_%28cropped%29.jpg" },
    { id: "WI-05", name: "Shimron Hetmyer", ovr: 89, country: "West Indies", role: "Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Shimron_Hetmyer_%28cropped%29.jpg" },
    { id: "WI-06", name: "Shai Hope", ovr: 85, country: "West Indies", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Shai_Hope_%28cropped%29.jpg" },
    { id: "WI-07", name: "Alzarri Joseph", ovr: 84, country: "West Indies", role: "Emerging Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Alzarri_Joseph_%28cropped%29.jpg" },
    { id: "WI-08", name: "Romario Shepherd", ovr: 83, country: "West Indies", role: "Emerging All-Rounder", photo: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Romario_Shepherd_%28cropped%29.jpg" },
    { id: "WI-09", name: "Akeal Hosein", ovr: 82, country: "West Indies", role: "Emerging Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Akeal_Hosein_%28cropped%29.jpg" },
    { id: "WI-10", name: "Brandon King", ovr: 81, country: "West Indies", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Brandon_King_%28cricketer%29.jpg" },
    { id: "WI-11", name: "Johnson Charles", ovr: 80, country: "West Indies", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/3/36/Johnson_Charles_%28cropped%29.jpg" },
    { id: "WI-12", name: "Kyle Mayers", ovr: 79, country: "West Indies", role: "Emerging All-Rounder", photo: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Kyle_Mayers_%28cropped%29.jpg" },
    { id: "WI-13", name: "Gudakesh Motie", ovr: 78, country: "West Indies", role: "Emerging Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/0/07/Gudakesh_Motie_%28cropped%29.jpg" },
    { id: "WI-14", name: "Sherfane Rutherford", ovr: 77, country: "West Indies", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Sherfane_Rutherford_%28cropped%29.jpg" },
    { id: "WI-15", name: "Oshane Thomas", ovr: 76, country: "West Indies", role: "Emerging Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Oshane_Thomas_%28cropped%29.jpg" },
    // SRI LANKA
    { id: "SL-01", name: "Kusal Mendis", ovr: 92, country: "Sri Lanka", role: "Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Kusal_Mendis_%28cropped%29.jpg" },
    { id: "SL-02", name: "Wanindu Hasaranga", ovr: 91, country: "Sri Lanka", role: "All-Rounder", photo: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Wanindu_Hasaranga_%28cropped%29.jpg" },
    { id: "SL-03", name: "Pathum Nissanka", ovr: 90, country: "Sri Lanka", role: "Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Pathum_Nissanka_%28cropped%29.jpg" },
    { id: "SL-04", name: "Dhananjaya de Silva", ovr: 89, country: "Sri Lanka", role: "All-Rounder", photo: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Dhananjaya_de_Silva_at_the_2019_Cricket_World_Cup.jpg" },
    { id: "SL-05", name: "Maheesh Theekshana", ovr: 88, country: "Sri Lanka", role: "Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Maheesh_Theekshana_%28cropped%29.jpg" },
    { id: "SL-06", name: "Charith Asalanka", ovr: 85, country: "Sri Lanka", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/3/36/Charith_Asalanka_%28cropped%29.jpg" },
    { id: "SL-07", name: "Dasun Shanaka", ovr: 84, country: "Sri Lanka", role: "Emerging All-Rounder", photo: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Dasun_Shanaka_at_the_2019_Cricket_World_Cup.jpg" },
    { id: "SL-08", name: "Sadeera Samarawickrama", ovr: 83, country: "Sri Lanka", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Sadeera_Samarawickrama_%28cropped%29.jpg" },
    { id: "SL-09", name: "Dushmantha Chameera", ovr: 82, country: "Sri Lanka", role: "Emerging Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Dushmantha_Chameera_%28cropped%29.jpg" },
    { id: "SL-10", name: "Matheesha Pathirana", ovr: 81, country: "Sri Lanka", role: "Emerging Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Matheesha_Pathirana_%28cropped%29.jpg" },
    { id: "SL-11", name: "Dilshan Madushanka", ovr: 80, country: "Sri Lanka", role: "Emerging Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Dilshan_Madushanka_%28cropped%29.jpg" },
    { id: "SL-12", name: "Nuwan Thushara", ovr: 79, country: "Sri Lanka", role: "Emerging Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Nuwan_Thushara_%28cropped%29.jpg" },
    { id: "SL-13", name: "Chamika Karunaratne", ovr: 78, country: "Sri Lanka", role: "Emerging All-Rounder", photo: "https://upload.wikimedia.org/wikipedia/commons/2/23/Chamika_Karunaratne_%28cropped%29.jpg" },
    { id: "SL-14", name: "Ashen Bandara", ovr: 77, country: "Sri Lanka", role: "Emerging Batsman", photo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Ashen_Bandara_%28cropped%29.jpg" },
    { id: "SL-15", name: "Binura Fernando", ovr: 76, country: "Sri Lanka", role: "Emerging Fast Bowler", photo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Binura_Fernando_%28cropped%29.jpg" },
];
// Initialize the game when the page loads
initializeGame();
