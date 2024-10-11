import { startGame, quitGame, restartGame } from "./game.js";

// start game
document.getElementById("start-button").addEventListener("click", startGame);

// quit game
document.getElementById("quit-button").addEventListener("click", quitGame);

// restart game
document.getElementById("restart-button").addEventListener("click", restartGame);
