// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Add relic to inventory

export let collectedRelics = [];

export function addRelicToInventory(relic) {
  if (
    collectedRelics.some((collectedRelic) => collectedRelic.name === relic.name)
  ) {
    console.log(`Relic ${relic.name} already collected.`);
    return;
  }

  collectedRelics.push(relic);
  updateInventoryUI();
  playRelicEffect();
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Add relic image to inventory

function updateInventoryUI() {
  const inventoryItems = document.querySelectorAll(".inventory-item");

  collectedRelics.forEach((relic, index) => {
    if (inventoryItems[index]) {
      inventoryItems[index].style.backgroundImage = `url(${relic.image})`;
      inventoryItems[index].classList.add("collected"); // Mark it as collected
    }
  });
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Effect on adding relic image

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

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ End scene effects on inventory

export function triggerRelicGlow() {
  const relics = document.querySelectorAll(".inventory-item");

  relics.forEach((relic, index) => {
    setTimeout(() => {
      relic.classList.add("glow");
    }, index * 1000); // delay each glow by 1 sec
  });
}

export function triggerEnergyWave() {
  const inventory = document.getElementById("inventory");
  setTimeout(() => {
    inventory.classList.add("glow-wave");
  }, 5000);
}

