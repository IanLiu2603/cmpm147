/* exported preload, setup, draw, placeTile */

/* global generateGrid drawGrid */

let seed = 0;
let tilesetImage;
let currentGrid = [];
let numRows, numCols;

function preload() {
  tilesetImage = loadImage(
    "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
  );
}

function reseed() {
  seed = (seed | 0) + 1109;
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed " + seed);
  regenerateGrid();
}

function regenerateGrid() {
  select("#asciiBox").value(gridToString(generateGrid(numCols, numRows)));
  reparseGrid();
}

function reparseGrid() {
  currentGrid = stringToGrid(select("#asciiBox").value());
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  numCols = select("#asciiBox").attribute("rows") | 0;
  numRows = select("#asciiBox").attribute("cols") | 0;

  createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer");
  select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

  select("#reseedButton").mousePressed(reseed);
  select("#asciiBox").input(reparseGrid);

  reseed();
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  randomSeed(seed);
  drawGrid(currentGrid);
}
/* exported generateGrid, drawGrid */
/* global placeTile */
// Path generation from ChatGPT
function generateGrid(numCols, numRows) {
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }
  
  let numRooms = floor(random(3,7))
  let roomPoints = []
  
  for (let i = 0; i < numRooms; i++){
    let roomWidth = floor(random(3,6))
    let roomHeight = floor(random(3,6))

    console.log(roomWidth, roomHeight)

    let startRow = floor(random(0, numRows - roomHeight));
    let startCol = floor(random(0, numCols - roomWidth));

    for(let i = 0; i < roomHeight; i++){
      for(let j = 0; j < roomWidth; j++){
        grid[startRow + i][startCol + j] = ".";
      }
    }
    let randRow = startRow + floor(random(0, roomHeight));
    let randCol = startCol + floor(random(0, roomWidth));
    roomPoints.push({ row: randRow, col: randCol });
    
  }
  for (let i = 1; i < roomPoints.length; i++) {
    let a = roomPoints[i - 1];
    let b = roomPoints[i];

    // Random L-shape path (horizontal then vertical or vice versa)
    if (random() < 0.5) {
      for (let x = min(a.col, b.col); x <= max(a.col, b.col); x++) {
        grid[a.row][x] = ".";
      }
      for (let y = min(a.row, b.row); y <= max(a.row, b.row); y++) {
        grid[y][b.col] = ".";
      }
    } else {
      for (let y = min(a.row, b.row); y <= max(a.row, b.row); y++) {
        grid[y][a.col] = ".";
      }
      for (let x = min(a.col, b.col); x <= max(a.col, b.col); x++) {
        grid[b.row][x] = ".";
      }
    }
  }
  return grid;
}
function placeTile(i, j, ti, tj) {
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}
function drawGrid(grid) {
  background(128);

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if (gridCheck(grid,i,j,"_")) {
        // Draw background tile
        let spicer = random()
        if (spicer < 0.18){
            placeTile(i,j,floor(random(1,4)),15)
        }
        else placeTile(i, j,0,23);
      }

      else if (gridCheck(grid,i,j,".")) {
        //check if dot
        placeTile(i, j, 1,21);
        drawContext(grid,i,j,"_",0,0)
      }
      
    }
  }
}


function gridCheck(grid, i, j, target) {
  // return false if not in grid
  // else return if grid[i][j] = target
  if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length) {
    return false;
  }
  return grid[i][j] == target;
}

function gridCode(grid, i, j, target) {
  let final = 0
  if(gridCheck(grid,i,j-1,target)){ //Up
    final += 1
  }
  if(gridCheck(grid,i-1,j,target)){ //Left
    final += 2
  }
  if(gridCheck(grid,i+1,j,target)){ //Right
    final += 4
  }
  if(gridCheck(grid,i,j+1,target)){ //Down
    final += 8
  }
  return final
}

function drawContext(grid, i, j, target,ti,tj) {
  let code = gridCode(grid,i,j,target)
  const [tiOffset, tjOffset] = lookup[code]; 
  if (code == 0){
    placeTile(i, j, 1,21);
    let spawner = random()
    if(spawner<0.03){
      placeTile(i,j,floor(random(0,6)),floor(random(28,31)))
    }
    else if(spawner < 0.1){
      placeTile(i,j,floor(random(5,8)),floor(random(25,28)))
    }
  }
  else{
    placeTile(i, j, ti + tiOffset, tj + tjOffset);
  }
}


const lookup = [
  [0,0],//0
  [5,22],//1 Left wall 
  [6,21],//2 //Top wall
  [5,21],//3 Top left corner
  [6,23],//4  Bottom Wall
  [5,23],//5 Bottom Left Corner
  [6,24],//6
  null,//7
  [7,22],//8 Right Wall
  [6,24],
  [7,21], //Top Right
  null,
  [7,23], //Bottom Right
  null,
  null,
  null
];

function mousePressed() {
  // code to run when mouse is pressed
}