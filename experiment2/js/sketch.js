// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

/* exported setup, draw */
let seed = 0;
let starX = 0
let starY = 0
let speed = 2

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
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
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
  drawBackground()
  drawFullWaveform(); // Draw initially
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  drawBackground()
  shootingStar()
  drawFullWaveform()
  
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}
function shootingStar(){
  let noiseScale = 0.014;
  let noiseLevel = 100; 
  let x = random(50,width-50)
  let nx = noiseScale * x
  let mountainy = height - noiseLevel * noise(nx)
  
  fill(255);
  noStroke()
  ellipse(starX, starY, 5);
  starX = starX + speed;
  starY = starY + speed;
  
  if(starX > width || starY > mountainy){
    starX = random(0,width-50);
    starY = 0;
    speed = random(1,3)
    seed++
  }
}

function drawFullWaveform() {
  //background(255); // Clear the canvas

  randomSeed(seed);

  let noiseScale = 0.014;
  let noiseLevel = 100; 

  let bottom = height; 

  stroke(0);
  for (let x = 0; x < width; x++) {
    let nx = noiseScale * x;
    let y = bottom - noiseLevel * noise(nx);
    line(x, bottom, x, y);
  }
}

function drawBackground(){
  randomSeed(seed);
  let c1,c2
  c1 = color(0);
  c2 = color(246, 77, 6);
  
  for(let y=0; y<height; y++){
    n = map(y,0,height,0,1);
    let newc = lerpColor(c1,c2,n);
    stroke(newc);
    line(0,y,width, y);
  }
  //Calc Sun Stuff
  let noiseScale = 0.014;
  let noiseLevel = 100; 
  let x = random(50,width-50)
  let nx = noiseScale * x
  let mountainy = height - noiseLevel * noise(nx)
  noStroke();
  fill(246, 77, 6);
  ellipse(x, mountainy-5, 40, 40); 
}