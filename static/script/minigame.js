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
const correctPlacements = Array(draggableItems.length).fill(false);

let draggedItem = null;

function handleDragStart(event){
    event.dataTransfer.setData("text/plain", event.target.dataset.index);
    event.target.style.cursor = "grabbing";
}

function handleDragEnd(event) {
    event.target.style.cursor = "grab";
}

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
}

function handleDrop(event){
    event.preventDefault();

    const draggableIndex = parseInt(event.dataTransfer.getData("text/plain"));
    const dropZoneIndex = parseInt(event.target.dataset.index);

    const draggableItem = draggableItems[draggableIndex];
    const dropZone = dropZones[dropZoneIndex];

    draggableContainer.removeChild(draggableItem);
    dropZone.appendChild(draggableItem);

    draggableItem.classList.add("hidden");
    draggableItem.setAttribute("draggable", "false");

    event.target.dataset.itemInIt = draggableIndex;
    correctPlacements[draggableIndex] = draggableItem.getAttribute('value') === dropZone.getAttribute('value');
}

function handleTouchStart(event){
    draggedItem = event.target;
    draggedItem.style.cursor = "grabbing";
    draggedItem.classList.add("dragging");

    draggedItem.dataset.index = event.target.dataset.index;
}

function handleTouchMove(event){
    event.preventDefault();
    const touch = event.touches[0];

    draggedItem.style.position = "absolute";
    draggedItem.style.left = `${touch.clientX - draggedItem.offsetWidth / 2}px`;
    draggedItem.style.top = `${touch.clientY - draggedItem.offsetHeight / 2}px`;
}

function handleTouchEnd(event){
    const touch = event.changedTouches[0];
    const dropZone = document.elementFromPoint(touch.clientX, touch.clientY);

    if (dropZone && dropZone.classList.contains("dropzone")){
        const dropZoneIndex = parseInt(dropZone.dataset.index);
        const draggableIndex = parseInt(draggedItem.dataset.index);
        const correctZone = dropZones[dropZoneIndex];

        draggableContainer.removeChild(draggedItem);
        correctZone.appendChild(draggedItem);
        
        draggedItem.classList.add("hidden");
        draggedItem.setAttribute("draggable", "false");
        
        dropZone.dataset.itemInIt = draggableIndex;
        correctPlacements[draggableIndex] = draggedItem.getAttribute('value') === correctZone.getAttribute('value');
    }

    draggedItem.classList.remove("dragging");
    draggedItem.style.position = "relative";
    draggedItem = null;
}

function handleClick(event){
    const dropZone = dropZones[parseInt(event.target.dataset.index)];
    const draggableIndex = parseInt(event.target.dataset.itemInIt);

    if (draggableIndex != null) {
        const draggableItem = draggableItems[draggableIndex];
        resetDraggableItem(draggableItem, dropZone);
    }
}

function resetDraggableItem(item, zone){
    zone.removeChild(item);
    draggableContainer.appendChild(item);

    item.classList.remove("hidden");
    item.setAttribute("draggable", "true");
}

function confirmChoice(){
    const allCorrect = correctPlacements.every(Boolean);
    const gameResult = document.getElementById("gameResult");

    if (allCorrect){
        gameResult.textContent = "Congratulations! All items are correctly placed!";
    } 
    else{
        gameResult.textContent = "Not all items are placed correctly.";
        resetDraggableItems();
    }
}

function resetDraggableItems(){
    dropZones.forEach((zone) => {
        const itemInZone = zone.querySelector('.draggable');
        if (itemInZone && zone.getAttribute('value') != itemInZone.getAttribute('value')) {
            resetDraggableItem(itemInZone, zone);
        }
    });
}

draggableItems.forEach((item, index) =>{
    item.addEventListener("dragstart", handleDragStart);
    item.addEventListener("dragend", handleDragEnd);
    item.addEventListener("touchstart", handleTouchStart, { passive: true });
    item.addEventListener("touchmove", handleTouchMove, { passive: false });
    item.addEventListener("touchend", handleTouchEnd);
    item.dataset.index = index;
});

dropZones.forEach((zone, index) =>{
    zone.addEventListener("dragover", handleDragOver);
    zone.addEventListener("drop", handleDrop);
    zone.addEventListener("click", handleClick);
    zone.dataset.index = index;
    zone.dataset.itemInIt = null;
});

confirmButton.addEventListener("click", confirmChoice);
