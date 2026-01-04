function getActualYear() {
    const date = new Date();
    return date.getFullYear();
}

let yearElement = document.getElementById("actualYear");

if (yearElement) {
    let yearActual = getActualYear();
    if(yearActual > 2025){
        yearElement.textContent = "2025 - " + getActualYear();
    }
}