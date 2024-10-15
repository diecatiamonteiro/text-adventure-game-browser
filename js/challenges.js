import { addRelicToInventory } from "./inventory.js";

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Riddle

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

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Combat

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

export function handlePuzzleChallenge(puzzle, nextPhase, nextScene, loadScene) {
  const puzzleDescription = document.getElementById("puzzle-description");
  puzzleDescription.innerText = puzzle.description;

  document.getElementById("puzzle-challenge").style.display = "block";

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // shuffle puzzle pieces position
  const shuffledPieces = shuffleArray([...puzzle.pieces]);

  // clear previous pieces
  const puzzlePiecesContainer = document.getElementById("puzzle-pieces");
  puzzlePiecesContainer.innerHTML = "";

  shuffledPieces.forEach((piece) => {
    const img = document.createElement("img");
    img.src = `./assets/puzzle/${piece}.png`;
    img.classList.add("puzzle-piece");

    const originalPieceIndex = puzzle.pieces.indexOf(piece) + 1;
    img.setAttribute("draggable", "true");
    img.setAttribute("data-piece", originalPieceIndex);

    puzzlePiecesContainer.appendChild(img);

    img.addEventListener("dragstart", handleDragStart);
  });

  const puzzleSlots = document.querySelectorAll(".puzzle-slot");
  puzzleSlots.forEach((slot) => {
    slot.addEventListener("dragover", handleDragOver);
    slot.addEventListener("drop", handleDrop);
  });

  function handleDragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.dataset.piece);
  }

  function handleDragOver(e) {
    e.preventDefault(); // allows dropping
  }

  function handleDrop(e) {
    const draggedPieceId = e.dataTransfer.getData("text/plain");
    const droppedSlotId = e.target.dataset.slot;

    if (draggedPieceId === droppedSlotId) {
      const piece = document.querySelector(`[data-piece="${draggedPieceId}"]`);
      e.target.appendChild(piece); // drop piece into slot
      piece.setAttribute("draggable", "false");

      checkPuzzleCompletion(nextScene);
    } else {
      showPopup("Wrong place. Try again.");
    }
  }

  function showPopup(text, color = "red") {
    const popupPuzzleFeedback = document.getElementById(
      "popup-puzzle-feedback"
    );
    popupPuzzleFeedback.innerText = text;
    popupPuzzleFeedback.style.color = color;
    popupPuzzleFeedback.style.display = "block";
    setTimeout(() => {
      popupPuzzleFeedback.style.display = "none";
    }, 4000);
  }

  function checkPuzzleCompletion(nextScene) {
    const placedPieces = document.querySelectorAll(".puzzle-slot img");

    if (placedPieces.length === puzzle.pieces.length) {
      const feedbackMessage = document.getElementById("puzzle-feedback");
      feedbackMessage.innerText = puzzle.feedbackChallenge.right;

      setTimeout(() => {
        if (nextPhase.relic) {
          addRelicToInventory(nextPhase.relic);
        }
      }, 4000);

      showNextButton(() => {
        loadScene(nextScene);
      });
    } else {
      console.log("Scene not found.");
    }
  }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Align Challenge

