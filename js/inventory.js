let collectedRelics = [];

// Function to add a relic to the inventory
export function addRelicToInventory(relic) {
  collectedRelics.push(relic);

  updateInventoryUI();

  playRelicEffect();
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Function to reset the inventory (e.g., on game restart)
export function resetInventory() {
  collectedRelics = []; // clear array

  // Reset the visual inventory
  const inventoryItems = document.querySelectorAll(".inventory-item");
  inventoryItems.forEach((item) => {
    item.style.backgroundImage = "none";
    item.classList.remove("collected");
  });
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Function to update the inventory UI based on collected relics
function updateInventoryUI() {
  const inventoryItems = document.querySelectorAll(".inventory-item");

  // Loop through collected relics and update the UI
  collectedRelics.forEach((relic, index) => {
    if (inventoryItems[index]) {
      inventoryItems[index].style.backgroundImage = `url(${relic.image})`;
      inventoryItems[index].classList.add("collected"); // Mark it as collected
    }
  });
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function playRelicEffect() {
  const lastCollectedItem = collectedRelics[collectedRelics.length - 1];
  const inventoryItems = document.querySelectorAll(".inventory-item");

  // Check if there's a valid last collected item and corresponding inventory slot
  if (inventoryItems[collectedRelics.length - 1]) {
    const collectedItemElement = inventoryItems[collectedRelics.length - 1];

    collectedItemElement.classList.add("relicFloat"); // Add animation

    // Remove animation after some time (adjust based on animation duration)
    setTimeout(() => {
      collectedItemElement.classList.remove("relicFloat");
    }, 2000);
  }
}
