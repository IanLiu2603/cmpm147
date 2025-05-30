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
  noStroke();
  let heights = [-30,-50,-70]
  
  if (XXH.h32("tile:" + [i, j], worldSeed) % 17 == 0) {
    push()
    console.log(clicks[[i,j]])
    
    let seed = XXH.h32("tile:" + [i, j], worldSeed)+ (clicks[[i,j]] | 0)*1000000;
    randomSeed(seed)
    stroke(color(0));
    strokeWeight(4);
    strokeJoin(ROUND);
    fill(255,192,0)
    let pyramidHeight = heights[floor(random(0,heights.length))]
    triangle(0, pyramidHeight, -tw,0, 0,th);
    triangle(0, pyramidHeight, 0,th, tw,0);
    //triangle(0, -50, -tw, th, 0,th);
    
    noFill();
    quad(-tw,0, 0,th, tw,0,0,-th);
    pop()

} else {
    push();
    fill(237,201,175)
    beginShape();
    vertex(-tw, 0);
    vertex(0, th);
    vertex(tw, 0);
    vertex(0, -th);
    endShape(CLOSE);
    pop()
  }


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
