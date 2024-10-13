// Handles challenges, checks player input, and rewards players with relics or items.

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Riddle Challenge

export function handleRiddleChallenge(riddle, nextPhase, loadScene) {
  // Show the riddle question
  const riddleQuestion = document.getElementById("riddle-question");
  riddleQuestion.innerText = riddle.question;

  // Show the riddle input field and make sure other sections are hidden
  document.getElementById("riddle-challenge").style.display = "block";
  document.getElementById("next-phase").style.display = "none";

  const riddleInput = document.getElementById("riddle-answer");
  riddleInput.value = ""; // Clear previous input
  riddleInput.removeEventListener("keydown", handleRiddleInput);

  // Handle player input for the riddle
  function handleRiddleInput(e) {
    if (e.key === "Enter") {
      const playerInput = riddleInput.value.toLowerCase().trim();
      const feedbackMessage = document.getElementById("feedback-message");

      if (playerInput === riddle.correctAnswer) {
        feedbackMessage.innerText = riddle.feedback.right;

        // After success, add relic and load next scene
        setTimeout(() => {
          if (nextPhase.relic) {
            addRelicToInventory(nextPhase.relic);
          }
          loadScene(
            nextPhase.relic ? nextPhase.relic.nextScene : nextPhase.nextScene
          );
        }, 2000);
      } else {
        feedbackMessage.innerText = riddle.feedback.wrong;
      }
    }
  }

  riddleInput.addEventListener("keydown", handleRiddleInput);
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Combat Challenge

export function handleCombatChallenge(combat, loadScene) {
  // Display the combat description
  const combatDescription = document.getElementById("combat-description");
  combatDescription.innerText = combat.description;

  // Show combat challenge section and hide others
  document.getElementById("combat-challenge").style.display = "block";
  document.getElementById("next-phase").style.display = "none";

  const attackButton = document.getElementById("attack-button");
  const defendButton = document.getElementById("defend-button");

  attackButton.removeEventListener("click", handleAttack);
  defendButton.removeEventListener("click", handleDefend);

  // Define handlers for attack and defend
  function handleAttack() {
    const feedbackMessage = document.getElementById("feedback-message");
    combat.enemy.health -= 10; // Example attack damage

    if (combat.enemy.health <= 0) {
      feedbackMessage.innerText = combat.feedback.victory;
      setTimeout(() => loadScene(combat.nextScene), 2000);
    } else {
      feedbackMessage.innerText = combat.feedback.continue;
    }
  }

  function handleDefend() {
    const feedbackMessage = document.getElementById("feedback-message");
    feedbackMessage.innerText = "You defended successfully!";
  }

  // Add event listeners for combat actions
  attackButton.addEventListener("click", handleAttack);
  defendButton.addEventListener("click", handleDefend);
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Puzzle Challenge

export function handlePuzzleChallenge(puzzle, loadScene) {
  // Show puzzle description
  const puzzleDescription = document.getElementById("puzzle-description");
  puzzleDescription.innerText = puzzle.description;

  // Show puzzle challenge section
  document.getElementById("puzzle-challenge").style.display = "block";
  document.getElementById("next-phase").style.display = "none";

  function checkPuzzleCompletion() {
    const feedbackMessage = document.getElementById("feedback-message");
    const isPuzzleSolved = true; // Add puzzle-solving logic here

    if (isPuzzleSolved) {
      feedbackMessage.innerText = puzzle.feedback.right;
      setTimeout(() => loadScene(puzzle.nextScene), 2000);
    } else {
      feedbackMessage.innerText = puzzle.feedback.wrong;
    }
  }

  // Add puzzle interaction logic here (e.g., drag-and-drop)
}
