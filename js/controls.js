// Manages game controls like start, quit, and restart.

import { loadScene } from "./scenes.js";
import { resetInventory } from "./inventory.js";

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Start Game

export function startGame() {
  const startScreen = document.getElementById("start-screen");
  const mainGame = document.getElementById("main-game");

  // fade out the start screen
  startScreen.style.transition = "opacity 0.5s ease";
  startScreen.style.opacity = 0;

  setTimeout(() => {
    resetInventory();
    startScreen.style.display = "none";

    mainGame.style.display = "block";
    mainGame.style.opacity = 0;

    setTimeout(() => {
      mainGame.style.opacity = 1; // fade in smoothly
      loadScene(1)
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

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Restart Game

let collectedRelics = [];

export function restartGame() {
  const mainGame = document.getElementById("main-game");

  // fade out the main game screen
  mainGame.style.transition = "opacity 0.5s ease";
  mainGame.style.opacity = 0;

  // reset inventory visually
  setTimeout(() => {
    const inventoryItems = document.querySelectorAll(".inventory-item");
    inventoryItems.forEach((item) => {
      item.style.backgroundImage = "none";
      item.classList.remove("collected");
    });

    // clear relics
    collectedRelics = [];

    // reset first scene
    const sceneImage = document.getElementById("scene-image");
    sceneImage.src = "./assets/scenes/1.png";

    mainGame.style.display = "block";
    mainGame.style.opacity = 1;

    setTimeout(() => {
      mainGame.style.opacity = 1;
    }, 50);
  }, 500); // wait for fade-out (500ms) before resetting and fading in

  // Optionally, reset game progress variables (if any)
}
