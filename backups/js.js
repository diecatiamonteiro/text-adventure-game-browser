export function handleMatchChallenge(match, nextPhase, nextScene, loadScene) {
  const matchChallengeContainer = document.getElementById("match-challenge");
  const relicsContainer = document.getElementById("relics-container");
  const powersContainer = document.getElementById("powers-container");
  const powerDropZone = document.getElementById("power-drop-zone");
  const feedbackMessage = document.getElementById("match-feedback");

  // Clear previous content
  relicsContainer.innerHTML = "";
  powersContainer.innerHTML = "";
  powerDropZone.innerHTML = "";
  feedbackMessage.innerText = "";
  matchChallengeContainer.style.display = "block";

  const matchDescription = document.getElementById("match-description");
  matchDescription.innerText = match.description;

  // Function to shuffle the array
  function shuffleRelicsArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Shuffle powers' positioning
  const powers = match.relics.map((relic) => relic.power); // Get the powers array from relics
  const shuffledPowers = shuffleRelicsArray([...powers]); // Shuffle the powers array

  // Display relic names and images
  match.relics.forEach((relic, index) => {
    // Create div for relic
    const relicElement = document.createElement("div");
    relicElement.classList.add("relic");

    // Relic name
    const relicName = document.createElement("h4");
    relicName.classList.add("relic-name");
    relicName.innerText = relic.name;

    // Relic image
    const relicImage = document.createElement("img");
    relicImage.classList.add("relic-image");
    relicImage.src = relic.image;
    relicImage.alt = relic.name;

    relicElement.appendChild(relicName);
    relicElement.appendChild(relicImage);
    relicsContainer.appendChild(relicElement);

    // Create power drop zone for each relic
    const powerSlot = document.createElement("div");
    powerSlot.classList.add("power-slot");
    powerSlot.dataset.slot = index; // This will help identify which power should go into this slot
    powerSlot.addEventListener("dragover", handleDragOver);
    powerSlot.addEventListener("drop", (event) =>
      handleDrop(event, index, match)
    );
    powerDropZone.appendChild(powerSlot);
  });

  // Display shuffled draggable powers below the power drop zone
  shuffledPowers.forEach((power, index) => {
    const powerElement = document.createElement("div");
    powerElement.classList.add("power");
    powerElement.draggable = true;
    powerElement.dataset.correctIndex = match.relics.findIndex(
      (relic) => relic.power === power
    ); // Set the correct index for matching

    const powerDescription = document.createElement("p");
    powerDescription.classList.add("power-description");
    powerDescription.innerText = power;

    powerElement.appendChild(powerDescription);
    powersContainer.appendChild(powerElement);

    // Add dragstart event to power element
    powerElement.addEventListener("dragstart", handleDragStart);
  });
}

// Drag and Drop Handlers
function handleDragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.dataset.correctIndex);
}

function handleDragOver(event) {
  event.preventDefault(); // Necessary to allow dropping
}

function handleDrop(event, slotIndex, match) {
  event.preventDefault();
  const draggedPowerIndex = event.dataTransfer.getData("text/plain");
  const feedbackMessage = document.getElementById("match-feedback");

  // Check if the dropped power matches the correct slot
  if (draggedPowerIndex == slotIndex) {
    const draggedElement = document.querySelector(
      `[data-correct-index="${draggedPowerIndex}"]`
    );
    event.target.appendChild(draggedElement); // Move power to power-slot
    draggedElement.draggable = false; // Disable further dragging

    // Check if all powers are correctly placed
    const placedPowers = document.querySelectorAll(".power-slot .power");
    if (placedPowers.length === match.relics.length) {
      feedbackMessage.innerText = match.feedbackChallenge.right;

      // Add relic to inventory and move to next scene
      setTimeout(() => {
        if (nextPhase.relic) {
          addRelicToInventory(nextPhase.relic);
        }
        showNextButton(() => loadScene(nextScene));
      }, 4000);
    }
  } else {
    // Incorrect match
    feedbackMessage.innerText = match.feedbackChallenge.wrong;
  }
}

