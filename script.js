// Game state variables
let userDiamonds = 500;
const packCost = 50;
let allPlayers = [];

// DOM elements
const diamondCountElement = document.getElementById('diamond-count');
const openPackButton = document.getElementById('open-pack-button');
const cardModal = document.getElementById('card-modal');
const closeButton = document.querySelector('.close-button');
const playerCardContainer = document.getElementById('player-card-container');

// Function to update the diamond count display
function updateDiamondCount() {
    diamondCountElement.textContent = userDiamonds;
}

// Function to fetch player data from JSON file
async function fetchPlayers() {
    try {
        const response = await fetch('players.json');
        allPlayers = await response.json();
    } catch (error) {
        console.error('Error fetching player data:', error);
    }
}

// Function to get a random player from the data
function getRandomPlayer() {
    const randomIndex = Math.floor(Math.random() * allPlayers.length);
    return allPlayers[randomIndex];
}

// Function to create the HTML for a player card
function createPlayerCardHTML(player) {
    return `
        <div class="player-card">
            <img src="${player.photo}" alt="${player.name}" />
            <div class="ovr">${player.ovr}</div>
            <h3>${player.name}</h3>
            <p>${player.country} | ${player.role}</p>
        </div>
    `;
}

// Event listener for the "Open Pack" button
openPackButton.addEventListener('click', () => {
    if (userDiamonds >= packCost) {
        userDiamonds -= packCost;
        updateDiamondCount();

        const randomPlayer = getRandomPlayer();
        playerCardContainer.innerHTML = createPlayerCardHTML(randomPlayer);
        cardModal.style.display = 'flex';
    } else {
        alert('Not enough Diamonds!');
    }
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

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    fetchPlayers();
    updateDiamondCount();
});
