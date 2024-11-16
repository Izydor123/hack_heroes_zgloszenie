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
    document.getElementById("draggableItem4"),
    document.getElementById("draggableItem5"),
    document.getElementById("draggableItem6"),
    document.getElementById("draggableItem7"),
    document.getElementById("draggableItem8")
];

const confirmButton = document.getElementById("confirmButton");
const draggableContainer = document.getElementById("draggableContainer");
const correctPlacements = Array(draggableItems.length).fill(false);

let draggedItem = null;
let holdTimeout = null;
let isHolding = false;

draggableItems.forEach((item, index) =>{
    item.addEventListener("dragstart", handleDragStart);
    item.addEventListener("dragend", handleDragEnd);
    item.addEventListener("touchstart", handleTouchStart, { passive: true });
    item.addEventListener("touchmove", handleTouchMove, { passive: false });
    item.addEventListener("touchend", handleTouchEnd);
    item.addEventListener("touchcancel", handleTouchCancel);
    item.dataset.index = index;
    item.dataset.inZone = false;
});

dropZones.forEach((zone, index) =>{
    zone.addEventListener("dragover", handleDragOver);
    zone.addEventListener("drop", handleDrop);
    zone.addEventListener("click", handleClick);
    zone.dataset.index = index;
    zone.dataset.itemInIt = (null,null);
});

confirmButton.addEventListener("click", confirmChoice);

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

function handleTouchStart(event) {
    draggedItem = event.target;

    holdTimeout = setTimeout(() => {
        isHolding = true;
        draggedItem.classList.add("dragging");
        draggedItem.style.cursor = "grabbing";
    }, 1000);
}

function handleTouchMove(event) {
    if (!isHolding || !draggedItem) return;

    event.preventDefault(); 

    const touch = event.touches[0];
    draggedItem.style.position = "absolute";
    draggedItem.style.left = `${touch.clientX - draggedItem.offsetWidth / 2}px`;
    draggedItem.style.top = `${touch.clientY - draggedItem.offsetHeight / 2}px`;
}

function handleTouchEnd(event) {
    clearTimeout(holdTimeout);

    if (!isHolding || !draggedItem) {
        draggedItem = null;
        return;
    }

    const touch = event.changedTouches[0];
    const dropZone = document.elementFromPoint(touch.clientX, touch.clientY);

    if (dropZone && dropZone.classList.contains("dropzone")) {
        handleDropOnZone(dropZone, draggedItem);
    } else {
        resetDraggedItem(draggedItem);
    }

    resetTouchState();
}

function handleTouchCancel() {
    clearTimeout(holdTimeout);
    if (draggedItem) resetDraggedItem(draggedItem);
    resetTouchState();
}


function handleDropOnZone(dropZone, item) {
    const dropZoneIndex = parseInt(dropZone.dataset.index);
    const draggableIndex = parseInt(item.dataset.index);

    draggableContainer.removeChild(item);
    dropZone.appendChild(item);

    item.classList.add("hidden");
    item.setAttribute("draggable", "false");
    dropZone.dataset.itemInIt = draggableIndex;

    correctPlacements[draggableIndex] =
        item.getAttribute("value") === dropZone.getAttribute("value");
}

function resetTouchState() {
    isHolding = false;
    draggedItem = null;
}

function handleClick(event) {
    const zone = dropZones[parseInt(event.target.dataset.index)];
    const itemsInZone = Array.from(zone.querySelectorAll('.draggable'));

    itemsInZone.forEach((item) => {
        if (zone.getAttribute('value') !== item.getAttribute('value')) {
            resetDraggableItem(item, zone);
        }
    });
}

function resetDraggableItem(item, zone){
    zone.removeChild(item);
    draggableContainer.appendChild(item);

    item.classList.remove("hidden");
    item.setAttribute("draggable", "true");
}

function resetDraggedItem(item) {
    item.style.position = "relative";
    item.style.left = "";
    item.style.top = "";
    item.classList.remove("dragging");
    if (!item.dataset.inZone) {
        draggableContainer.appendChild(item);
    }
}

function confirmChoice(){
    const allCorrect = correctPlacements.every(Boolean);

    const modal = document.getElementById('result-modal');
    const modalMessage = document.getElementById('modal-message');

    modal.style.display = 'block';
    if (allCorrect){
        modalMessage.innerHTML = "Gratulacje! Wszystkie śmieci znajdują się tam gdzie powinny!";
        if (!localStorage.getItem('firstVisit')) {
            localStorage.setItem('firstVisit', 'true');
            modalMessage.innerHTML = modalMessage.innerHTML + "<br>Z okazji tego że rozwiązałeś zagadkę pierwszy raz, otrzymujesz rabat 10% na bilet kolejowy PKP Intercity<br(dotyczy tylko zakupu przez stronę lub aplikację mobilną)!<br>Bon: xxxx-xxxx-xxxx";
        }
    } 
    else{
        modalMessage.innerHTML = "Niestety, śmieci nie zostały włożone do odpowiednich pojemników.";
        resetDraggableItems();
    }
}


function closeModal() {
    const modal = document.getElementById('result-modal');
    modal.style.display = 'none';
}

function resetDraggableItems(){
    dropZones.forEach((zone) => {
        const itemsInZone = Array.from(zone.querySelectorAll('.dragable'));
        
        itemsInZone.forEach((item) => {
            if (zone.getAttribute('value') !== item.getAttribute('value')) {
                resetDraggableItem(item, zone);
            }
        });
    });
}
