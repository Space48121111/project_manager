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
  ctx.fillText("Or drag the car.", 0, 50);

}

function speedometer() {
  ctx.beginPath();
  ctx.strokeStyle = 'black';
  ctx.arc(canvas.width/2, 70, 50, 2*Math.PI, 0);
  ctx.stroke();

  ctx.fillStyle = 'green';
  ctx.lineWidth = 1;
  ctx.font = '25px verdana';
  ctx.textAlign = 'center';
  ctx.fillText(parseInt(carVelocityY), canvas.width/2, 70);

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
  speedometer();

}

function updateCar() {
  carVelocityY = parseInt(carVelocityY);
  if (usesTouch == true)
  {
    if (playerY > canvas.height/2)
    {
      carVelocityY += carAccelerationY;
    } else if (playerY < canvas.height/2)
    {
      carVelocityY -= carAccelerationY;
    }
  }
  else if (isUpPressed == true)
  {
    carVelocityY += carAccelerationY;
  } else if (isDownPressed == true)
  {
    carVelocityY -= carAccelerationY;
  }
  else {
    carVelocityY *= carDeaccelerationY;
  }

  if (isLeftPressed == true)
  {
    carVelocityX += carAccelerationX;

  } else if (isRightPressed == true)
  {
    carVelocityX -= carAccelerationX;
  }
  else {
    carVelocityX *= carDeaccelerationX;
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

function touchHandler(e) {
  if (e.touches) {
    // localize positions
    playerX = e.touches[0].pageX - canvas.offsetLeft;
    playerY = e.touches[0].pageY - canvas.offsetTop;
    // output.textContent = `Touch:  x: ${playerX}, y: ${playerY}`;
    e.preventDefault();
    usesTouch = true;
  }
}

function handleEnd(e) {
  if (!e.touches) {
    usesTouch = false;
  }
}

document.addEventListener("touchstart", touchHandler);
document.addEventListener("touchmove", touchHandler);
document.addEventListener("touchend", handleEnd);

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
