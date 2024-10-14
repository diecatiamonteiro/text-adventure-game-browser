import { addRelicToInventory } from "./inventory.js";

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Riddle Challenge

export function handleRiddleChallenge(riddle, nextPhase, nextScene, loadScene) {
  const riddleQuestion = document.getElementById("riddle-question");
  riddleQuestion.innerText = riddle.question;

  // show riddle challenge UI
  document.getElementById("riddle-challenge").style.display = "block";

  const riddleInput = document.getElementById("riddle-answer");
  riddleInput.value = "";

  // handle player's input
  function handleRiddleInput(e) {
    if (e.key === "Enter") {
      const playerInput = riddleInput.value.toLowerCase().trim();
      const feedbackChallengeMessage = document.getElementById(
        "riddle-feedback-message"
      );

      if (playerInput.includes(riddle.correctChallengeAnswer)) {
        feedbackChallengeMessage.innerText = riddle.feedbackChallenge.right;

        // add relic to inventory
        setTimeout(() => {
          if (nextPhase && nextPhase.relic) {
            addRelicToInventory(nextPhase.relic);
          }
        }, 4000);

        // Show "Next" button to proceed to the next phase
        showNextButton(() => {
          loadScene(nextScene);
        });
      } else {
        feedbackChallengeMessage.innerText = riddle.feedbackChallenge.wrong;
      }
    }
  }

  riddleInput.addEventListener("keydown", handleRiddleInput);
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Combat Challenge

export function handleCombatChallenge(nextPhase, nextScene, loadScene) {
  const enemyName = document.getElementById("enemy-name");
  const enemyHealthFill = document.getElementById("enemy-health-fill");
  const playerHealthFill = document.getElementById("player-health-fill");
  const feedbackMessage = document.getElementById("combat-feedback");

  let enemyHealth = nextPhase.enemy.health; // Set enemy's initial health
  let playerHealth = 100; // Set player's initial health

  // Set combat description and enemy stats
  enemyName.innerText = `Health - ${nextPhase.enemy.name}`;
  updateHealthBar(enemyHealthFill, enemyHealth, nextPhase.enemy.health); // Set initial width for enemy health bar
  updateHealthBar(playerHealthFill, playerHealth, 100); // Set initial width for player health bar

  // Display combat UI elements
  document.getElementById("combat-challenge").style.display = "block";
  feedbackMessage.innerText = ""; // Clear previous feedback

  // Function to handle health bar updates
  function updateHealthBar(healthBar, currentHealth, maxHealth) {
    const healthPercentage = (currentHealth / maxHealth) * 100;
    healthBar.style.width = `${healthPercentage}%`; // Set the width as a percentage
  }

  // Function to handle pop-up effects (damage or block notifications)
  function showPopup(text, color = "red") {
    const popupFeedback = document.getElementById("popup-feedback");
    popupFeedback.innerText = text;
    popupFeedback.style.color = color;
    popupFeedback.style.display = "block";
    setTimeout(() => (popupFeedback.style.display = "none"), 3000); // Hide after 3 seconds
  }

  // Function to handle player's actions
  function handlePlayerAction(action) {
    let damageDealt;
    if (action === "Attack") {
      damageDealt = 10; // Regular attack
      enemyHealth -= damageDealt;
      updateHealthBar(enemyHealthFill, enemyHealth, nextPhase.enemy.health); // Update enemy health bar
      feedbackMessage.innerText = `You strike the Stone Guardian, dealing ${damageDealt} damage.`;
      showPopup(`-${damageDealt} HP for Guardian`, "red");
    } else if (action === "Aim for joints") {
      damageDealt = 20; // Strong attack for weak points
      enemyHealth -= damageDealt;
      updateHealthBar(enemyHealthFill, enemyHealth, nextPhase.enemy.health); // Update enemy health bar
      feedbackMessage.innerText = `You aim for the Guardian's weak points! You deal ${damageDealt} damage!`;
      showPopup(`-${damageDealt} HP for Guardian`, "orange");
    } else if (action === "Defend") {
      feedbackMessage.innerText =
        "You brace yourself, reducing incoming damage.";
      showPopup("You block the attack!", "blue");
      return; // No damage dealt in this turn
    }

    // Guardian retaliates after each player action
    handleEnemyAttack();

    // Check for victory
    if (enemyHealth <= 0) {
      feedbackMessage.innerText = nextPhase.feedbackChallenge.victory;
      updateHealthBar(enemyHealthFill, 0, nextPhase.enemy.health); // Ensure the health bar is fully empty on victory

      setTimeout(() => {
        if (nextPhase.relic) {
          addRelicToInventory(nextPhase.relic);
        }
      }, 4000);

      if (nextScene) {
        showNextButton(() => {
          loadScene(nextScene);
        });
      } else {
        console.error("nextScene is undefined");
      }
    }
  }

  // Function to handle the enemy attack
  function handleEnemyAttack() {
    const enemyAttackDamage = Math.floor(Math.random() * 10) + 10; // Randomize between 10-20
    feedbackMessage.innerText += ` The Stone Guardian retaliates, swinging its hammer and dealing ${enemyAttackDamage} damage to you.`;

    // Reduce player's health
    playerHealth -= enemyAttackDamage;
    updateHealthBar(playerHealthFill, playerHealth, 100); // Update player's health bar

    // Check if the player is defeated
    if (playerHealth <= 0) {
      feedbackMessage.innerText = nextPhase.feedbackChallenge.defeat;
      setTimeout(() => {
        resetCombat(); // Reset the combat after defeat
      }, 4000);
    }
  }

  // Function to reset combat
  function resetCombat() {
    // Reset health values
    playerHealth = 100;
    enemyHealth = nextPhase.enemy.health;

    // Update health bars
    updateHealthBar(playerHealthFill, playerHealth, 100);
    updateHealthBar(enemyHealthFill, enemyHealth, nextPhase.enemy.health);

    // Reset feedback and display message
    feedbackMessage.innerText =
      "You've been given another chance! Fight again!";
  }

  // Remove existing event listeners to prevent stacking
  document
    .getElementById("attack-button")
    .removeEventListener("click", handlePlayerAction);
  document
    .getElementById("aim-button")
    .removeEventListener("click", handlePlayerAction);
  document
    .getElementById("defend-button")
    .removeEventListener("click", handlePlayerAction);

  // Add event listeners for player actions
  document
    .getElementById("attack-button")
    .addEventListener("click", () => handlePlayerAction("Attack"));
  document
    .getElementById("aim-button")
    .addEventListener("click", () => handlePlayerAction("Aim for joints"));
  document
    .getElementById("defend-button")
    .addEventListener("click", () => handlePlayerAction("Defend"));
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
      feedbackMessage.innerText = puzzle.feedbackChallenge.right;

      setTimeout(() => {
        if (nextPhase.relic) {
          addRelicToInventory(nextPhase.relic); // Add relic to inventory
        }
        loadScene(nextPhase.nextScene);
      }, 2000);
    } else {
      feedbackMessage.innerText = puzzle.feedbackChallenge.wrong;
    }
  }

  // Add puzzle interaction logic here
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Next Button

function showNextButton(onNext) {
  const nextButton = document.getElementById("next-button");
  nextButton.style.display = "block";

  nextButton.addEventListener("click", function onNextClick() {
    onNext(); // Trigger function to load next scene
    nextButton.style.display = "none"; // Hide button after clicking
    nextButton.removeEventListener("click", onNextClick); // Remove listener to avoid duplication
  });
}
