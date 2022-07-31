//Get variables from document
const colorPicker = document.getElementById("color-picker");
const colorButton = document.getElementById("color-button");
const rainbowButton = document.getElementById("rainbow-button");
const eraserButton = document.getElementById("eraser-button");
const darkenButton = document.getElementById("darken-button");
const lightenButton = document.getElementById("lighten-button");
const fillButton = document.getElementById("fill-button");
const gridButton = document.getElementById("grid-button");
const clearButton = document.getElementById("clear-button");
const gridSize = document.getElementById("grid-size");
const gridSlider = document.getElementById("grid-slider");
const grid = document.getElementById("grid");

let gridItems = [];

//Event Listeners
colorPicker.addEventListener('input', (e) => setCurrentColor(e.target.value));
colorButton.addEventListener('click', () => setActiveButton("color"));
rainbowButton.addEventListener('click', () => setActiveButton("rainbow"));
eraserButton.addEventListener('click', () => setActiveButton("eraser"));
darkenButton.addEventListener('click', () => setActiveButton("darken"));
lightenButton.addEventListener('click', () => setActiveButton("lighten"));
fillButton.addEventListener('click', fillGrid);
gridButton.addEventListener('click', applyGridBorders);
clearButton.addEventListener('click', () => resetGrid(true));
gridSlider.addEventListener('mousemove', (e) => updateGridValue(e.target.value));
gridSlider.addEventListener('change', (e) => updateGrid(e.target.value));

//Current Settings
let currentMode = "color";
let currentColor = "rgb(0, 0, 0)"; //Black
let currentSize = 16;

function setCurrentColor(newColor){
    currentColor = newColor;
}

function setCurrentMode(newMode){
    currentMode = newMode;
}

function setCurrentSize(newSize){
    currentSize = newSize;
}

//Functions
function createGrid(size=16) {
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;
  
    for (let i = 0; i < size * size; i++) {
        const gridItem = document.createElement("div");
        gridItem.classList.add("grid-item");
        gridItem.style.backgroundColor = "rgb(255, 255, 255)"; //white
        gridItem.addEventListener('mouseover', changeGridColor);
        grid.appendChild(gridItem);
        gridItems.push(gridItem);
    }
}

function updateGridValue(size){
    gridSize.textContent = `Size: ${size} x ${size}`;
}

function updateGrid(size) {
    //Set new current grid size
    setCurrentSize(size);
    resetGrid();
    gridButton.classList.remove("active");
}

function resetGrid(fromButton=false) {
    if(fromButton){
        clearButton.classList.add("active")
        grid.replaceChildren();
        setTimeout(() => clearButton.classList.remove("active"), 1000);
        createGrid(currentSize);
    }
    else{
        grid.replaceChildren();
        createGrid(currentSize);
    }
}

function changeGridColor(e){
    if(currentMode === "rainbow"){
        let randomR = Math.floor(Math.random() * 256);
        let randomG = Math.floor(Math.random() * 256);
        let randomB = Math.floor(Math.random() * 256);
        e.target.style.backgroundColor = `rgb(${randomR}, ${randomG}, ${randomB})`;
    }
    if(currentMode === "color"){
        e.target.style.backgroundColor = currentColor;
    }
    if(currentMode === "eraser"){
        e.target.style.backgroundColor = "white";
    }
    if(currentMode === "lighten"){
        let rgbString = e.target.style.backgroundColor;
        if(rgbString === "rgb(0, 0, 0)" ){
            e.target.style.backgroundColor = "rgb(25, 25, 25)";
        }
        else if(rgbString !== "rgb(255, 255, 255)"){
            let rgbArray = /\(([^)]*)\)/.exec(rgbString)[1].split(", ");
            let lighterR = parseInt(rgbArray[0]) + (parseInt(rgbArray[0]) * 1/3);
            let lighterG = parseInt(rgbArray[1]) + (parseInt(rgbArray[1]) * 1/3);
            let lighterB = parseInt(rgbArray[2]) + (parseInt(rgbArray[2]) * 1/3);
            e.target.style.backgroundColor = `rgb(${lighterR}, ${lighterG}, ${lighterB})`;
        }
    }
    if(currentMode === "darken"){
        let rgbString = e.target.style.backgroundColor;
        if(rgbString !== "rgb(0, 0, 0)"){
            let rgbArray = /\(([^)]*)\)/.exec(rgbString)[1].split(", ");
            let darkerR = parseInt(rgbArray[0]) - (parseInt(rgbArray[0]) * (1/4));
            let darkerG = parseInt(rgbArray[1]) - (parseInt(rgbArray[1]) * (1/4));
            let darkerB = parseInt(rgbArray[2]) - (parseInt(rgbArray[2]) * (1/4));
            e.target.style.backgroundColor = `rgb(${darkerR}, ${darkerG}, ${darkerB})`;
        }
    }
}

function setActiveButton(selectedMode){
    //Deactivate current mode
    if(currentMode === "rainbow"){
        rainbowButton.classList.remove('active');
    }
    if(currentMode === "color"){
        colorButton.classList.remove('active');
    }
    if(currentMode === "lighten"){
        lightenButton.classList.remove('active');
    }
    if(currentMode === "darken"){
        darkenButton.classList.remove('active');
    }
    if(currentMode === "eraser"){
        eraserButton.classList.remove('active');
    }

    //Activate new mode
    if(selectedMode === "rainbow"){
        rainbowButton.classList.add('active');
    }
    if(selectedMode === "color"){
        colorButton.classList.add('active');
    }
    if(selectedMode === "lighten"){
        lightenButton.classList.add('active');
    }
    if(selectedMode === "darken"){
        darkenButton.classList.add('active');
    }
    if(selectedMode === "eraser"){
        eraserButton.classList.add('active');
    }

    //Set new mode as current mode
    setCurrentMode(selectedMode);
}

function applyGridBorders(){
    if(gridButton.classList.contains("active")){
        gridItems.forEach((gridItem) => {
            gridItem.style.border = "";
        });
        gridButton.classList.remove("active");
    }
    else{
        gridItems.forEach((gridItem) => {
            gridItem.style.border = "1px solid black";
        });
        gridButton.classList.add("active");
    }
}

function fillGrid(){
    fillButton.classList.add("active");
    gridItems.forEach((gridItem) => {
        gridItem.style.backgroundColor = currentColor;
    });
    setTimeout(() => fillButton.classList.remove("active"), 1000);
}

window.onload = () => {
    createGrid();
    setActiveButton(currentMode);
};