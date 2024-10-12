// Fetches and displays scenes based on game progression.

import { handleChallenge } from "./challenges.js";

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Load Scene

// Fetch and load scene based on scene number
export async function loadScene(sceneNumber) {
  try {
    const response = await fetch(
      "https://github.com/diecatiamonteiro/text-adventure-game-browser/blob/main/data/data.json"
    );

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
        showTypingInput(sceneData, sceneNumber); // *********************

        optionsTyping.style.display = "block";
        optionsButtons.style.display = "none";
      }
    } else {
      throw new Error("Scene not found.");
    }
  } catch (error) {
    console.error("Error loading scene:", error);
    document.getElementById("feedback-message").innerText =
      "Error loading scene. Please try again later.";
  }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Button based decisions

// Handle buttons for option-based scenes

function addButtonOptions(sceneData, sceneNumber) {
  const button1 = document.getElementById("button1");
  const button2 = document.getElementById("button2");

  // update button text
  button1.innerText = sceneData.options[0];
  button2.innerText = sceneData.options[1];

  // remove existing event listeners
  const newButton1 = button1.cloneNode(true);
  const newButton2 = button2.cloneNode(true);
  button1.replaceWith(newButton1);
  button2.replaceWith(newButton2);

  // add new event listeners to buttons
  newButton1.addEventListener("click", () =>
    handleChoice(sceneData.options[0], sceneData, sceneNumber)
  );
  newButton2.addEventListener("click", () =>
    handleChoice(sceneData.options[1], sceneData, sceneNumber)
  );
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Typing based decisions

// Handle typing input scenes (navigation or challenges)

function showTypingInput(sceneData, sceneNumber) {
  const input = document.getElementById("options-typing-input");

  input.value = "";

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const playerInput = input.value.toLowerCase().trim();

      // Check if it's a navigation scene
      if (
        sceneData.navigationCommands &&
        sceneData.navigationCommands.includes(playerInput)
      ) {
        const feedbackMessage = document.getElementById("feedback-message");
        feedbackMessage.innerText = sceneData.feedback.right;

        // proceed to next scene after feedback
        setTimeout(() => {
          loadScene(sceneNumber + 1);
        }, 2000);
      } else if (sceneData.challengeType) {
        const challengeResult = handleChallenge(sceneData, playerInput);

        if (challengeResult === "success") {
          // proceed to next scene
          setTimeout(() => {
            loadScene(sceneNumber + 1);
          }, 2000);
        }
      } else {
        const feedbackMessage = document.getElementById("feedback-message");
        feedbackMessage.innerText =
          sceneData.feedback.wrong || "Please try again.";
      }
    }
  });
}
