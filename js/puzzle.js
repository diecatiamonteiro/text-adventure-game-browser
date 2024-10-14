import { addRelicToInventory } from "./inventory.js";


export function handlePuzzleChallenge(puzzle, nextPhase, loadScene) {
    const puzzleDescription = document.getElementById("puzzle-description");
    puzzleDescription.innerText = puzzle.description;
  
    // Show puzzle challenge UI
    document.getElementById("puzzle-challenge").style.display = "block";
  
    function checkPuzzleCompletion() {
      const feedbackMessage = document.getElementById("feedback-message");
      const isPuzzleSolved = true; // Add puzzle-solving logic here
  
      if (isPuzzleSolved) {
        feedbackMessage.innerText = puzzle.feedbackChallenge.right;
  
        setTimeout(() => {
          if (nextPhase.relic) {
            addRelicToInventory(nextPhase.relic); // Add relic to inventory
          }
          loadScene(nextPhase.nextScene);
        }, 2000);
      } else {
        feedbackMessage.innerText = puzzle.feedbackChallenge.wrong;
      }
    }
  
    // Add puzzle interaction logic here
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
  