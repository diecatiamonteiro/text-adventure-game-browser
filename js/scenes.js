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
    clearPreviousScene();

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

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Button based decisions

// Handle buttons for button-based scenes

// function showButtonOptions(sceneData) {
//   const optionsButtons = document.getElementById("options-buttons");
//   const button1 = document.getElementById("button1");
//   const button2 = document.getElementById("button2");

//   // remove existing event listeners
//   button1.removeEventListener("click", handleButtonChoices);
//   button2.removeEventListener("click", handleButtonChoices);

//   // update button text
//   button1.innerText = sceneData.options[0];
//   button2.innerText = sceneData.options[1];

//   // add new event listeners to buttons
//   button1.addEventListener("click", () =>
//     handleButtonChoices(sceneData.options[0], sceneData)
//   );
//   button2.addEventListener("click", () =>
//     handleButtonChoices(sceneData.options[1], sceneData)
//   );

//   // show buttons and hide input field
//   optionsButtons.style.display = "block";
//   document.getElementById("options-typing").style.display = "none";
// }

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

  console.log("Scene Data:", sceneData);

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

  if (choice === sceneData.correctSceneAnswer) {
    feedbackMessage.innerText = sceneData.feedback.right;
    setTimeout(() => {
      if (sceneData.nextPhase) {
        handleNextPhase(sceneData.nextPhase, sceneData.nextScene); // Handle the nextPhase first
      } else {
        loadScene(sceneData.nextScene); // Move directly to next scene
      }
    }, 3000);
  } else {
    feedbackMessage.innerText = sceneData.feedback.wrong;
  }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Typing based decisions

// Handle typing input scenes (navigation or challenges)

// function showTypingInput(sceneData) {
//   const input = document.getElementById("options-typing-input");
//   const feedbackMessage = document.getElementById("feedback-message");

//   input.value = "";

//   // remove existing keydown event listeners to prevent stacking
//   input.removeEventListener("keydown", handleTypingInput);

//   // handle player input
//   function handleTypingInput(e) {
//     if (e.key === "Enter") {
//       const playerInput = input.value.toLowerCase().trim();

//       if (playerInput.includes(sceneData.correctAnswer)) {
//         feedbackMessage.innerText = sceneData.feedback.right;

//         // proceed to next scene after feedback
//         setTimeout(() => {
//           if (sceneData.nextPhase) {
//             handleNextPhase(sceneData.nextPhase, sceneData.nextScene);
//           } else {
//             loadScene(sceneData.nextScene);
//           }
//         }, 5000);
//       } else {
//         feedbackMessage.innerText = sceneData.feedback.wrong;
//       }
//     }
//   }

//   // Add keydown event listener
//   input.addEventListener("keydown", handleTypingInput);

//   // Show typing input and hide buttons
//   document.getElementById("options-typing").style.display = "block";
//   document.getElementById("options-buttons").style.display = "none";
// }

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Next phase within scene

// Handle nextPhase logic

// function handleNextPhase(nextPhase) {
//   // Clear the current scene content to transition to the next phase
//   document.getElementById("scene-description").innerText = "";
//   document.getElementById("scene-image").src = ""; // Hide the current scene image
//   document.getElementById("scene-question").innerText = ""; // Hide the current question

//   // Hide options/buttons or typing input
//   document.getElementById("options-buttons").style.display = "none";
//   document.getElementById("options-typing").style.display = "none";

//   // Show nextPhase details
//   const nextPhaseSection = document.getElementById("next-phase");
//   const nextPhaseDescription = document.getElementById(
//     "next-phase-description"
//   );
//   nextPhaseDescription.innerText = nextPhase.description;
//   nextPhaseSection.style.display = "block"; // Make the next phase section visible

//   // Handle different challenge types (riddle, combat, puzzle)

//   // Handle different challenge types (riddle, combat, puzzle)
//   if (nextPhase.challengeType === "riddle") {
//     handleRiddleChallenge(
//       nextPhase.challenge.riddle,
//       nextPhase,
//       nextScene,
//       loadScene
//     );
//   } else if (nextPhase.challengeType === "combat") {
//     handleCombatChallenge(
//       nextPhase.challenge.combat,
//       nextPhase,
//       nextScene,
//       loadScene
//     );
//   } else if (nextPhase.challengeType === "puzzle") {
//     handlePuzzleChallenge(
//       nextPhase.challenge.puzzle,
//       nextPhase,
//       nextScene,
//       loadScene
//     );
//   }
// }

// function handleNextPhase(nextPhase, nextScene) {
//     // Clear the current scene content
//     document.getElementById("scene-description").innerText = "";
//     document.getElementById("scene-image").src = "";
//     document.getElementById("scene-question").innerText = "";

//     // Hide buttons/input
//     document.getElementById("options-buttons").style.display = "none";
//     document.getElementById("options-typing").style.display = "none";

//     // Clear previous challenge elements (riddle, puzzle, combat)
//     document.getElementById("riddle-challenge").style.display = "none";
//     document.getElementById("combat-challenge").style.display = "none";
//     document.getElementById("puzzle-challenge").style.display = "none";

//     // Show nextPhase content
//     const nextPhaseSection = document.getElementById("next-phase");
//     nextPhaseSection.style.display = "block";
//     const nextPhaseDescription = document.getElementById("next-phase-description");
//     nextPhaseDescription.innerText = nextPhase.description;

