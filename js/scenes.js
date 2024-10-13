// Fetches and displays scenes based on game progression.

import {
  handleRiddleChallenge,
  handleCombatChallenge,
  handlePuzzleChallenge,
} from "./challenges.js";
import { addRelicToInventory } from "./inventory.js";

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Load Scene

// Fetch and load scene based on scene number

// export async function loadScene(sceneNumber) {
//   try {
//     const response = await fetch(
//       "https://raw.githubusercontent.com/diecatiamonteiro/text-adventure-game-browser/main/data/data.json"
//     );
//     console.log("Fetching data is working.");
//     if (!response.ok) {
//       throw new Error("Failed to fetch scene data.");
//     }

//     const data = await response.json();
//     const sceneData = data[sceneNumber];

//     if (sceneData) {
//       // update description & image
//       document.getElementById("scene-description").innerText =
//         sceneData.description;
//       document.getElementById("scene-image").src = sceneData.image;

//       // "What will you do?"
//       const question = document.getElementById("scene-question");
//       question.innerHTML = sceneData.question || "What will you do?";

//       // clear feedback
//       const feedbackMessage = document.getElementById("feedback-message");
//       feedbackMessage.innerText = "";

//       // handle input type: buttons or input
//       if (sceneData.sceneType === "buttons") {
//         showButtonOptions(sceneData);
//       } else if (sceneData.sceneType === "typing") {
//         showTypingInput(sceneData);
//       }

//       // Handle direct scene transitions without a nextPhase
//       if (sceneData.nextScene && !sceneData.nextPhase) {
//         setTimeout(() => {
//           loadScene(sceneData.nextScene); // Direct scene transition
//         }, 2000);
//       }

//       // Handle nextPhase if exists (challenge-based phases)
//       if (sceneData.nextPhase) {
//         handleNextPhase(sceneData.nextPhase, sceneData.nextScene);
//       }
//     } else {
//       throw new Error(`Scene ${sceneNumber} not found.`);
//     }
//   } catch (error) {
//     console.error("Error loading scene:", error);
//     document.getElementById("feedback-message").innerText =
//       "Error: Scene not found.";
//   }
// }

let isHandlingPhase = false; // Flag to track if a phase is currently being handled

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
      document.getElementById("scene-description").innerText = sceneData.description;
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

      // Handle nextPhase if exists and no other phase is being handled
      if (sceneData.nextPhase && !isHandlingPhase) {
        isHandlingPhase = true; // Set the flag to indicate we are handling a phase
        handleNextPhase(sceneData.nextPhase, sceneData.nextScene);
      }

      // Handle nextScene only if no phase is being handled
      else if (sceneData.nextScene && !sceneData.nextPhase && !isHandlingPhase) {
        setTimeout(() => {
          loadScene(sceneData.nextScene); // Direct scene transition
        }, 3000);
      }
    } else {
      throw new Error(`Scene ${sceneNumber} not found.`);
    }
  } catch (error) {
    console.error("Error loading scene:", error);
    document.getElementById("feedback-message").innerText = "Error: Scene not found.";
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
    }, 5000);
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
  
function handleNextPhase(nextPhase, nextScene) {
    // Clear the current scene content
    document.getElementById("scene-description").innerText = "";
    document.getElementById("scene-image").src = "";
    document.getElementById("scene-question").innerText = "";
  
    // Hide buttons/input
    document.getElementById("options-buttons").style.display = "none";
    document.getElementById("options-typing").style.display = "none";
  
    // Clear previous challenge elements (riddle, puzzle, combat)
    document.getElementById("riddle-challenge").style.display = "none";
    document.getElementById("combat-challenge").style.display = "none";
    document.getElementById("puzzle-challenge").style.display = "none";
  
    // Show nextPhase content
    const nextPhaseSection = document.getElementById("next-phase");
    nextPhaseSection.style.display = "block";
    const nextPhaseDescription = document.getElementById("next-phase-description");
    nextPhaseDescription.innerText = nextPhase.description;
  
    // Log for debugging
    console.log("Handling next phase:", nextPhase);
  
    // Handle challenge types
    if (nextPhase.challengeType === "riddle" && nextPhase.challenge && nextPhase.challenge.riddle) {
      handleRiddleChallenge(nextPhase.challenge.riddle, nextPhase, nextScene, loadScene);
    } else if (nextPhase.challengeType === "combat") {
      // Handle combat challenge (structure is different)
      if (nextPhase.enemy && nextPhase.playerActions) {
        console.log("Combat data found:", nextPhase); // Log to confirm combat data
        handleCombatChallenge(nextPhase, nextScene, loadScene);
      } else {
        console.error("Combat data is missing or incomplete.");
      }
    } else if (nextPhase.challengeType === "puzzle" && nextPhase.challenge && nextPhase.challenge.puzzle) {
      handlePuzzleChallenge(nextPhase.challenge.puzzle, nextPhase, loadScene);
    } else {
      console.error("Challenge data is missing or incomplete for the nextPhase.");
    }
  
    // Once phase handling is done, reset the phase handling flag
    setTimeout(() => {
      isHandlingPhase = false; // Allow the game to move to the next scene if needed
    }, 5000); // Adjust the timeout based on challenge duration
  }
  
  