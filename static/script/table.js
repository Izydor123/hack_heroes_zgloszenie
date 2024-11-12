const rowsPerPage = 11;
let currPage = 0;

const table = document.getElementsByTagName("tbody")[0];
const rows = table.getElementsByTagName("tr");
const totalRows = rows.length;

function showPage(page){
    for(var i=0;i<totalRows;i++){
        rows[i].style.display = "none";
    }

    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    for(var i=start;i<end && i<totalRows;i++){
        rows[i].style.display = "";
    }
}

function prevPage(){
    if(currPage>0){
        currPage--;
        showPage(currPage);
    }
}

function nextPage(){
    if((currPage + 1)*rowsPerPage < totalRows){
        currPage++;
        showPage(currPage);
    }
}

showPage(currPage);

document.getElementById("prevButton").addEventListener("click", prevPage);
document.getElementById("nextButton").addEventListener("click", nextPage);