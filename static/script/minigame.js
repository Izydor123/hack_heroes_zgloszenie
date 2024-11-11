function handleDragStart(event){
    event.dataTransfer.setData("text/plain", event.target.dataset.index);
    event.target.style.cursor = "grabbing";
}

function handleDragEnd(event){
    event.target.style.cursor = "grab";
}

function handleDragOver(event){
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
}

function handleDrop(event){
    event.preventDefault();

    const draggableIndex = parseInt(event.dataTransfer.getData("text/plain"));
    const dropZoneIndex = parseInt(event.target.dataset.index);

    const draggableItem = draggableItems[draggableIndex];
    const dropZone = dropZones[dropZoneIndex]
    
    draggableContainer.removeChild(draggableItem)
    dropZone.appendChild(draggableItem);
    
    draggableItem.classList.add("hidden");
    draggableItem.setAttribute("draggable", "false");

    event.target.dataset.itemInIt = draggableIndex;
    correctPlacements[draggableIndex] = draggableItem.getAttribute('value') === dropZone.getAttribute('value');
}

function handleClick(event){
    const dropZone = dropZones[parseInt(event.target.dataset.index)];
    const draggableIndex = parseInt(event.target.dataset.itemInIt);
    
    if(draggableIndex != null){
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

    if(allCorrect){
        gameResult.textContent = "Brawo! Wszyskie śmieci znajdują się tam gdzie być powinny!";
    } 
    else{
        gameResult.textContent = "Nie wszystkie śmieci się znajdują tam gdzie powinny.";
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

draggableItems.forEach((item, index) => {
    item.addEventListener("dragstart", handleDragStart);
    item.addEventListener("dragend", handleDragEnd);
    item.dataset.index = index;
});

dropZones.forEach((zone, index) => {
    zone.addEventListener("dragover", handleDragOver);
    zone.addEventListener("drop", handleDrop);
    zone.addEventListener("click", handleClick);
    zone.dataset.index = index;
    zone.dataset.itemInIt = null;
});

confirmButton.addEventListener("click", confirmChoice);
