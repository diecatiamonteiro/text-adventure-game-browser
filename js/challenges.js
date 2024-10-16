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

        setTimeout(() => {
          if (nextPhase.relic) {
            addRelicToInventory(nextPhase.relic);
          }

          setTimeout(() => {
            showNextButton(() => {
              loadScene(nextScene);
            });
          }, 1500);
        }, 4000);
      } else {
        feedbackChallengeMessage.innerText = riddle.feedbackChallenge.wrong;
      }
    }
  }

  riddleInput.addEventListener("keydown", handleRiddleInput);
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Combat

// export function handleCombatChallenge(nextPhase, nextScene, loadScene) {
//   const enemyName = document.getElementById("enemy-name");
//   const enemyHealthFill = document.getElementById("enemy-health-fill");
//   const playerHealthFill = document.getElementById("player-health-fill");
//   const feedbackMessage = document.getElementById("combat-feedback");

//   let enemyHealth = nextPhase.enemy.health;
//   let playerHealth = 100;
//   let playerEnergy = 50; // add energy mechanic to limit actions

//   let combatOver = false;

//   // set combat description and enemy stats
//   enemyName.innerText = `Health - ${nextPhase.enemy.name}`;
//   updateHealthBar(enemyHealthFill, enemyHealth, nextPhase.enemy.health);
//   updateHealthBar(playerHealthFill, playerHealth, 100);

//   // display player energy
//   const playerEnergyBar = document.getElementById("player-energy-fill");
//   updateEnergyBar(playerEnergyBar, playerEnergy, 50);

//   document.getElementById("combat-challenge").style.display = "block";
//   feedbackMessage.innerText = "";

//   function updateHealthBar(healthBar, currentHealth, maxHealth) {
//     const healthPercentage = (currentHealth / maxHealth) * 100;
//     healthBar.style.width = `${healthPercentage}%`;
//   }

//   function updateEnergyBar(energyBar, currentEnergy, maxEnergy) {
//     const energyPercentage = (currentEnergy / maxEnergy) * 100;
//     energyBar.style.width = `${energyPercentage}%`;
//   }

//   // temporary feedback
//   function showPopup(text, color = "red") {
//     const popupFeedback = document.getElementById("popup-feedback");
//     popupFeedback.innerText = text;
//     popupFeedback.style.color = color;
//     popupFeedback.style.display = "block";
//     setTimeout(() => {
//       popupFeedback.style.display = "none";
//     }, 3000); // hide after 3sec
//   }

//   function regenerateEnergy() {
//     const regenAmount = 5; // aount of energy regained per cycle
//     const regenInterval = setInterval(() => {
//       if (combatOver) {
//         // stop regenerating if combat is over
//         clearInterval(regenInterval);
//         return;
//       }

//       if (playerEnergy < 50) {
//         // ensure energy doesn't exceed max
//         playerEnergy += regenAmount;
//         updateEnergyBar(playerEnergyBar, playerEnergy, 50); // update the energy bar
//       } else {
//         clearInterval(regenInterval); // stop regenerating when energy is full
//       }
//     }, 2000); // regenerate every 2sec
//   }

//   // handle player's actions with energy cost and special moves
//   function handlePlayerAction(action) {
//     if (combatOver) return;

//     let damageDealt;

//     if (playerEnergy < 10) {
//       feedbackMessage.innerText =
//         "You're too tired to attack! You must wait to regain energy.";
//       regenerateEnergy();
//       return;
//     }

