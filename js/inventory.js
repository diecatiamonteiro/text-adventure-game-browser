// inventory.js

let collectedRelics = []; // Array to store collected relics

// Function to add a relic to the inventory
export function addRelicToInventory(relic) {
  // Add the relic to the collectedRelics array
  collectedRelics.push(relic);

  // Update the inventory visually
  updateInventoryUI();
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 

// Function to reset the inventory (e.g., on game restart)
export function resetInventory() {
  collectedRelics = []; // Clear the relics array

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
      inventoryItems[index].style.backgroundImage = `url(${relic.image})`; // Set relic image
      inventoryItems[index].classList.add("collected"); // Mark it as collected
    }
  });
}
