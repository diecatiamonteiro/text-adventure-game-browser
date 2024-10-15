// Fetches and displays scenes based on game progression.

// import {handleRiddleChallenge} from "./riddle.js";
// import {handleCombatChallenge} from "./combat.js";
// import {handlePuzzleChallenge} from "./combat.js";

import {
  handleRiddleChallenge,
  handleCombatChallenge,
  handlePuzzleChallenge,
  handleAlignChallenge,
} from "./challenges.js";

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
    if (nextPhase.puzzle) {
      // Show the puzzle challenge
      document.getElementById("puzzle-challenge").style.display = "block"; // Make sure this is visible
      handlePuzzleChallenge(nextPhase.puzzle, nextPhase, nextScene, loadScene);
    }
  } else if (nextPhase.challengeType === "align") {
    handleAlignChallenge(nextPhase.align, nextPhase, nextScene, loadScene);
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
}

    // function hidePreviousSceneInChallenges() {
    //     // Only hide specific challenge-related fields, not the entire scene
    //     const feedback = document.getElementById("feedback");
    //     if (feedback) {
    //       feedback.style.display = "none"; // Hide feedback
    //     }
      
    //     const alignChallenge = document.getElementById("align-challenge");
    //     if (alignChallenge) {
    //       alignChallenge.style.display = "none"; // Hide the align challenge
    //     }
      
    //     const riddleChallenge = document.getElementById("riddle-challenge");
    //     if (riddleChallenge) {
    //       riddleChallenge.style.display = "none"; // Hide riddle challenge
    //     }
      
    //     const combatChallenge = document.getElementById("combat-challenge");
    //     if (combatChallenge) {
    //       combatChallenge.style.display = "none"; // Hide combat challenge
    //     }
      
    //     const puzzleChallenge = document.getElementById("puzzle-challenge");
    //     if (puzzleChallenge) {
    //       puzzleChallenge.style.display = "none"; // Hide puzzle challenge
    //     }
      
    //     // Optionally remove any margin or padding that may still cause spacing
    //     document.getElementById("scene").style.margin = "0";
    //     document.getElementById("scene").style.padding = "0";
    //   }
    