const canvas = document.getElementById('canvas');
// rendering context for canvas
const ctx = canvas.getContext('2d');

const carImage = new Image(150, 150);
carImage.src = "car.png";

const treeImage = new Image(50, 50);
treeImage.src = "tree.png";

let fontBase = 1000;
let fontSize = 25;

let radiusBase = 1000;
let radiusSize = 35;

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
  ctx.font = getFont();
  ctx.fillText("Use keys 'wasd' to maneuver", 0, 30);
  ctx.fillText("Or drag to start/stop", 0, 50);

}

function speedometer() {
  ctx.beginPath();
  ctx.strokeStyle = 'black';
  ctx.arc(canvas.width/2, 70, getRadius(), 2*Math.PI, 0);
  ctx.stroke();

  ctx.fillStyle = 'green';
  ctx.lineWidth = 1;
  ctx.font = getFont();
  ctx.textAlign = 'center';
  ctx.fillText(parseInt(carVelocityY), canvas.width/2, 70);

}

function voltageRegulator() {
  ctx.beginPath();
  ctx.strokeStyle = 'black';
  ctx.arc(canvas.width/2-100, 70, getRadius(), 2*Math.PI, 0);
  ctx.stroke();

  ctx.fillStyle = 'green';
  ctx.lineWidth = 1;
  ctx.font = getFont();
  ctx.textAlign = 'center';
  ctx.fillText('110V', canvas.width/2 - 100, 70);

}

function rangeAnxiety() {
  ctx.beginPath();
  ctx.strokeStyle = 'black';
  ctx.arc(canvas.width/2 + 100, 70, getRadius(), 2*Math.PI, 0);
  ctx.stroke();

  ctx.fillStyle = 'green';
  ctx.lineWidth = 1;
  ctx.font = getFont();
  ctx.textAlign = 'center';
  ctx.fillText('80%', canvas.width/2 + 100, 70);

}

function getFont() {
    var ratio = fontSize / fontBase;
    var size = canvas.width * ratio;
    return (size|0) + 'px verdana';
}

function getRadius() {
    var ratio = radiusSize / radiusBase;
    var size = canvas.width * ratio;
    return (size|0);
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
  rangeAnxiety();
  voltageRegulator();
  speedometer();


}

function updateCar() {
  carVelocityY = parseInt(carVelocityY);

  if (usesTouch == true)
  {
    if (deltaY < 0)
    {
      carVelocityY += carAccelerationY;
    }
    if (deltaY > 0)
    {
      carVelocityY -= carAccelerationY;
    }
  }

  if (isUpPressed == true)
  {
    carVelocityY += carAccelerationY;
  } else if (isDownPressed == true)
  {
    carVelocityY -= carAccelerationY;
  }
  else if (usesTouch == false)
  {
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

// document.querySelector('body').addEventListener('click', f1, {capture: false})

document.addEventListener('touchstart', e => {
  [...e.changedTouches].forEach(touch => {
    e.preventDefault();
    const dot = document.createElement('div')
    dot.classList.add('dot')
    dot.style.top = `${touch.pageY}px`
    dot.style.left = `${touch.pageX}px`
    dot.id = touch.identifier
    document.body.append(dot)
    clientX = touch.clientX
    clientY = touch.clientY
  });
}, { passive: false })

document.addEventListener('touchmove', e => {
  // console.log(e);
  // console.log('Move');
  [...e.changedTouches].forEach(touch => {
    const dot = document.getElementById(touch.identifier)
    dot.style.top = `${touch.pageY}px`
    dot.style.left = `${touch.pageX}px`
    playerY = parseInt(touch.pageY - canvas.offsetTop)
    playerX = parseInt(touch.pageX - canvas.offsetLeft)
    // console.log(`Touch:  x: ${playerX}px, y: ${playerY}px`)
    deltaX = parseInt(touch.clientX - clientX);
    deltaY = parseInt(touch.clientY - clientY);
    // console.log('myDeltaMoves '+deltaX+' '+ deltaY)
    usesTouch = true
  })
}, false)

document.addEventListener('touchend', e => {

  // Compute the change in X and Y coordinates.
  // The first touch point in the changedTouches
  // list is the touch point that was just removed from the surface.

  // Process the data…
  [...e.changedTouches].forEach(touch => {
    const dot = document.getElementById(touch.identifier)
    dot.remove()
    deltaX = parseInt(touch.clientX - clientX);
    deltaY = parseInt(touch.clientY - clientY);
    // console.log('myDeltaEnds '+deltaX+' '+ deltaY)
    usesTouch = false
  })
}, false);

document.addEventListener('touchcancel', e => {
  [...e.changedTouches].forEach(touch => {
    const dot = document.getElementById(touch.identifier)
    dot.remove()
    usesTouch = false

  })
})



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
}, 100);
