const draggableItem = document.getElementById("draggableItem");
const dropZone1 = document.getElementById("dropZone1");
const dropZone2 = document.getElementById("dropZone2");
const confirmButton = document.getElementById("confirmButton");

const originalPosition = {x: draggableItem.offsetLeft, y: draggableItem.offsetTop,};
let lastDropZone = null;
let droppedInCorrectZone = false;
let dropType = null;

draggableItem.addEventListener("dragstart", handleDragStart);
draggableItem.addEventListener("dragend", handleDragEnd);
dropZone1.addEventListener("dragover", handleDragOver);
dropZone1.addEventListener("drop", handleDrop);
dropZone2.addEventListener("dragover", handleDragOver);
dropZone2.addEventListener("drop", handleDrop);

confirmButton.addEventListener("click", confirmChoice);

function handleDragStart(event) {
    event.dataTransfer.setData("text/plain", "");
    draggableItem.classList.add("dragging");
}

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
}

function handleDrop(event) {
    event.preventDefault();

    dropType = e.target.getAttribute("data-drop-type");

    lastDropZone = e.target;

    const dropZoneRect = e.target.getBoundingClientRect();
    draggableItem.style.left = `${dropZoneRect.left + (dropZoneRect.width - draggableItem.offsetWidth) / 2}px`;
    draggableItem.style.top = `${dropZoneRect.top + (dropZoneRect.height - draggableItem.offsetHeight) / 2}px`;

    if (dropType === "correct") {
        droppedInCorrectZone = true;
    } 
    else {
        droppedInCorrectZone = false;
    }

    draggableItem.classList.add("hidden");
}

function handleDragEnd() {
    draggableItem.classList.remove("dragging");
}

function confirmChoice() {
    console.log(droppedInCorrectZone === true? "Dropped in correct zone": "Dropped in incorrect zone");
    
    if (droppedInCorrectZone) {
        draggableItem.remove(); 
    } 
    else {
        draggableItem.classList.remove("hidden");
        draggableItem.setAttribute('draggable', 'true');
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
      lastDropZone = null;
    }
  });
});