export function handleAlignChallenge(align, nextPhase, nextScene, loadScene) {
  const puzzleDescription = document.getElementById("puzzle-description");
  puzzleDescription.innerText = align.description;

  document.getElementById("align-challenge").style.display = "block";

  const flame = document.getElementById("flame");
  flame.style.backgroundImage = "url('./assets/align-game/fire.gif')";

  const ice = document.getElementById("iceBlock");
  ice.style.backgroundImage = "url('./assets/align-game/ice.png')";

  let rotationAngles = { mirror1: 0, mirror2: 0, mirror3: 0, mirror4: 0 };
  const mirrors = document.querySelectorAll(".mirror");

  mirrors.forEach((mirror) => {
    mirror.style.backgroundImage = "url('./assets/align-game/mirror.png')";
    mirror.addEventListener("click", () => rotateMirror(mirror));
  });

  function rotateMirror(mirror) {
    const id = mirror.id;
    rotationAngles[id] = (rotationAngles[id] + 45) % 360; // Rotate in 45-degree increments
    mirror.style.transform = `rotate(${rotationAngles[id]}deg)`; // Apply rotation

    checkAlignment(); // after each click
  }

  function checkAlignment() {
    const { mirror1, mirror2, mirror3, mirror4 } = rotationAngles;

    // if mirrors are aligned, melt ice and display relic
    if (
      mirror1 === 45 &&
      mirror2 === 135 &&
      mirror3 === 45 &&
      mirror4 === 135
    ) {
      // Remove event listeners to stop further rotation
      mirrors.forEach((mirror) => {
        mirror.removeEventListener("click", () => rotateMirror(mirror));
      });

      const iceBlock = document.getElementById("iceBlock");
      iceBlock.style.backgroundImage = `url(${nextPhase.relic.image})`;

      // Slowly make the relic appear
      setTimeout(() => {
        iceBlock.classList.add("reveal");
      }, 1000);

      setTimeout(() => {
        const feedbackMessage = document.getElementById("align-feedback");
        feedbackMessage.innerText = nextPhase.align.feedbackChallenge.right;
      }, 2000);

      setTimeout(() => {
        if (nextPhase.relic) {
          addRelicToInventory(nextPhase.relic);
        }

        showNextButton(() => {
          loadScene(nextScene);
        });
      }, 4000);
    } else {
      const feedbackMessage = document.getElementById("align-feedback");
      feedbackMessage.innerText = nextPhase.align.feedbackChallenge.wrong;
    }
  }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Match Challenge

export function handleMatchChallenge(match, nextPhase, nextScene, loadScene) {
  const matchChallengeContainer = document.getElementById("match-challenge");
  const relicsContainer = document.getElementById("relics-container");
  const powersContainer = document.getElementById("powers-container");
  const powerDropZone = document.getElementById("power-drop-zone");
  const feedbackMessage = document.getElementById("match-feedback");

  relicsContainer.innerHTML = "";
  powersContainer.innerHTML = "";
  powerDropZone.innerHTML = "";
  feedbackMessage.innerText = "";
  matchChallengeContainer.style.display = "block";

  const matchDescription = document.getElementById("match-description");
  matchDescription.innerText = match.description;

  function shuffleRelicsArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // shuffle powers' positioning
  const powers = match.relics.map((relic) => relic.power); // get powers
  const shuffledPowers = shuffleRelicsArray([...powers]); // suffle powers

  match.relics.forEach((relic, slotIndex) => {
    // create div with relic name & image
    const relicElement = document.createElement("div");
    relicElement.classList.add("relic");

    const relicImage = document.createElement("img");
    relicImage.classList.add("relic-image");
    relicImage.src = relic.image;
    relicImage.alt = relic.name;

    const relicName = document.createElement("h4");
    relicName.classList.add("relic-name");
    relicName.innerText = relic.name;
    
    relicElement.appendChild(relicImage);
    relicElement.appendChild(relicName);
    relicsContainer.appendChild(relicElement);

    // create power drop zone for each power
    const powerSlot = document.createElement("div");
    powerSlot.classList.add("power-slot");
    powerSlot.dataset.slot = slotIndex; // power index
    powerSlot.addEventListener("dragover", handleDragOver);
    powerSlot.addEventListener("drop", (e) => handleDrop(e, slotIndex, match));
    powerDropZone.appendChild(powerSlot);
  });

  // display shuffled draggable powers below drop zone
  shuffledPowers.forEach((power) => {
    const powerElement = document.createElement("div");
    powerElement.classList.add("power");
    powerElement.draggable = true;
    powerElement.dataset.correctIndex = match.relics.findIndex(
      (relic) => relic.power === power
    );

    const powerDescription = document.createElement("p");
    powerDescription.classList.add("power-description");
    powerDescription.innerText = power;

    powerElement.appendChild(powerDescription);
    powersContainer.appendChild(powerElement);

    powerElement.addEventListener("dragstart", handleDragStart);
  });

  function handleDragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.dataset.correctIndex);
  }

  function handleDragOver(e) {
    e.preventDefault(); // allow dropping
  }

  function handleDrop(e, slotIndex, match) {
    e.preventDefault();
    const draggedPowerIndex = e.dataTransfer.getData("text/plain");
    const feedbackMessage = document.getElementById("match-feedback");

    // check if dropped power matches correct slot
    if (draggedPowerIndex == slotIndex) {
      const draggedElement = document.querySelector(
        `[data-correct-index="${draggedPowerIndex}"]`
      );
      e.target.appendChild(draggedElement); // move power to power slot
      draggedElement.draggable = false;

      // check if all powers are correctly placed
      const placedPowers = document.querySelectorAll(".power-slot .power");
      if (placedPowers.length === match.relics.length) {
        feedbackMessage.innerText = match.feedbackChallenge.right;

        setTimeout(() => {
          if (nextPhase.relic) {
            addRelicToInventory(nextPhase.relic);
          }
          showNextButton(() => {
            loadScene(nextScene);
          });
        }, 4000);
      }
    } else {
      feedbackMessage.innerText = match.feedbackChallenge.wrong;
    }
  }
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
