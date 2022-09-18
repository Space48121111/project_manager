const canvas = document.getElementById('canvas');
// rendering context for canvas
const ctx = canvas.getContext('2d');
boardX = canvas.width/2 - boardWidth/2;
boardY = canvas.height/2 - boardHeight/2;


function drawBoard() {
  ctx.fillStyle = 'navy';
  ctx.beginPath();
  ctx.rect(boardX, boardY, boardWidth, boardHeight);
  ctx.fill();

  ctx.fillStyle = 'white';
  ctx.lineWidth = 1;
  ctx.font = '25px verdana';
  ctx.textAlign = 'center';
  ctx.fillText("PCB Board", boardX+boardWidth/2, boardY+boardHeight/2);

}


function drawContacts() {
  for (let i=0; i<contactPoints.length; i++)
  {
    // background fill
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.arc(contactPoints[i].x, contactPoints[i].y, contactRadius, 2*Math.PI, 0);
    ctx.fill();

    // border stroke
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.arc(contactPoints[i].x, contactPoints[i].y, contactRadius, 2*Math.PI, 0);
    ctx.stroke();

    // positive, negative signs fill
    ctx.fillStyle = 'red';
    ctx.lineWidth = 1;
    ctx.font = '18px verdana';
    ctx.textAlign = 'center';
    ctx.fillText(contactPoints[i].type, contactPoints[i].x, contactPoints[i].y+5);

  }
}

function contact(x, y, type) {
  var obj = {
    x: x,
    y: y,
    type: type,
  };
  contactPoints.push(obj);
}

// add contacts into the array
function initializeContact() {
  contact(boardX+50, boardY, "+");
  contact(boardX+100, boardY, "-");
  contact(batteryX-15, batteryY+batteryHeight/2, "+");
  contact(batteryX+batteryWidth+10, batteryY+batteryHeight/2, "-");

}

initializeContact();


function battery() {
  ctx.fillStyle = 'navy';
  ctx.beginPath();
  ctx.rect(batteryX, batteryY, batteryWidth, batteryHeight);
  ctx.fill();

  ctx.fillStyle = 'navy';
  ctx.beginPath();
  ctx.rect(batteryX-5, batteryY+10, 5, batteryHeight-20);
  ctx.fill();

  ctx.fillStyle = 'white';
  ctx.lineWidth = 1;
  ctx.font = '15px verdana';
  ctx.textAlign = 'center';
  ctx.fillText("Battery", batteryX+batteryWidth/2, batteryY+batteryHeight/2);


}




function draw() {
  ctx.fillStyle = 'silver';
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fill();
  drawBoard();
  battery();
  drawContacts();

}


function frame() {
  // updateSchematics();
  draw();

}







setInterval(function(){
  frame()
}, 100);
