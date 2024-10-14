import { addRelicToInventory } from "./inventory.js";

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
  