//     if (action === "Attack") {
//       damageDealt = 10;
//       playerEnergy -= 10; // regular attack costs 10 energy
//       enemyHealth -= damageDealt;
//       updateHealthBar(enemyHealthFill, enemyHealth, nextPhase.enemy.health);
//       updateEnergyBar(playerEnergyBar, playerEnergy, 50); // Update energy
//       feedbackMessage.innerText = `You strike the Stone Guardian, dealing ${damageDealt} damage.`;
//       showPopup(`-${damageDealt} HP for Guardian`, "red");
//     } else if (action === "Aim for joints") {
//       if (Math.random() > 0.3) {
//         // add a chance for critical hits
//         damageDealt = 25;
//         playerEnergy -= 20; // aiming costs more energy
//         feedbackMessage.innerText = `Critical hit! You aim for the weak spot and deal ${damageDealt} damage!`;
//       } else {
//         damageDealt = 5; // missed attempt
//         feedbackMessage.innerText = `You missed the weak spot, only dealing ${damageDealt} damage.`;
//       }
//       enemyHealth -= damageDealt;
//       updateHealthBar(enemyHealthFill, enemyHealth, nextPhase.enemy.health);
//       updateEnergyBar(playerEnergyBar, playerEnergy, 50);
//       showPopup(`-${damageDealt} HP for Guardian`, "orange");
//     } else if (action === "Defend") {
//       playerEnergy -= 5; // defending costs less energy
//       feedbackMessage.innerText =
//         "You brace yourself, reducing incoming damage.";
//       showPopup("You block the attack!", "blue");
//       return; // no damage dealt
//     }

//     handleEnemyAttack(); // enemy retaliates

//     if (enemyHealth <= 0) {
//       combatOver = true;
//       feedbackMessage.innerText = nextPhase.feedbackChallenge.victory;
//       updateHealthBar(enemyHealthFill, 0, nextPhase.enemy.health);

//       // Remove event listeners after victory
//       document
//         .getElementById("attack-button")
//         .removeEventListener("click", handlePlayerAction);
//       document
//         .getElementById("aim-button")
//         .removeEventListener("click", handlePlayerAction);
//       document
//         .getElementById("defend-button")
//         .removeEventListener("click", handlePlayerAction);

//       setTimeout(() => {
//         if (nextPhase.relic) {
//           addRelicToInventory(nextPhase.relic);
//         }

//         setTimeout(() => {
//           showNextButton(() => {
//             loadScene(nextScene);
//           });
//         }, 1500);
//       }, 4000);
//       return; // Stop here after victory, no further reset!
//     }
//   }

//   function handleEnemyAttack() {
//     if (combatOver) return; // prevent enemy actions if combat is over

//     // randomly decide between heavy or light attack
//     const enemyAttackType =
//       Math.random() > 0.4 ? "Heavy Attack" : "Quick Strike";
//     let enemyAttackDamage;

//     // Introduce enemy health regeneration after every few rounds
//     const enemyRegenChance = Math.random() > 0.8; // 20% chance to regenerate health

//     if (enemyRegenChance && enemyHealth < nextPhase.enemy.health) {
//       enemyHealth += 10; // Regenerate 10 health points
//       updateHealthBar(enemyHealthFill, enemyHealth, nextPhase.enemy.health);
//       feedbackMessage.innerText += ` The Stone Guardian regenerates 10 health!`;
//       showPopup(`+10 HP for Guardian`, "green");
//     }

//     if (enemyAttackType === "Heavy Attack") {
//       enemyAttackDamage = 30; // Increase heavy attack damage for more challenge
//       feedbackMessage.innerText += ` The Stone Guardian charges a heavy attack and deals ${enemyAttackDamage} damage!`;
//     } else {
//       enemyAttackDamage = Math.floor(Math.random() * 10) + 10; // Increase base light attack damage
//       feedbackMessage.innerText += ` The Stone Guardian strikes swiftly and deals ${enemyAttackDamage} damage.`;
//     }

//     // Introduce a chance for enemy to land critical hits for extra damage
//     if (Math.random() > 0.7) {
//       // 30% chance of critical hit
//       enemyAttackDamage += 15;
//       feedbackMessage.innerText += ` Critical hit! The Stone Guardian's attack is even more brutal!`;
//       showPopup(`Critical hit! +15 Damage`, "red");
//     }

//     playerHealth -= enemyAttackDamage;

//     if (playerHealth < 0) playerHealth = 0;

//     updateHealthBar(playerHealthFill, playerHealth, 100);

//     if (playerHealth <= 0 && !combatOver) {
//       combatOver = true;
//       feedbackMessage.innerText = nextPhase.feedbackChallenge.defeat;

//       setTimeout(() => {
//         resetCombat();
//       }, 3000);
//     }
//   }

//   // Reset combat for retry (optional for your game logic)
//   function resetCombat() {
//     if (!combatOver) return;

