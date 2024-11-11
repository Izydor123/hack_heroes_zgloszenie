const dropZones = [
    document.getElementById("dropZone1"),
    document.getElementById("dropZone2"),
    document.getElementById("dropZone3"),
    document.getElementById("dropZone4")
];
const draggableItems = [
    document.getElementById("draggableItem1"),
    document.getElementById("draggableItem2"),
    document.getElementById("draggableItem3"),
    document.getElementById("draggableItem4")
];
const confirmButton = document.getElementById("confirmButton");
const draggableContainer = document.getElementById("draggableContainer");

const originalPositions = draggableItems.map(item => ({ x: item.offsetLeft, y: item.offsetTop }));
let correctPlacements = Array(draggableItems.length).fill(false);

// Initialize events for draggable items
draggableItems.forEach((item, index) => {
    item.addEventListener("dragstart", handleDragStart);
    item.addEventListener("dragend", handleDragEnd);
    item.dataset.index = index;
});

// Initialize events for drop zones
dropZones.forEach((zone, index) => {
    zone.addEventListener("dragover", handleDragOver);
    zone.addEventListener("drop", handleDrop);
    zone.addEventListener("click", handleClick);
    zone.dataset.index = index;
    zone.dataset.itemInIt = null;
});

// Event listener for the Confirm button
confirmButton.addEventListener("click", confirmChoice);

// Handle the drag start event
function handleDragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.dataset.index);
    event.target.style.cursor = "grabbing";
}

// Handle the drag end event
function handleDragEnd(event) {
    event.target.style.cursor = "grab";
}

// Handle the drag over event (enable dropping)
function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
}

// Handle the drop event
function handleDrop(event) {
    event.preventDefault();

    // Get the index of the dragged item and the drop zone
    const draggableIndex = parseInt(event.dataTransfer.getData("text/plain"));
    const dropZoneIndex = parseInt(event.target.dataset.index);

    const draggableItem = draggableItems[draggableIndex];
    const dropZone = dropZones[dropZoneIndex]
    
    // Append the draggable item to the drop zone
    dropZone.appendChild(draggableItem);
    
    // Mark it as visually dropped (hidden in drop zone)
    draggableItem.classList.add("hidden");
    draggableItem.setAttribute("draggable", "false");
    
    event.target.dataset.itemInIt = draggableIndex;
    correctPlacements[draggableIndex] = draggableItem.getAttribute('value') === dropZone.getAttribute('value');
}

// Handle resetting the item when clicking on the drop zone
function handleClick(event) {
    const dropZone = dropZones[parseInt(event.target.dataset.index)];
    const draggableIndex = parseInt(event.target.dataset.itemInIt);  // Assuming item should be reset to its original position
    
    if(draggableIndex != null){
        const draggableItem = draggableItems[draggableIndex];
        resetDraggableItem(draggableItem, dropZone);
    }
}

// Function to reset the draggable item back to the container
function resetDraggableItem(item, zone) {
    zone.removeChild(item);

    // Re-append the item to the container
    draggableContainer.appendChild(item);
    item.classList.remove("hidden");
    item.setAttribute("draggable", "true");
    
}

// Function to confirm the placement of all items
function confirmChoice() {
    const allCorrect = correctPlacements.every(Boolean);
    const gameResult = document.getElementById("gameResult");

    if (allCorrect) {
        gameResult.textContent = "Brawo! Wszyskie śmieci znajdują się tam gdzie być powinny!";
    } else {
        gameResult.textContent = "Nie wszystkie śmieci się znajdują tam gdzie powinny.";
        resetIncorrectItems();
    }
}

// Function to reset incorrectly placed items
function resetIncorrectItems() {
    correctPlacements.forEach((isCorrect, index) => {
        if (!isCorrect) {
            resetDraggableItem(draggableItems[index], index);
        }
    });
}
