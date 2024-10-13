// Fetches and displays scenes based on game progression.

import { handleChallenge } from "./challenges.js";
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
      question.innerHTML = sceneData.question;

      // clear feedback
      const feedbackMessage = document.getElementById("feedback-message");
      feedbackMessage.innerText = "";

      const optionsButtons = document.getElementById("options-buttons");
      const optionsTyping = document.getElementById("options-typing");

      // check input type
      if (sceneData.inputType === "options") {
        addButtonOptions(sceneData, sceneNumber);
        optionsButtons.style.display = "block";
        optionsTyping.style.display = "none";
      } else if (sceneData.inputType === "typing") {
        showTypingInput(sceneData, sceneNumber);
        optionsTyping.style.display = "block";
        optionsButtons.style.display = "none";
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

// Handle buttons for option-based scenes

function addButtonOptions(sceneData, sceneNumber) {
  const button1 = document.getElementById("button1");
  const button2 = document.getElementById("button2");

  // remove existing event listeners
  button1.removeEventListener("click", handleChoice);
  button2.removeEventListener("click", handleChoice);

  // update button text
  button1.innerText = sceneData.options[0];
  button2.innerText = sceneData.options[1];

  // add new event listeners to buttons
  button1.addEventListener("click", () =>
    handleChoice(sceneData.options[0], sceneData, sceneNumber)
  );
  button2.addEventListener("click", () =>
    handleChoice(sceneData.options[1], sceneData, sceneNumber)
  );
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Handle right/wrong options

// Handle player's choice for option-based input

function handleChoice(choice, sceneData, sceneNumber) {
  const feedbackMessage = document.getElementById("feedback-message");

  if (choice === sceneData.correctAnswer) {
    feedbackMessage.innerText = sceneData.feedback.right;

    // go to next scene after correct feedback
    setTimeout(() => {
      if (sceneData.relic) {
        addRelicToInventory(sceneData.relic);
      }
      loadScene(sceneData.nextScene);
    }, 2000);
  } else {
    feedbackMessage.innerText = sceneData.feedback.wrong;
  }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Typing based decisions

// Handle typing input scenes (navigation or challenges)

// function showTypingInput(sceneData, sceneNumber) {
//   const input = document.getElementById("options-typing-input");
//   const feedbackMessage = document.getElementById("feedback-message");

//   input.value = "";

//   // Remove any existing keydown event listeners to prevent stacking
//   input.removeEventListener("keydown", handleTypingInput);

//   input.addEventListener("keydown", function (e) {
//     if (e.key === "Enter") {
//       const playerInput = input.value.toLowerCase().trim();

//       // Check if it's a navigation scene
//       if (
//         sceneData.correctAnswer &&
//         playerInput.includes(sceneData.correctAnswer)
//       ) {
//         feedbackMessage.innerText = sceneData.feedback.right;

//         // proceed to next scene after feedback
//         setTimeout(() => {
//           if (sceneData.relic) {
//             addRelicToInventory(sceneData.relic);
//           }
//           loadScene(sceneNumber.nextScene); // Automatically move to the next scene
//         }, 2000);
//       } else if (sceneData.challengeType) {
//         const challengeResult = handleChallenge(sceneData, playerInput);

//         if (challengeResult === "success") {
//           // proceed to next scene
//           setTimeout(() => {
//             if (sceneData.relic) {
//               addRelicToInventory(sceneData.relic);
//             }
//             loadScene(sceneData.nextScene);
//           }, 2000);
//         }
//       } else {
//         feedbackMessage.innerText = sceneData.feedback.wrong;
//       }
//     } else {
//       feedbackMessage.innerText = sceneData.feedback.wrong || "Try again.";
//     }
//   });
// }

function showTypingInput(sceneData, sceneNumber) {
  const input = document.getElementById("options-typing-input");
  const feedbackMessage = document.getElementById("feedback-message");

  input.value = "";

  // Remove any existing keydown event listeners to prevent stacking
  input.removeEventListener("keydown", handleTypingInput);

  // Define handleTypingInput inside showTypingInput to have access to sceneData and sceneNumber
  function handleTypingInput(e) {
    if (e.key === "Enter") {
      const playerInput = input.value.toLowerCase().trim();

      // Check if it's a navigation scene
      if (
        sceneData.correctAnswer &&
        playerInput.includes(sceneData.correctAnswer)
      ) {
        feedbackMessage.innerText = sceneData.feedback.right;

        // proceed to next scene after feedback
        setTimeout(() => {
          if (sceneData.relic) {
            addRelicToInventory(sceneData.relic);
          }
          loadScene(sceneData.nextScene); // Correctly navigate to the next scene
        }, 2000);
      } else if (sceneData.challengeType) {
        const challengeResult = handleChallenge(sceneData, playerInput);

        if (challengeResult === "success") {
          // proceed to next scene
          setTimeout(() => {
            if (sceneData.relic) {
              addRelicToInventory(sceneData.relic);
            }
            loadScene(sceneData.nextScene);
          }, 2000);
        }
      } else {
        feedbackMessage.innerText = sceneData.feedback.wrong || "Try again.";
      }
    }
  }

  // Add the keydown event listener back
  input.addEventListener("keydown", handleTypingInput);
}
