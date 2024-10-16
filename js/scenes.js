// Fetches and displays scenes based on game progression.

import {
  handleRiddleChallenge,
  handleCombatChallenge,
  handlePuzzleChallenge,
  handleAlignChallenge,
  handleMatchChallenge,
} from "./challenges.js";

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Load Scene

// Fetch and load scene based on scene number

export async function loadScene(sceneNumber) {
  try {
    clearPreviousScene();

    document.getElementById("scene").style.display = "block";
    document.getElementById("feedback").style.display = "block";

    const response = await fetch("./data/data.json");
    if (!response.ok) throw new Error("Failed to fetch scene data.");

    const data = await response.json();
    const sceneData = data[String(sceneNumber)];

    // Log the sceneData to ensure it's being retrieved correctly
    console.log("Loaded Scene Data:", sceneData);

    if (sceneData) {
      // Update scene description, image, and question
      document.getElementById("scene-description").innerText =
        sceneData.description;
      document.getElementById("scene-image").src = sceneData.image;
      document.getElementById("scene-question").innerText =
        sceneData.question || "What will you do?";

      // Show buttons and set their text
      showButtonOptions(sceneData);
    } else {
      throw new Error(`Scene ${sceneNumber} not found.`);
    }
  } catch (error) {
    console.error("Error loading scene:", error);
    document.getElementById("feedback-message").innerText =
      "Error: Scene not found.";
  }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Buttons for scene entry

// Handle buttons for button-based scenes

function showButtonOptions(sceneData) {
  const button1 = document.getElementById("button1");
  const button2 = document.getElementById("button2");

  button1.innerText = sceneData.options[0];
  button2.innerText = sceneData.options[1];

  button1.onclick = () => handleButtonChoices(sceneData.options[0], sceneData);
  button2.onclick = () => handleButtonChoices(sceneData.options[1], sceneData);

  document.getElementById("options-buttons").style.display = "block";
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Handle button choice

// Handle player's choice for button-based scenes

function handleButtonChoices(choice, sceneData) {
  const feedbackMessage = document.getElementById("feedback-message");

  // Check if sceneData and correctSceneAnswer exist
  if (!sceneData || !sceneData.correctSceneAnswer) {
    console.error("Error: sceneData or correctSceneAnswer is undefined.");
    feedbackMessage.innerText = "Error: Invalid scene configuration.";
    return; // Prevent further execution if there's an issue
  }

  // Check if sceneData exists and is for a button-based scene, and if the correct answer is defined
  if (sceneData.sceneType === "buttons" && !sceneData.correctSceneAnswer) {
    console.error("Error: correctSceneAnswer missing in button-based scene.");
    feedbackMessage.innerText = "Error: Scene configuration is incorrect.";
    return; // Prevent further execution if there's an issue
  }

  // Disable all buttons once correct answer is clicked
  function disableButtons() {
    const buttons = document.querySelectorAll(".button-for-option");
    buttons.forEach((button) => {
      button.disabled = true;
    });
  }

  // Re-enable buttons for next scene
  function enableButtons() {
    const buttons = document.querySelectorAll(".button-for-option");
    buttons.forEach((button) => {
      button.disabled = false;
    });
  }

  // Check if player chooses correct scene answer button
  if (choice === sceneData.correctSceneAnswer) {
    feedbackMessage.innerText = sceneData.feedback.right;

    disableButtons();

    setTimeout(() => {
      if (sceneData.nextPhase) {
        handleNextPhase(sceneData.nextPhase, sceneData.nextScene);
        enableButtons(); 
      } else {
        loadScene(sceneData.nextScene);
        enableButtons(); 
      }
    }, 3000);
  } else {
    feedbackMessage.innerText = sceneData.feedback.wrong;
  }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Next phase within scene

// Handle nextPhase logic

function handleNextPhase(nextPhase, nextScene) {
  clearPreviousScene();

  // If this is a challenge, hide the scene and feedback elements
  if (nextPhase.challengeType || nextPhase.endWords) {
    document.getElementById("scene").style.display = "none"; // Hide main scene container
    document.getElementById("feedback").style.display = "none"; // Hide feedback container
  }

  const nextPhaseSection = document.getElementById("next-phase");
  nextPhaseSection.style.display = "block";
  document.getElementById("next-phase-description").innerText =
    nextPhase.description;

  // end scene
  if (nextPhase.endImage) {
    setTimeout(() => {
      triggerRelicGlow();
    }, 3000);

    setTimeout(() => {
      triggerEnergyWave();
    }, 2000);

    setTimeout(() => {
      const sceneEndImage = document.getElementById("scene-end-image");
      sceneEndImage.src = nextPhase.endImage;
      sceneEndImage.style.display = "block";
      setTimeout(() => {
        sceneEndImage.classList.add("show"); // animation to ensure `display` takes effect
      }, 100);
    }, 15000);

    setTimeout(() => {
      const endWords = document.getElementById("end-words");
      endWords.innerText = nextPhase.endWords;
      endWords.style.display = "block";
      setTimeout(() => {
        endWords.classList.add("show"); // animations
      }, 100);
    }, 16000);
  } else {
    // handle challenges
    if (nextPhase.challengeType === "riddle") {
      handleRiddleChallenge(
        nextPhase.challenge.riddle,
        nextPhase,
        nextScene,
        loadScene
      );
    } else if (nextPhase.challengeType === "combat") {
      handleCombatChallenge(nextPhase, nextScene, loadScene);
    } else if (nextPhase.challengeType === "puzzle") {
      if (nextPhase.puzzle) {
        handlePuzzleChallenge(
          nextPhase.puzzle,
          nextPhase,
          nextScene,
          loadScene
        );
      }
    } else if (nextPhase.challengeType === "align") {
      handleAlignChallenge(nextPhase.align, nextPhase, nextScene, loadScene);
    } else if (nextPhase.challengeType === "match") {
      handleMatchChallenge(nextPhase.match, nextPhase, nextScene, loadScene);
    }
  }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Clear previous scene

function clearPreviousScene() {
  // main scene
  document.getElementById("scene-description").innerText = "";
  document.getElementById("scene-image").src = "";
  document.getElementById("scene-question").innerText = "";
  document.getElementById("feedback-message").innerText = "";

  // buttons & inputs
  document.getElementById("options-buttons").style.display = "none";
  document.getElementById("options-typing").style.display = "none";

  // challenges
  document.getElementById("next-phase-description").innerText = "";

  document.getElementById("riddle-challenge").style.display = "none";
  document.getElementById("riddle-question").innerText = "";
  document.getElementById("riddle-feedback-message").innerText = "";

  document.getElementById("combat-challenge").style.display = "none";
  document.getElementById("combat-description").innerText = "";

  document.getElementById("puzzle-challenge").style.display = "none";
  document.getElementById("puzzle-description").innerText = "";

  document.getElementById("align-challenge").style.display = "none";
  document.getElementById("align-feedback").innerText = "";

  document.getElementById("match-challenge").style.display = "none";
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ End-scene effects

function triggerRelicGlow() {
  const relics = document.querySelectorAll(".inventory-item");

  relics.forEach((relic, index) => {
    setTimeout(() => {
      relic.classList.add("glow");
    }, index * 1000); // delay each glow by 1 sec
  });
}

function triggerEnergyWave() {
  const inventory = document.getElementById("inventory");
  setTimeout(() => {
    inventory.classList.add("glow-wave");
  }, 5000);
}
