"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

function p3_preload() {
}

function p3_setup() {}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  let colorPool = [[255, 60, 193], [61, 255, 73], [80, 29, 255], [255, 255, 1], [255, 132, 1]]
  if (XXH.h32("tile:" + [i, j], worldSeed) % 6 == 0) {
    let n = clicks[[i, j]] | 0;
     if( n % 2 == 1){
      push();
      fill(101, 7, 193)
      beginShape();
      vertex(-tw, 0);
      vertex(0, th);
      vertex(tw, 0);
      vertex(0, -th);
      endShape(CLOSE);
      pop()
    }
    else{
      push();
      let randColor = colorPool[floor(random(0,colorPool.length))]
      fill(randColor)
      beginShape();
      vertex(-tw, 0);
      vertex(0, th);
      vertex(tw, 0);
      vertex(0, -th);
      endShape(CLOSE);
      pop()
    }
    
    
  } 
  else {
    let n = clicks[[i, j]] | 0;
    if( n % 2 == 1){
      console.log("ASdASD")
      push();
      let randColor = colorPool[floor(random(0,colorPool.length))]
      fill(randColor)
      beginShape();
      vertex(-tw, 0);
      vertex(0, th);
      vertex(tw, 0);
      vertex(0, -th);
      endShape(CLOSE);
      pop()
    }
    else{
      push();
      fill(101, 7, 193)
      beginShape();
      vertex(-tw, 0);
      vertex(0, th);
      vertex(tw, 0);
      vertex(0, -th);
      endShape(CLOSE);
      pop()
    }
    
  }


  // let n = clicks[[i, j]] | 0;
  // if (n % 2 == 1) {
  //   fill(0, 0, 0, 32);
  //   ellipse(0, 0, 10, 5);
  //   translate(0, -10);
  //   fill(255, 255, 100, 128);
  //   ellipse(0, 0, 10, 10);
  // }

}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {}