//     // Clear previous event listeners before resetting
//     document
//       .getElementById("attack-button")
//       .replaceWith(document.getElementById("attack-button").cloneNode(true));
//     document
//       .getElementById("aim-button")
//       .replaceWith(document.getElementById("aim-button").cloneNode(true));
//     document
//       .getElementById("defend-button")
//       .replaceWith(document.getElementById("defend-button").cloneNode(true));

//     playerHealth = 100;
//     enemyHealth = nextPhase.enemy.health;
//     playerEnergy = 50; // Reset energy
//     combatOver = false; // Reset combat status

//     // update UI elements
//     updateHealthBar(playerHealthFill, playerHealth, 100);
//     updateHealthBar(enemyHealthFill, enemyHealth, nextPhase.enemy.health);
//     updateEnergyBar(playerEnergyBar, playerEnergy, 50);

//     setTimeout(() => {
//       feedbackMessage.innerText = "You've been given another chance!";
//     }, 1000);

//     // Re-add event listeners for combat actions
//     document
//       .getElementById("attack-button")
//       .addEventListener("click", () => handlePlayerAction("Attack"));
//     document
//       .getElementById("aim-button")
//       .addEventListener("click", () => handlePlayerAction("Aim for joints"));
//     document
//       .getElementById("defend-button")
//       .addEventListener("click", () => handlePlayerAction("Defend"));
//   }

//   // Add event listeners for actions at the start of the combat
//   document
//     .getElementById("attack-button")
//     .addEventListener("click", () => handlePlayerAction("Attack"));
//   document
//     .getElementById("aim-button")
//     .addEventListener("click", () => handlePlayerAction("Aim for joints"));
//   document
//     .getElementById("defend-button")
//     .addEventListener("click", () => handlePlayerAction("Defend"));
// }

