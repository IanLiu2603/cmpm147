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
  //Make Trees
  let forestWidth = floor(random(3, (numCols - 2) / 2));
  let backPoint = numCols - 1;
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < forestWidth; j++) {
      if(j >= forestWidth - 4){
        if(random() < 0.45){
          console.log("hi")
        }
        else{
          grid[i][numCols - j - 1] = "T";
          grid[i][j] = "T";
        }
      }
      else{
        grid[i][numCols - j - 1] = "T";
        grid[i][j] = "T";
      }
      
    }
  }

  
  //Make Lakes
  let numLakes = floor(random(2, 4));
  for (let i = 0; i < numLakes; i++) {
    let lakeWidth = floor(random(4, 6));
    let lakeHeight = floor(random(4, 6));

    let startRow = floor(random(0, numRows - lakeHeight));
    let startCol = floor(random(0, numCols - lakeWidth));

    for (let i = 0; i < lakeHeight; i++) {
      for (let j = 0; j < lakeWidth; j++) {
        grid[startRow + i][startCol + j] = "W";
      }
    }
  }
  //Path
  let pathWidth = floor(random(3, 4));
  let pathLength = floor(random(6, 9));

  let startRow = 0;
  if (random() > 0.5) {
    startRow = numRows - pathLength;
  }
  let startCol = floor(random(numCols / 2 - 3, numCols / 2 + 2));

  for (let i = 0; i < pathLength; i++) {
    for (let j = 0; j < pathWidth; j++) {
      grid[startRow + i][startCol + j] = "P";
    }
  }
  if (random() > 0.5) {
    let branchLength = floor(random(4, 7));
    let branchStartRow = startRow + pathLength - 1;
    let branchStartCol = startCol;

    if (branchStartCol + branchLength >= numCols) {
      branchLength = numCols - branchStartCol - 1;
    }

    for (let i = 0; i < pathWidth; i++) {
      for (let j = 0; j < branchLength; j++) {
        let row = branchStartRow - floor(pathWidth / 2) + i;
        let col = branchStartCol + j;
        if (gridCheck(grid, row, col, "_") || gridCheck(grid, row, col, "T"|| gridCheck(grid,row,col,"W"))) {
        grid[row][col] = "P";
        }
      }
    }
  } else {
    let branchLength = floor(random(4, 7));
    let branchStartRow = startRow + pathLength - 1;
    let branchStartCol = startCol;

    if (branchStartCol - branchLength < 0) {
      branchLength = branchStartCol;
    }

    for (let i = 0; i < pathWidth; i++) {
      for (let j = 0; j < branchLength; j++) {
        let row = branchStartRow - floor(pathWidth / 2) + i;
        let col = branchStartCol - j;
        if (gridCheck(grid, row, col, "_") || gridCheck(grid, row, col, "T" || gridCheck(grid,row,col,"W"))) {
          grid[row][col] = "P";
        }
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

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (gridCheck(grid, i, j, "_") || gridCheck(grid, i, j, "T")) {
        // Draw background tile
        let spicer = random();
        if (spicer < 0.18) {
          placeTile(i, j, floor(random(1, 4)), 0);
        } else placeTile(i, j, 0, 0);
      }

      if (gridCheck(grid, i, j, "T")) {
        //Place Trees
        placeTile(i, j, 14, 0);
      } else if (gridCheck(grid, i, j, "W")) {
        placeTile(i, j, 0, 13);
        drawContext(grid, i, j, "T", 0, 0, "water");
        drawContext(grid, i, j, "_", 0, 0, "water");
      } else if (gridCheck(grid, i, j, "P")) {
        placeTile(i, j, floor(random(0, 3)), 9);
        drawContext(grid, i, j, "W", 0, 0, "path");
        drawContext(grid, i, j, "_", 0, 0, "path");
        drawContext(grid, i, j, "T", 0, 0, "path");
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
  let final = 0;
  if (gridCheck(grid, i, j - 1, target)) {
    //Up
    final += 1;
  }
  if (gridCheck(grid, i - 1, j, target)) {
    //Left
    final += 2;
  }
  if (gridCheck(grid, i + 1, j, target)) {
    //Right
    final += 4;
  }
  if (gridCheck(grid, i, j + 1, target)) {
    //Down
    final += 8;
  }
  return final;
}

function drawContext(grid, i, j, target, ti, tj, type) {
  let lookup = null;
  if (type == "water") {
    lookup = waterlookup;
  } else if (type == "path") {
    lookup = pathlookup;
  }
  let code = gridCode(grid, i, j, target);
  const [tiOffset, tjOffset] = lookup[code];
  if (code != 0) {
    placeTile(i, j, ti + tiOffset, tj + tjOffset);
  }
}

const waterlookup = [
  [0, 0], //0
  [9, 1], //1 Left wall
  [10, 0], //2 //Top wall
  [9, 0], //3 Top left corner
  [10, 2], //4  Bottom Wall
  [9, 2], //5 Bottom Left Corner
  [6, 24], //6
  null, //7
  [11, 1], //8 Right Wall
  [6, 24],
  [11, 0], //Top Right
  null,
  [11, 2], //Bottom Right
  null,
  [0, 0],
  [0, 0],
];

const pathlookup = [
  [0, 0], //0
  [4, 4], //1 Left wall
  [5, 3], //2 //Top wall
  [4, 3], //3 Top left corner
  [5, 5], //4  Bottom Wall
  [4, 5], //5 Bottom Left Corner
  [6, 24], //6
  null, //7
  [6, 4], //8 Right Wall
  [6, 24],
  [6, 3], //Top Right
  null,
  [6, 5], //Bottom Right
  null,
  [0, 0],
  [0, 0],
];

function mousePressed() {
  // code to run when mouse is pressed
}