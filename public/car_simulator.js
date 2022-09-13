const canvas = document.getElementById('canvas');
// rendering context for canvas
const ctx = canvas.getContext('2d');

const carImage = new Image(150, 150);
carImage.src = "car.png";

const treeImage = new Image(50, 50);
treeImage.src = "tree.png";

function drawCar() {
  ctx.drawImage(carImage, canvas.width/2-carImage.width/2+carX, canvas.height/2-carImage.height/2, carImage.width, carImage.height);
}

function drawRoad() {
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'navy';
  ctx.beginPath();
  ctx.moveTo(canvas.width/2 - roadWidth, 0);
  ctx.lineTo(canvas.width/2 - roadWidth, canvas.height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(canvas.width/2 + roadWidth, 0);
  ctx.lineTo(canvas.width/2 + roadWidth, canvas.height);

  ctx.stroke();
}

function drawTrees() {
  let numOfTrees = parseInt(canvas.height/distanceOfTrees)+2;
  let offset = (carY % distanceOfTrees)-treeImage.height;
  for (let i=0; i<numOfTrees; i++)
  {
    let treeX = canvas.width/2-roadWidth-treeImage.width;
    let treeY = (i*distanceOfTrees)+offset;
    ctx.drawImage(treeImage, treeX, treeY, treeImage.width, treeImage.height);

    treeX = canvas.width/2+roadWidth;
    ctx.drawImage(treeImage, treeX, treeY, treeImage.width, treeImage.height);
  }
}

function instruction() {
  ctx.fillStyle = 'black';
  ctx.lineWidth = 1;
  ctx.font = '25px verdana';
  ctx.fillText("Use keys 'wasd' to maneuver", 0, 30);
}

function draw() {
  ctx.fillStyle = 'silver';
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fill();
  drawRoad();
  drawTrees();
  drawCar();
  instruction();

}

function updateCar() {
  carVelocityX *= carDeaccelerationX;
  carVelocityY *= carDeaccelerationY;
  if (isUpPressed == true)
  {
    carVelocityY += carAccelerationY;
  } else if (isDownPressed == true)
  {
    carVelocityY -= carAccelerationY;
  }
  if (isLeftPressed == true)
  {
    carVelocityX += carAccelerationX;

  } else if (isRightPressed == true)
  {
    carVelocityX -= carAccelerationX;
  }
  carX -= carVelocityX;
  carY += carVelocityY;

  if (carX < -roadWidth)
  {
    carX = -roadWidth;
  } else if (carX > roadWidth)
  {
    carX = roadWidth;
  }
}

function frame() {
  canvas.width = self.innerWidth - 15;
  updateCar();
  draw();
}

document.addEventListener('keydown', (event) => {
  if (event.key === "w") {
    isUpPressed = true;
  } else if (event.key === "a") {
    isLeftPressed = true;
  } else if (event.key === "s") {
    isDownPressed = true;
  } else if (event.key === "d") {
    isRightPressed = true;
  }
}, false);

// detect how long the key is being pressed down
document.addEventListener('keyup', (event) => {
  if (event.key === "w") {
    isUpPressed = false;
  } else if (event.key === "a") {
    isLeftPressed = false;
  } else if (event.key === "s") {
    isDownPressed = false;
  } else if (event.key === "d") {
    isRightPressed = false;
  }
}, false);


setInterval(function(){
  frame()
}, 50);
