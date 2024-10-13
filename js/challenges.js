// Handles challenges, checks player input, and rewards players with relics or items.

import { addRelicToInventory } from "./inventory.js";

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Riddle Challenge

export function handleRiddleChallenge(riddle, nextPhase, nextScene, loadScene) {
    const riddleQuestion = document.getElementById("riddle-question");
    riddleQuestion.innerText = riddle.question;
  
    // Show the riddle challenge UI
    document.getElementById("riddle-challenge").style.display = "block";
  
    const riddleInput = document.getElementById("riddle-answer");
    riddleInput.value = "";
  
    // Handle the player's input for the riddle
    function handleRiddleInput(e) {
      if (e.key === "Enter") {
        const playerInput = riddleInput.value.toLowerCase().trim();
        const feedbackMessage = document.getElementById("feedback-message");
  
        if (playerInput.includes(riddle.correctAnswer)) {
          feedbackMessage.innerText = riddle.feedback.right;
  
          // Add relic to inventory if it exists
          setTimeout(() => {
            if (nextPhase && nextPhase.relic) {
              addRelicToInventory(nextPhase.relic); // Add relic to inventory
            }
  
            // Correctly navigate to the next scene
            if (nextScene) {
              loadScene(nextScene);  // Ensure nextScene is passed from the scene data
            } else {
              console.error("nextScene is undefined");
            }
          }, 2000);
        } else {
          feedbackMessage.innerText = riddle.feedback.wrong;
        }
      }
    }
  
    riddleInput.addEventListener("keydown", handleRiddleInput);
}

  

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Combat Challenge

// export function handleCombatChallenge(combat, nextPhase, loadScene) {
//   const combatDescription = document.getElementById("combat-description");
//   combatDescription.innerText = combat.description;

//   // Show combat challenge UI
//   document.getElementById("combat-challenge").style.display = "block";

//   function handleAttack() {
//     combat.enemy.health -= 10;

//     if (combat.enemy.health <= 0) {
//       document.getElementById("feedback-message").innerText =
//         combat.feedback.victory;

//       setTimeout(() => {
//         if (nextPhase.relic) {
//           addRelicToInventory(nextPhase.relic); // Add relic to inventory
//         }
//         loadScene(nextPhase.nextScene);
//       }, 2000);
//     }
//   }

//   document
//     .getElementById("attack-button")
//     .addEventListener("click", handleAttack);
// }

export function handleCombatChallenge(nextPhase, nextScene, loadScene) {
    const combatDescription = document.getElementById("combat-description");
  
    // Check if combat data is present
    if (!nextPhase || !nextPhase.enemy || !nextPhase.playerActions) {
      console.error("Combat data is missing or incomplete.");
      return;
    }
  
    combatDescription.innerText = nextPhase.description;
  
    // Show combat challenge UI
    document.getElementById("combat-challenge").style.display = "block";
  
    function handleAttack() {
      nextPhase.enemy.health -= 10;
  
      if (nextPhase.enemy.health <= 0) {
        document.getElementById("feedback-message").innerText =
          nextPhase.feedback.victory;
  
        setTimeout(() => {
          if (nextPhase.relic) {
            addRelicToInventory(nextPhase.relic); // Add relic to inventory
          }
          loadScene(nextScene); // Proceed to the next scene
        }, 2000);
      }
    }
  
    document
      .getElementById("attack-button")
      .addEventListener("click", handleAttack);
  }
  

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Puzzle Challenge

export function handlePuzzleChallenge(puzzle, nextPhase, loadScene) {
  const puzzleDescription = document.getElementById("puzzle-description");
  puzzleDescription.innerText = puzzle.description;

  // Show puzzle challenge UI
  document.getElementById("puzzle-challenge").style.display = "block";

  function checkPuzzleCompletion() {
    const feedbackMessage = document.getElementById("feedback-message");
    const isPuzzleSolved = true; // Add puzzle-solving logic here

    if (isPuzzleSolved) {
      feedbackMessage.innerText = puzzle.feedback.right;

      setTimeout(() => {
        if (nextPhase.relic) {
          addRelicToInventory(nextPhase.relic); // Add relic to inventory
        }
        loadScene(nextPhase.nextScene);
      }, 2000);
    } else {
      feedbackMessage.innerText = puzzle.feedback.wrong;
    }
  }

  // Add puzzle interaction logic here
}
