const draggableItem = document.getElementById("draggableItem");
const dropZone1 = document.getElementById("dropZone1"); // Correct drop zone
const dropZone2 = document.getElementById("dropZone2"); // Incorrect drop zone
const confirmButton = document.getElementById("confirmButton");

// Store the original position of draggableItem
const originalPosition = {
  x: draggableItem.offsetLeft,
  y: draggableItem.offsetTop,
};
let lastDropZone = null; // Tracks the last drop zone where the item was dropped
let droppedInCorrectZone = false; // Flag to track if the item was dropped in the correct zone
let dropType;

// Add drag event listeners
draggableItem.addEventListener("dragstart", handleDragStart);
draggableItem.addEventListener("dragend", handleDragEnd);
dropZone1.addEventListener("dragover", handleDragOver);
dropZone1.addEventListener("drop", handleDrop);
dropZone2.addEventListener("dragover", handleDragOver);
dropZone2.addEventListener("drop", handleDrop);

// Add click event listener to confirm button
confirmButton.addEventListener("click", confirmChoice);

function handleDragStart(e) {
  e.dataTransfer.setData("text/plain", ""); // Required for Firefox compatibility
  draggableItem.classList.add("dragging");
}

function handleDragOver(e) {
  e.preventDefault(); // Allows dropping
  e.dataTransfer.dropEffect = "move";
}

function handleDrop(e) {
  e.preventDefault();

  // Get the drop zone's type from the data attribute
  dropType = e.target.getAttribute("data-drop-type");

  // Track the last drop zone and set the draggableItem's position within it
  lastDropZone = e.target;

  const dropZoneRect = e.target.getBoundingClientRect();
  draggableItem.style.left = `${
    dropZoneRect.left + (dropZoneRect.width - draggableItem.offsetWidth) / 2
  }px`;
  draggableItem.style.top = `${
    dropZoneRect.top + (dropZoneRect.height - draggableItem.offsetHeight) / 2
  }px`;

  // Check if the drop zone is the correct zone
  if (dropType === "correct") {
    droppedInCorrectZone = true;
  } else {
    droppedInCorrectZone = false;
  }

  // Hide the draggable item after drop
  draggableItem.classList.add("hidden");
}

function handleDragEnd() {
  draggableItem.classList.remove("dragging");
}

function confirmChoice() {
  console.log(
    droppedInCorrectZone === true
      ? "Dropped in correct zone"
      : "Dropped in incorrect zone"
  );
  if (droppedInCorrectZone) {
    draggableItem.remove(); // Remove the item if the drop was in the correct zone
  } else {
    draggableItem.classList.remove("hidden");
    draggableItem.style.left = `${originalPosition.x}px`;
    draggableItem.style.top = `${originalPosition.y}px`;
    lastDropZone = null;
  }
}

[dropZone1, dropZone2].forEach((dropZone) => {
  dropZone.addEventListener("click", () => {
    if (dropZone === lastDropZone) {
      draggableItem.classList.remove("hidden");
      draggableItem.style.left = `${originalPosition.x}px`;
      draggableItem.style.top = `${originalPosition.y}px`;
      lastDropZone = null; // Clear the last drop zone
    }
  });
});
