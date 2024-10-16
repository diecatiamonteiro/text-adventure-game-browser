// Manages the overall game flow.

import { startGame, quitGame } from "./controls.js";

// start game
document.getElementById("start-button").addEventListener("click", startGame);

// quit game
document.getElementById("quit-button").addEventListener("click", quitGame);

// restart game
// document
//   .getElementById("restart-button")
//   .addEventListener("click", restartGame);
