// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Puzzle Challenge

export function handlePuzzleChallenge(puzzle, nextPhase, nextScene, loadScene) {
    const puzzleDescription = document.getElementById("puzzle-description");
    puzzleDescription.innerText = puzzle.description;
  
    document.getElementById("puzzle-challenge").style.display = "block";
  
    // shuffle puzzle pieces position
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  
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
        }, 4000);
  
        showNextButton(() => {
          loadScene(nextScene);
        });
      } else {
        console.log("Scene not found.");
      }
    }
  }