import { loadScene, clearPreviousScene } from "./scenes.js";
import { collectedRelics } from "./inventory.js";

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Reset inventory on game start

function resetInventory() {
  collectedRelics.length = 0; // Reset the array by clearing its contents, not redeclaring it

  const inventoryItems = document.querySelectorAll(".inventory-item");

  inventoryItems.forEach((item) => {
    item.style.backgroundImage = "none";
    item.classList.remove("collected", "glow", "relicFloat");
  });

  const inventory = document.getElementById("inventory");
  inventory.classList.remove("glow-wave");

  console.log("Inventory after reset:", inventoryItems); // debug log
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Reset challenges on game start

function resetChallenges() {
  // Reset puzzle
  const puzzlePiecesContainer = document.getElementById("puzzle-pieces");
  puzzlePiecesContainer.innerHTML = ""; 
  const puzzleSlots = document.querySelectorAll(".puzzle-slot");
  puzzleSlots.forEach((slot) => {
    slot.innerHTML = ""; 
  });
  document.getElementById("puzzle-feedback").innerText = "";

  // Reset riddle
  document.getElementById("riddle-challenge").style.display = "none";
  document.getElementById("riddle-question").innerText = "";
  document.getElementById("riddle-feedback-message").innerText = "";

  // Reset combat
  document.getElementById("combat-challenge").style.display = "none";
  document.getElementById("combat-description").innerText = "";

  // reset align mirrors
  document.getElementById("iceBlock").classList.remove("show", "reveal");
  let rotationAngles = { mirror1: 0, mirror2: 0, mirror3: 0, mirror4: 0 };
    const mirrors = document.querySelectorAll(".mirror");
    mirrors.forEach((mirror) => {
    const id = mirror.id;
    mirror.style.transform = `rotate(${rotationAngles[id]}deg)`;
  });
  
  // reset match relic powers
  const powersContainer = document.getElementById("powers-container");
  const powerDropZone = document.getElementById("power-drop-zone");
  powersContainer.innerHTML = "";
  powerDropZone.innerHTML = "";
  document.getElementById("match-feedback").innerText = "";
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Reset end scene on game start

function resetEndScene() {
  const endImage = document.getElementById("scene-end-image");
  endImage.src = ""; 
  endImage.style.display = "none";
  endImage.classList.remove("show");

  const endWords = document.getElementById("end-words");
  endWords.innerText = ""; 
  endWords.style.display = "none";
  endWords.classList.remove("show");
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Start Game

export function startGame() {
  const startScreen = document.getElementById("start-screen");
  const mainGame = document.getElementById("main-game");

  // animation fade out
  startScreen.style.transition = "opacity 0.5s ease";
  startScreen.style.opacity = 0;

  setTimeout(() => {
    resetInventory();
    console.log("Collected Relics after reset:", collectedRelics);

    resetChallenges();
    resetEndScene();
    clearPreviousScene();

    // reset first scene
    const sceneImage = document.getElementById("scene-image");
    sceneImage.src = "./assets/scenes/1.png";

    mainGame.style.display = "block";
    mainGame.style.opacity = 1;

    setTimeout(() => {
      mainGame.style.opacity = 1;
    }, 50);
  }, 500);

  setTimeout(() => {
    startScreen.style.display = "none";
    mainGame.style.display = "block";
    mainGame.style.opacity = 0;

    setTimeout(() => {
      mainGame.style.opacity = 1; // fade in smoothly
      loadScene(1);
    }, 50);
  }, 500); // match duration of fade-out
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Quit Game

export function quitGame() {
  const startScreen = document.getElementById("start-screen");
  const mainGame = document.getElementById("main-game");

  // fade out the main game screen
  mainGame.style.transition = "opacity 0.5s ease";
  mainGame.style.opacity = 0;

  setTimeout(() => {
    mainGame.style.display = "none";

    // show the start screen
    startScreen.style.display = "flex";
    startScreen.style.opacity = 0;
    setTimeout(() => {
      startScreen.style.opacity = 1; // fade in smoothly
    }, 50);
  }, 500); // match duration of fade-out
}