export function handleCombatChallenge(nextPhase, nextScene, loadScene) {
  const enemyName = document.getElementById("enemy-name");
  const enemyHealthFill = document.getElementById("enemy-health-fill");
  const playerHealthFill = document.getElementById("player-health-fill");
  const feedbackMessage = document.getElementById("combat-feedback");

  let enemyHealth = nextPhase.enemy.health;
  let playerHealth = 100;
  let playerEnergy = 50; // add energy mechanic to limit actions
  let combatOver = false;
  let combatWon = false; // new flag to track if combat has been won

  // set combat description and enemy stats
  enemyName.innerText = `Health - ${nextPhase.enemy.name}`;
  updateHealthBar(enemyHealthFill, enemyHealth, nextPhase.enemy.health);
  updateHealthBar(playerHealthFill, playerHealth, 100);

  // display player energy
  const playerEnergyBar = document.getElementById("player-energy-fill");
  updateEnergyBar(playerEnergyBar, playerEnergy, 50);

  document.getElementById("combat-challenge").style.display = "block";
  feedbackMessage.innerText = "";

  function updateHealthBar(healthBar, currentHealth, maxHealth) {
    const healthPercentage = (currentHealth / maxHealth) * 100;
    healthBar.style.width = `${healthPercentage}%`;
  }

  function updateEnergyBar(energyBar, currentEnergy, maxEnergy) {
    const energyPercentage = (currentEnergy / maxEnergy) * 100;
    energyBar.style.width = `${energyPercentage}%`;
  }

  function showPopup(text, color = "red") {
    const popupFeedback = document.getElementById("popup-feedback");
    popupFeedback.innerText = text;
    popupFeedback.style.color = color;
    popupFeedback.style.display = "block";
    setTimeout(() => {
      popupFeedback.style.display = "none";
    }, 3000); // hide after 3sec
  }

  function regenerateEnergy() {
    const regenAmount = 5; // amount of energy regained per cycle
    const regenInterval = setInterval(() => {
      if (combatOver || combatWon) {
        clearInterval(regenInterval);
        return;
      }

      if (playerEnergy < 50) {
        playerEnergy += regenAmount;
        updateEnergyBar(playerEnergyBar, playerEnergy, 50);
      } else {
        clearInterval(regenInterval);
      }
    }, 2000); // regenerate every 2sec
  }

  function handlePlayerAction(action) {
    if (combatOver || combatWon) return;

    let damageDealt;

    if (playerEnergy < 10) {
      feedbackMessage.innerText =
        "You're too tired to attack! You must wait to regain energy.";
      regenerateEnergy();
      return;
    }

    if (action === "Attack") {
      damageDealt = 10;
      playerEnergy -= 10;
      enemyHealth -= damageDealt;
      updateHealthBar(enemyHealthFill, enemyHealth, nextPhase.enemy.health);
      updateEnergyBar(playerEnergyBar, playerEnergy, 50);
      feedbackMessage.innerText = `You strike the Stone Guardian, dealing ${damageDealt} damage.`;
      showPopup(`-${damageDealt} HP for Guardian`, "red");
    } else if (action === "Aim for joints") {
      if (Math.random() > 0.3) {
        damageDealt = 25;
        playerEnergy -= 20;
        feedbackMessage.innerText = `Critical hit! You aim for the weak spot and deal ${damageDealt} damage!`;
      } else {
        damageDealt = 5;
        feedbackMessage.innerText = `You missed the weak spot, only dealing ${damageDealt} damage.`;
      }
      enemyHealth -= damageDealt;
      updateHealthBar(enemyHealthFill, enemyHealth, nextPhase.enemy.health);
      updateEnergyBar(playerEnergyBar, playerEnergy, 50);
      showPopup(`-${damageDealt} HP for Guardian`, "orange");
    } else if (action === "Defend") {
      playerEnergy -= 5;
      feedbackMessage.innerText =
        "You brace yourself, reducing incoming damage.";
      showPopup("You block the attack!", "blue");
      return;
    }

    handleEnemyAttack();

    if (enemyHealth <= 0) {
      combatOver = true;
      combatWon = true; // combat is won, prevent further resets
      feedbackMessage.innerText = nextPhase.feedbackChallenge.victory;
      updateHealthBar(enemyHealthFill, 0, nextPhase.enemy.health);

      // Remove event listeners after victory
      document
        .getElementById("attack-button")
        .removeEventListener("click", handlePlayerAction);
      document
        .getElementById("aim-button")
        .removeEventListener("click", handlePlayerAction);
      document
        .getElementById("defend-button")
        .removeEventListener("click", handlePlayerAction);

      setTimeout(() => {
        if (nextPhase.relic) {
          addRelicToInventory(nextPhase.relic);
        }

        setTimeout(() => {
          showNextButton(() => {
            loadScene(nextScene);
          });
        }, 1500);
      }, 4000);
      return;
    }
  }

  function handleEnemyAttack() {
    if (combatOver || combatWon) return;

    const enemyAttackType =
      Math.random() > 0.4 ? "Heavy Attack" : "Quick Strike";
    let enemyAttackDamage;

    if (enemyAttackType === "Heavy Attack") {
      enemyAttackDamage = 30;
      feedbackMessage.innerText += ` The Stone Guardian charges a heavy attack and deals ${enemyAttackDamage} damage!`;
    } else {
      enemyAttackDamage = Math.floor(Math.random() * 10) + 10;
      feedbackMessage.innerText += ` The Stone Guardian strikes swiftly and deals ${enemyAttackDamage} damage.`;
    }

    if (Math.random() > 0.7) {
      enemyAttackDamage += 15;
      feedbackMessage.innerText += ` Critical hit! The Stone Guardian's attack is even more brutal!`;
      showPopup(`Critical hit! +15 Damage`, "red");
    }

    playerHealth -= enemyAttackDamage;

    if (playerHealth < 0) playerHealth = 0;

    updateHealthBar(playerHealthFill, playerHealth, 100);

    if (playerHealth <= 0 && !combatOver) {
      combatOver = true;
      feedbackMessage.innerText = nextPhase.feedbackChallenge.defeat;

      setTimeout(() => {
        resetCombat();
      }, 3000);
    }
  }

  function resetCombat() {
    if (combatWon) return; // prevent reset if combat has been won

    document
      .getElementById("attack-button")
      .replaceWith(document.getElementById("attack-button").cloneNode(true));
    document
      .getElementById("aim-button")
      .replaceWith(document.getElementById("aim-button").cloneNode(true));
    document
      .getElementById("defend-button")
      .replaceWith(document.getElementById("defend-button").cloneNode(true));

    playerHealth = 100;
    enemyHealth = nextPhase.enemy.health;
    playerEnergy = 50;
    combatOver = false;

    updateHealthBar(playerHealthFill, playerHealth, 100);
    updateHealthBar(enemyHealthFill, enemyHealth, nextPhase.enemy.health);
    updateEnergyBar(playerEnergyBar, playerEnergy, 50);

    setTimeout(() => {
      feedbackMessage.innerText = "You've been given another chance!";
    }, 500);

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

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Puzzle

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

        setTimeout(() => {
          showNextButton(() => {
            loadScene(nextScene);
          });
        }, 1500);
      }, 4000);
    } else {
      console.log("Scene not found.");
    }
  }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Align mirrors

