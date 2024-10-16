import { startGame, quitGame } from "./controls.js";

// start game
document.getElementById("start-button").addEventListener("click", startGame);

// end game
document.getElementById("quit-button").addEventListener("click", quitGame);