//     // Log for debugging
//     console.log("Handling next phase:", nextPhase);

//     // Handle challenge types
//     if (nextPhase.challengeType === "riddle" && nextPhase.challenge && nextPhase.challenge.riddle) {
//       handleRiddleChallenge(nextPhase.challenge.riddle, nextPhase, nextScene, loadScene);

//     } else if (nextPhase.challengeType === "combat") {
//       // Handle combat challenge (structure is different)
//       if (nextPhase.enemy && nextPhase.playerActions) {
//         console.log("Combat data found:", nextPhase); // Log to confirm combat data
//         handleCombatChallenge(nextPhase, nextScene, loadScene);
//       } else {
//         console.error("Combat data is missing or incomplete.");
//       }

//     } else if (nextPhase.challengeType === "puzzle" && nextPhase.challenge && nextPhase.challenge.puzzle) {
//       handlePuzzleChallenge(nextPhase.challenge.puzzle, nextPhase, nextScene, loadScene);

//     } else {
//       console.error("Challenge data is missing or incomplete for the nextPhase.");
//     }
//   }

// function handleNextPhase(nextPhase, nextScene) {
//     // Clear scene content
//     document.getElementById("scene-description").innerText = "";
//     document.getElementById("scene-image").src = "";
//     document.getElementById("scene-question").innerText = "";

//     // Hide buttons and input
//     document.getElementById("options-buttons").style.display = "none";
//     document.getElementById("options-typing").style.display = "none";

//     // Clear previous challenge elements
//     document.getElementById("riddle-challenge").style.display = "none";
//     document.getElementById("combat-challenge").style.display = "none";
//     document.getElementById("puzzle-challenge").style.display = "none";

//     // Show nextPhase content
//     const nextPhaseSection = document.getElementById("next-phase");
//     nextPhaseSection.style.display = "block";
//     document.getElementById("next-phase-description").innerText = nextPhase.description;

//     // Handle specific challenge types
//     if (nextPhase.challengeType === "combat") {
//       handleCombatChallenge(nextPhase, nextScene, loadScene);
//     } else if (nextPhase.challengeType === "riddle") {
//       handleRiddleChallenge(nextPhase.challenge.riddle, nextPhase, nextScene, loadScene);
//     } else if (nextPhase.challengeType === "puzzle") {
//       handlePuzzleChallenge(nextPhase.challenge.puzzle, nextPhase, loadScene);
//     }

//     // Reset phase handling flag after challenge completes
//     setTimeout(() => {
//       isHandlingPhase = false;
//     }, 5000);
//   }

// function handleNextPhase(nextPhase, nextScene) {
//   // Clear the scene content
//   document.getElementById("scene-description").innerText = "";
//   document.getElementById("scene-image").src = "";
//   document.getElementById("scene-question").innerText = "";

//   // Hide buttons/input
//   document.getElementById("options-buttons").style.display = "none";
//   document.getElementById("options-typing").style.display = "none";

//   // Show nextPhase content (riddle, combat, puzzle)
//   const nextPhaseSection = document.getElementById("next-phase");
//   nextPhaseSection.style.display = "block";
//   document.getElementById("next-phase-description").innerText =
//     nextPhase.description;

//   // Handle different challenge types
//   if (nextPhase.challengeType === "riddle") {
//     handleRiddleChallenge(
//       nextPhase.challenge.riddle,
//       nextPhase,
//       nextScene,
//       loadScene
//     );
//   } else if (nextPhase.challengeType === "combat") {
//     handleCombatChallenge(nextPhase, nextScene, loadScene);
//   }

//   // Reset phase handling flag after challenge completes
//   setTimeout(() => {
//     isHandlingPhase = false;
//   }, 5000);
// }

function handleNextPhase(nextPhase, nextScene) {
  clearPreviousScene();

  const nextPhaseSection = document.getElementById("next-phase");
  nextPhaseSection.style.display = "block";
  document.getElementById("next-phase-description").innerText =
    nextPhase.description;

  // Handle different challenge types (riddle, combat, puzzle)
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
    handlePuzzleChallenge(nextPhase.challenge.puzzle, nextPhase, loadScene);
  }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function clearPreviousScene() {
    // Clear previous scene content
    document.getElementById("scene-description").innerText = "";
    document.getElementById("scene-image").src = "";
    document.getElementById("scene-question").innerText = "";
    document.getElementById("feedback-message").innerText = ""; // Clear general feedback
  
    // Hide buttons and input
    document.getElementById("options-buttons").style.display = "none";
    document.getElementById("options-typing").style.display = "none";
  
    // Clear any previous challenge elements (riddle, combat, puzzle)
    document.getElementById("riddle-challenge").style.display = "none"; // Hide riddle section
    document.getElementById("riddle-question").innerText = ""; // Clear riddle question
    document.getElementById("riddle-feedback-message").innerText = ""; // Clear riddle feedback
  
    // Hide combat and puzzle challenge sections if they exist
    document.getElementById("combat-challenge").style.display = "none";
    document.getElementById("puzzle-challenge").style.display = "none";
  
    // Clear any challenge-related content (for nextPhase descriptions)
    document.getElementById("next-phase-description").innerText = ""; // Clear any leftover nextPhase descriptions
    document.getElementById("combat-description").innerText = "";
    document.getElementById("puzzle-description").innerText = "";
  }
  