// OLD ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Match Challenge

export function handleMatchChallenge(match, nextPhase, nextScene, loadScene) {
  // Clear previous challenge content
  const matchChallengeContainer = document.getElementById("match-challenge");
  const relicsContainer = document.getElementById("relics-container");
  const powersContainer = document.getElementById("powers-container");
  const powerDropZone = document.getElementById("power-drop-zone");
  const feedbackElement = document.getElementById("match-feedback");

  relicsContainer.innerHTML = "";
  powersContainer.innerHTML = "";
  powerDropZone.innerHTML = ""; // Clear the power slots
  feedbackElement.innerText = "";

  // Display the match description
  const matchDescription = document.getElementById("match-description");
  matchDescription.innerText = match.description;

  // Shuffle powers to make the game challenging
  const shuffledPowers = shuffleArray([...match.relics]);

  // Create relics (fixed)
  match.relics.forEach((relic, index) => {
    const relicElement = document.createElement("div");
    relicElement.classList.add("relic");

    const relicName = document.createElement("h4");
    relicName.classList.add("relic-name");
    relicName.innerText = relic.name;

    const relicImage = document.createElement("img");
    relicImage.classList.add("relic-image");
    relicImage.src = relic.image;
    relicImage.alt = relic.name;

    relicElement.appendChild(relicName);
    relicElement.appendChild(relicImage);
    relicsContainer.appendChild(relicElement);
  });

  // Create power slots
  for (let i = 0; i < match.relics.length; i++) {
    const powerSlot = document.createElement("div");
    powerSlot.classList.add("power-slot");
    powerSlot.dataset.slot = i; // Slot index
    powerSlot.addEventListener("dragover", handleDragOver);
    powerSlot.addEventListener("drop", (event) => handleDrop(event, i, match));
    powerDropZone.appendChild(powerSlot);
  }

  // Create shuffled powers in the powers container
  shuffledPowers.forEach((power, index) => {
    const powerElement = document.createElement("div");
    powerElement.classList.add("power");
    powerElement.draggable = true;
    powerElement.dataset.correctIndex = match.relics.findIndex(
      (r) => r.power === power.power
    ); // Correct index for matching

    const powerDescription = document.createElement("p");
    powerDescription.innerText = power.power;

    powerElement.appendChild(powerDescription);
    powersContainer.appendChild(powerElement);

    // Add dragstart event to power element
    powerElement.addEventListener("dragstart", handleDragStart);
  });

  // Display match challenge container
  matchChallengeContainer.style.display = "block";
}

//   ***************** Helper function to shuffle powers
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
//   ***************** end

// Drag and Drop Handlers
function handleDragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.dataset.correctIndex);
}

function handleDragOver(event) {
  event.preventDefault(); // Necessary to allow dropping
}

function handleDrop(event, slotIndex, match) {
  event.preventDefault();
  const draggedPowerIndex = event.dataTransfer.getData("text/plain");
  const feedbackElement = document.getElementById("match-feedback");

  // Check if the dropped power matches the correct slot
  if (draggedPowerIndex == slotIndex) {
    const draggedElement = document.querySelector(
      `[data-correct-index="${draggedPowerIndex}"]`
    );
    event.target.appendChild(draggedElement); // Move power to power-slot
    draggedElement.draggable = false; // Disable further dragging

    // Check if all powers are correctly placed
    const placedPowers = document.querySelectorAll(".power-slot .power");
    if (placedPowers.length === match.relics.length) {
      feedbackElement.innerText = match.feedbackChallenge.right;

      // Add relic to inventory and move to next scene
      setTimeout(() => {
        if (nextPhase.relic) {
          addRelicToInventory(nextPhase.relic);
        }
        showNextButton(() => loadScene(nextScene));
      }, 4000);
    }
  } else {
    // Incorrect match
    feedbackElement.innerText = match.feedbackChallenge.wrong;
  }
}

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
