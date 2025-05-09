/* exported getInspirations, initDesign, renderDesign, mutateDesign */


function getInspirations() {
  return [
    {
      name: "Capy", 
      assetUrl: "https://cdn.glitch.global/3cedf9db-2030-4874-bd04-cb147566bb01/capy.jpeg?v=1746488920330",
      credit: "Capybara from Wikipedia",
      shape: "R",
      squares: 350,
    },
    {
      name: "Loopy", 
      assetUrl: "https://cdn.glitch.global/3cedf9db-2030-4874-bd04-cb147566bb01/Screenshot%202025-05-06%20at%201.18.45%E2%80%AFPM.png?v=1746562765243",
      credit: "Stuffed loopy with wig and glasses",
      shape: "S",
      squares: 200
    },
    {
      name: "Zachary Chiu", 
      assetUrl: "https://cdn.glitch.global/3cedf9db-2030-4874-bd04-cb147566bb01/zacharychiu.jpeg?v=1746562749710",
      credit: "My roommate's Linkedin Profile picture",
      shape: "T",
      squares: 100
    },

  ];
}

function initDesign(inspiration) {
  let baseHeight = 120
  console.log(inspiration.credit)
  let WHRatio = inspiration.image.width/inspiration.image.height
  let newWidth = baseHeight * WHRatio
  resizeCanvas(newWidth, baseHeight);
  let design = {
    bg: 128,
    fg: []
  }
  
  for(let i = 0; i < inspiration.squares; i++) {
    design.fg.push({x: random(width),
                    y: random(height),
                    w: random(width/2),
                    h: random(height/2),
                    fill: random(255)})
  }
  return design;
}

function renderDesign(design, inspiration) {
  background(design.bg);
  noStroke();
  for(let box of design.fg) {
    fill(box.fill, 128);
    if (inspiration.shape == "T"){
      let xPeak = random(box.x, box.x + width);  
      let yPeak = box.y - height;           
      triangle(box.x,box.y,box.x+width,box.y,xPeak,yPeak)
    }
    else if(inspiration.shape == "R"){
      rect(box.x, box.y, box.w, box.h);
    }
    else if(inspiration.shape == "S"){
      rect(box.x,box.y, box.w,box.w)
    }
    
  }
}

function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);
  for(let box of design.fg) {
    box.fill = mut(box.fill, 0, 255, rate);
    box.x = mut(box.x, 0, width, rate);
    box.y = mut(box.y, 0, height, rate);
    box.w = mut(box.w, 0, width/2, rate);
    box.h = mut(box.h, 0, height/2, rate);
  }
}

function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}