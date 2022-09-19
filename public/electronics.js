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
    ctx.fillStyle = hoveredContact == i ? 'green' : 'white';
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


	/*
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 2;
	ctx.beginPath();
		
	ctx.moveTo(contactPoints[i].x, contactPoints[i].y);
	
	if (contactPoints[i].horizontal)
	{
		ctx.lineTo(contactPoints[i].x + contactPoints[i].direction, contactPoints[i].y);
	}
	else 
	{
		ctx.lineTo(contactPoints[i].x, contactPoints[i].y + contactPoints[i].direction);
	}
	*/
	
	ctx.stroke();
  }
}

function contact(x, y, type, horizontal, direction) {
  var obj = {
    x: x,
    y: y,
    type: type,
	horizontal: horizontal,
	direction: direction,
  };
  contactPoints.push(obj);
}

// add contacts into the array
function initializeContact() {
  contact(boardX+50, boardY, "+", false, -20);
  contact(boardX+100, boardY, "-", false, -25);
  contact(boardX+150, boardY, "-", false, -30);
  
  contact(batteryX-15, batteryY+batteryHeight/2, "+", true, -20);
  contact(batteryX+batteryWidth+10, batteryY+batteryHeight/2, "-", true, 20);

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

function drawMakeNewConnection() 
{
	if (startConnection != -1)
	{
		ctx.strokeStyle = 'green';
		ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(contactPoints[startConnection].x, contactPoints[startConnection].y);
        ctx.lineTo(mouse_x, mouse_y);
        ctx.stroke();
	}
}

function drawConnections() 
{
	for (let i=0; i<conns.length; i++)
	{
		var start = conns[i].start;
		var end = conns[i].end;
		
		/*
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 2;
        ctx.beginPath();	
        ctx.moveTo(contactPoints[start].x, contactPoints[start].y);
        ctx.lineTo(contactPoints[end].x, contactPoints[end].y);
        ctx.stroke();	
		*/
		
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 2;
		
		var start_x = 0;
		var start_y = 0;
		if (contactPoints[start].horizontal)
		{
			start_x = contactPoints[start].x + contactPoints[start].direction;
			start_y = contactPoints[start].y;
		
		}
		else 
		{
			start_x = contactPoints[start].x;
			start_y = contactPoints[start].y + contactPoints[start].direction;
		}	
		
		var end_x = 0;
		var end_y = 0;
		if (contactPoints[end].horizontal)
		{
			end_x = contactPoints[end].x + contactPoints[end].direction;
			end_y = contactPoints[end].y;
		}
		else 
		{
			end_x = contactPoints[end].x;
			end_y = contactPoints[end].y + contactPoints[end].direction;
		}	
			
		//Draw starting pin
		ctx.beginPath();
		ctx.moveTo(contactPoints[start].x, contactPoints[start].y);	
		ctx.lineTo(start_x, start_y);
		ctx.stroke();
		
		//Draw ending pin
		ctx.beginPath();
		ctx.moveTo(contactPoints[end].x, contactPoints[end].y);	
		ctx.lineTo(end_x, end_y);
		ctx.stroke();	
		
		//
		if (contactPoints[start].horizontal)
		{
			ctx.beginPath();
			ctx.moveTo(contactPoints[start].x + contactPoints[start].direction, contactPoints[start].y);
			ctx.lineTo(contactPoints[start].x + contactPoints[start].direction, end_y);	
			ctx.stroke();
		}
		else 
		{
			ctx.beginPath();
			ctx.moveTo(contactPoints[start].x, contactPoints[start].y + contactPoints[start].direction);
			ctx.lineTo(end_x, contactPoints[start].y + contactPoints[start].direction);	
			ctx.stroke();		
		}	
		
		//
		if (contactPoints[end].horizontal)
		{
			ctx.beginPath();
			ctx.moveTo(contactPoints[end].x + contactPoints[end].direction, contactPoints[end].y);
			ctx.lineTo(contactPoints[end].x + contactPoints[end].direction, start_y);	
			ctx.stroke();
		}
		else 
		{
			ctx.beginPath();
			ctx.moveTo(contactPoints[end].x, contactPoints[end].y + contactPoints[end].direction);
			ctx.lineTo(start_x, contactPoints[end].y + contactPoints[end].direction);	
			ctx.stroke();		
		}	
	}
}

function draw() 
{
  ctx.fillStyle = 'silver';
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fill();
  drawBoard();
  battery();
  drawConnections();
  drawMakeNewConnection();
  drawContacts();

}

function startConnect() 
{
	if (hoveredContact != -1)
	{
		startConnection = hoveredContact;
		isConnecting = true;
	}
}

function stopConnect() 
{
	//
	if (startConnection != -1 && hoveredContact != -1 && startConnection != hoveredContact)
	{
		addConnection(startConnection, hoveredContact);
	}
	
	startConnection = -1;
	isConnecting = false;
}

function mouseMovement(e) 
{
	var rect = canvas.getBoundingClientRect();
	mouse_x = e.clientX - rect.left;
	mouse_y = e.clientY - rect.top;
}

function updateHoveredContact() 
{
	let newContact = -1;
	
	for (var i=0; i<contactPoints.length; i++)
	{
		if (mouse_x >= contactPoints[i].x - contactRadius/2 && mouse_x <= contactPoints[i].x + contactRadius/2 &&
			mouse_y >= contactPoints[i].y - contactRadius/2 && mouse_y <= contactPoints[i].y + contactRadius/2)
		{
			newContact = i;
			break;
		}
	}
	
	if (newContact != hoveredContact)
	{
		hoveredContact = newContact;
		console.log(hoveredContact);
	}
}

function removeConnection(contact) 
{
	for (var i=conns.length-1; i>=0; i--)
	{
		if (conns[i].start == contact || conns[i].end == contact)
		{
			conns.splice(i, 1);
		}
	}
}

function addConnection(start, end) 
{
	removeConnection(start);
	removeConnection(end);
	
	var obj = {
		start: start,
		end: end,
	};	
	
	conns.push(obj);
}

function frame() 
{
	updateHoveredContact();
	
	// updateSchematics();
	draw();

}

setInterval(function(){
  frame()
}, 100);