export function handleAlignChallenge(align, nextPhase, nextScene, loadScene) {
  const puzzleDescription = document.getElementById("puzzle-description");
  puzzleDescription.innerText = align.description;

  document.getElementById("align-challenge").style.display = "block";

  const flame = document.getElementById("flame");
  flame.style.backgroundImage = "url('./assets/align-game/flame.png')";

  const ice = document.getElementById("iceBlock");
  ice.style.backgroundImage = "url('./assets/align-game/ice.png')";

  let rotationAngles = { mirror1: 0, mirror2: 0, mirror3: 0, mirror4: 0 };
  const mirrors = document.querySelectorAll(".mirror");

  mirrors.forEach((mirror) => {
    mirror.style.backgroundImage = "url('./assets/align-game/mirror.png')";
    mirror.addEventListener("click", rotateMirror);
  });

  function rotateMirror(e) {
    const mirror = e.target; // get clicked mirror
    const id = mirror.id;
    rotationAngles[id] = (rotationAngles[id] + 45) % 180; // rotate in 45deg increments only until 180deg
    mirror.style.transform = `rotate(${rotationAngles[id]}deg)`; // apply rotation
    checkAlignment();
  }

  function checkAlignment() {
    const { mirror1, mirror2, mirror3, mirror4 } = rotationAngles;

    const correctAngles = {
      mirror1: 45,
      mirror2: 135,
      mirror3: 45,
      mirror4: 135,
    };

    if (
      mirror1 === correctAngles.mirror1 &&
      mirror2 === correctAngles.mirror2 &&
      mirror3 === correctAngles.mirror3 &&
      mirror4 === correctAngles.mirror4
    ) {
      mirrors.forEach((mirror) => {
        mirror.removeEventListener("click", rotateMirror);
      });

      const iceBlock = document.getElementById("iceBlock");

      setTimeout(() => {
        iceBlock.classList.add("show"); // ice block shrinks and fades out
      }, 500);

      setTimeout(() => {
        iceBlock.style.backgroundImage = `url(${nextPhase.relic.image})`;
        iceBlock.classList.remove("show");
        iceBlock.classList.add("reveal"); // reveal relic
      }, 3000);

      setTimeout(() => {
        const feedbackMessage = document.getElementById("align-feedback");
        feedbackMessage.innerText = nextPhase.align.feedbackChallenge.right;
      }, 4000);

      setTimeout(() => {
        if (nextPhase.relic) {
          addRelicToInventory(nextPhase.relic);
        }

        setTimeout(() => {
          showNextButton(() => {
            loadScene(nextScene);
          });
        }, 1500);
      }, 5000);
    } else {
      const feedbackMessage = document.getElementById("align-feedback");
      feedbackMessage.innerText = nextPhase.align.feedbackChallenge.wrong;
    }
  }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Match

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

  function showPopup(text, color = "red") {
    const popupFeedback = document.getElementById("popup-match-feedback");
    popupFeedback.innerText = text;
    popupFeedback.style.color = color;
    popupFeedback.style.display = "block";
    setTimeout(() => {
      popupFeedback.style.display = "none";
    }, 3000); // hide after 3sec
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

          setTimeout(() => {
            showNextButton(() => {
              loadScene(nextScene);
            });
          }, 1500);
        }, 4000);
      }
    } else {
    //   feedbackMessage.innerText = match.feedbackChallenge.wrong;
    showPopup("Not quite, try again!");

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


  