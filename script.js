const storyDiv = document.getElementById("story");
const choicesDiv = document.getElementById("choices");
const planetDiv = document.getElementById("planet");
const lifeDiv = document.getElementById("lifeStatus");
const restartBtn = document.getElementById("restartBtn");

let planet = {};
let history = [];

// Initialize planet
function initPlanet() {
  planet = { water: 0, land: 0, atmosphere: 0, life: 0 };
  history = [];
  storyDiv.innerText = "Welcome! Build a planet that can support life. Choose wisely!";
  updateLifeStatus();
  drawPlanet();
  showChoices(generateChoices());
}

restartBtn.onclick = initPlanet;

// Draw planet grid
function drawPlanet() {
  planetDiv.innerHTML = "";
  const total = 25;
  for (let i = 0; i < total; i++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    if (i < planet.water) tile.style.background = "blue";
    else if (i < planet.water + planet.land) tile.style.background = "green";
    else if (i < planet.water + planet.land + planet.atmosphere) tile.style.background = "lightblue";
    else tile.style.background = "gray";
    planetDiv.appendChild(tile);
  }
}

// Update life status
function updateLifeStatus() {
  planet.life = Math.min(planet.water, planet.land, Math.floor(planet.atmosphere / 2));
  lifeDiv.innerText = `Life Support Level: ${planet.life} / 10`;
}

// Generate story text (AI-style emulation)
function generateStoryText(action) {
  const texts = [
    `You chose to ${action}. The planet reacts unpredictably.`,
    `A mysterious force shapes the planet as you ${action}.`,
    `By ${action}, the planet's elements shift and change.`
  ];
  return texts[Math.floor(Math.random() * texts.length)];
}

// Generate a random event
function generateRandomEvent() {
  const events = [
    {
      text: "A meteor shower strikes part of your planet! Some land is reshaped.",
      effect: () => { planet.land = Math.max(0, planet.land - 3); }
    },
    {
      text: "A solar flare energizes the atmosphere, increasing life potential!",
      effect: () => { planet.atmosphere = Math.min(25, planet.atmosphere + 3); }
    },
    {
      text: "Volcanic eruptions create new land masses.",
      effect: () => { planet.land = Math.min(25, planet.land + 4); }
    },
    {
      text: "A mysterious alien seed lands, encouraging the growth of life.",
      effect: () => { planet.life = Math.min(10, planet.life + 2); }
    },
    {
      text: "Unpredictable weather redistributes water across the planet.",
      effect: () => { planet.water = Math.min(25, planet.water + 2); }
    }
  ];

  // 40% chance to trigger an event
  if (Math.random() < 0.4) {
    const event = events[Math.floor(Math.random() * events.length)];
    event.effect?.();
    return event.text;
  }
  return null;
}

// Handle choice
function handleChoice(choice) {
  choice.effect?.();
  updateLifeStatus();
  drawPlanet();
  
  const story = generateStoryText(choice.text);
  const eventText = generateRandomEvent();
  storyDiv.innerText = eventText ? `${story}\n\nEvent: ${eventText}` : story;
  history.push({ choice: choice.text, story: storyDiv.innerText });

  showChoices(choice.nextChoices || generateChoices());
}

// Generate choices dynamically
function generateChoices() {
  return [
    {
      text: "Add water",
      effect: () => { planet.water = Math.min(planet.water + 5, 25); }
    },
    {
      text: "Add land",
      effect: () => { planet.land = Math.min(planet.land + 5, 25); }
    },
    {
      text: "Add atmosphere",
      effect: () => { planet.atmosphere = Math.min(planet.atmosphere + 5, 25); }
    },
    {
      text: "Check life potential",
      effect: () => { /* life auto-updates */ }
    }
  ];
}

// Show choices as buttons
function showChoices(choices) {
  choicesDiv.innerHTML = "";
  choices.forEach(c => {
    const btn = document.createElement("button");
    btn.innerText = c.text;
    btn.onclick = () => handleChoice(c);
    choicesDiv.appendChild(btn);
  });
}

// Start game
initPlanet();
