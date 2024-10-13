// Fetches and displays scenes based on game progression.

import {
  handleRiddleChallenge,
  handleCombatChallenge,
  handlePuzzleChallenge,
} from "./challenges.js";
import { addRelicToInventory } from "./inventory.js";

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Load Scene

// Fetch and load scene based on scene number
export async function loadScene(sceneNumber) {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/diecatiamonteiro/text-adventure-game-browser/main/data/data.json"
    );
    console.log("Fetching data is working.");
    if (!response.ok) {
      throw new Error("Failed to fetch scene data.");
    }

    const data = await response.json();
    const sceneData = data[sceneNumber];

    if (sceneData) {
      // update description & image
      document.getElementById("scene-description").innerText =
        sceneData.description;
      document.getElementById("scene-image").src = sceneData.image;

      // "What will you do?"
      const question = document.getElementById("scene-question");
      question.innerHTML = sceneData.question || "What will you do?";

      // clear feedback
      const feedbackMessage = document.getElementById("feedback-message");
      feedbackMessage.innerText = "";

      // handle input type: buttons or input
      if (sceneData.sceneType === "buttons") {
        showButtonOptions(sceneData);
      } else if (sceneData.sceneType === "typing") {
        showTypingInput(sceneData);
      }

      // handle nextPhase (if exists)
      if (sceneData.nextPhase) {
        handleNextPhase(sceneData.nextPhase);
      }
    } else {
      throw new Error("Scene not found.");
    }
  } catch (error) {
    console.error("Error loading scene:", error);
    document.getElementById("feedback-message").innerText =
      "Error fetching scene data. Please try again later.";
  }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Button based decisions

// Handle buttons for button-based scenes

function showButtonOptions(sceneData, sceneNumber) {
  const optionsButtons = document.getElementById("options-buttons");
  const button1 = document.getElementById("button1");
  const button2 = document.getElementById("button2");

  // remove existing event listeners
  button1.removeEventListener("click", handleButtonChoices);
  button2.removeEventListener("click", handleButtonChoices);

  // update button text
  button1.innerText = sceneData.options[0];
  button2.innerText = sceneData.options[1];

  // add new event listeners to buttons
  button1.addEventListener("click", () =>
    handleButtonChoices(sceneData.options[0], sceneData)
  );
  button2.addEventListener("click", () =>
    handleButtonChoices(sceneData.options[1], sceneData)
  );

  // show buttons and hide input field
  optionsButtons.style.display = "block";
  document.getElementById("options-typing").style.display = "none";
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Handle button choice

// Handle player's choice for button-based scenes

function handleButtonChoices(choice, sceneData) {
  const feedbackMessage = document.getElementById("feedback-message");

  if (choice === sceneData.correctAnswer) {
    feedbackMessage.innerText = sceneData.feedback.right;

    // go to next scene after correct feedback
    setTimeout(() => {
      if (sceneData.relic) {
        addRelicToInventory(sceneData.relic);
      }
      loadScene(sceneData.nextScene);
    }, 7000);
  } else {
    feedbackMessage.innerText = sceneData.feedback.wrong;
  }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Typing based decisions

// Handle typing input scenes (navigation or challenges)

function showTypingInput(sceneData) {
  const input = document.getElementById("options-typing-input");
  const feedbackMessage = document.getElementById("feedback-message");

  input.value = "";

  // remove existing keydown event listeners to prevent stacking
  input.removeEventListener("keydown", handleTypingInput);

  // handle player input
  function handleTypingInput(e) {
    if (e.key === "Enter") {
      const playerInput = input.value.toLowerCase().trim();

      if (playerInput.includes(sceneData.correctAnswer)) {
        feedbackMessage.innerText = sceneData.feedback.right;

        // proceed to next scene after feedback
        setTimeout(() => {
          if (sceneData.relic) {
            addRelicToInventory(sceneData.relic);
          }
          loadScene(sceneData.nextScene); // Correctly navigate to the next scene
        }, 5000);
      } else {
        feedbackMessage.innerText = sceneData.feedback.wrong || "Try again.";
      }
    }
  }

  // add keydown event listener back
  input.addEventListener("keydown", handleTypingInput);

  // Show typing input and hide buttons
  document.getElementById("options-typing").style.display = "block";
  document.getElementById("options-buttons").style.display = "none";
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Next phase within scene

// Handle nextPhase logic

function handleNextPhase(nextPhase) {
  // Clear the current scene content to transition to the next phase
  document.getElementById("scene-description").innerText = "";
  document.getElementById("scene-image").src = ""; // Hide the current scene image
  document.getElementById("scene-question").innerText = ""; // Hide the current question

  // Hide options/buttons or typing input
  document.getElementById("options-buttons").style.display = "none";
  document.getElementById("options-typing").style.display = "none";

  // Show nextPhase details
  const nextPhaseSection = document.getElementById("next-phase");
  const nextPhaseDescription = document.getElementById(
    "next-phase-description"
  );
  nextPhaseDescription.innerText = nextPhase.description;
  nextPhaseSection.style.display = "block"; // Make the next phase section visible

  // Handle different challenge types (riddle, combat, puzzle)
  if (nextPhase.challengeType === "riddle") {
    displayRiddleChallenge(nextPhase.challenge.riddle);
  } else if (nextPhase.challengeType === "combat") {
    displayCombatChallenge(nextPhase.challenge.combat);
  } else if (nextPhase.challengeType === "puzzle") {
    displayPuzzleChallenge(nextPhase.challenge.puzzle);
  }
}
