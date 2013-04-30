function Control() {
	this.controller = 			{};
	this.controller.space = 	false;
	this.controller.shift = 	false;
	this.controller.left = 		false;
	this.controller.right = 	false;
	this.controller.up = 		false;
	this.controller.down = 		false;
	this.controller.plus = 		false;
	this.controller.minus = 	false;
	this.controller.control = 	false;
	this.mouse = 				{};
	this.mouse.click = 			{};
	this.mouse.click.left = 	false;
	this.mouse.click.right = 	false;
	this.mouse.click.middle = 	false;
	this.mouse.click.x = 		null;
	this.mouse.click.y = 		null;
	this.mouse.move = 			{};
	this.mouse.move.x = 		null;
	this.mouse.move.y = 		null;
}

function mouse_move(event) {
	Controller.mouse.move.x = event.offsetX?(event.offsetX):event.pageX-document.getElementById("draw_canvas").offsetLeft;
	Controller.mouse.move.y = event.offsetY?(event.offsetY):event.pageY-document.getElementById("draw_canvas").offsetTop;
	// x and y now hold the position onscreen of the mouse after the mouse was moved
}

function mouse_press(event) {
	Controller.mouse.click.x = event.offsetX?(event.offsetX):event.pageX-document.getElementById("draw_canvas").offsetLeft;
	Controller.mouse.click.y = event.offsetY?(event.offsetY):event.pageY-document.getElementById("draw_canvas").offsetTop;
	// x and y now hold the position onscreen of the mouse click
}

function key_event(event) {
	switch(event.keyCode){
		case 32:				Controller.space = true;	break;		// space
		case 16:				Controller.shift = true;	break;		// shift
		case 39: case 68:		Controller.right = true;	break;		// right
		case 37: case 65:		Controller.left =  true;	break;		// left
		case 38: case 87:		Controller.up =    true; 	break;		// up
		case 40: case 83:		Controller.down =  true;	break;		// down
		case 189:  				Controller.plus =  true;	break;
		case 187: 				Controller.minus = true;	break;
		case 17:  				Controller.control=true; 	break;
	}
}

function key_event_up(event) {
	switch(event.keyCode){
		case 32:				Controller.space = false;	break;		// space
		case 16:				Controller.shift = false;	break;		// shift
		case 39: case 68:		Controller.right = false;	break;		// right
		case 37: case 65:		Controller.left =  false;	break;		// left
		case 38: case 87:		Controller.up =    false; 	break;		// up
		case 40: case 83:		Controller.down =  false;	break;		// down
		case 189:  				Controller.plus =  false;	break;
		case 187: 				Controller.minus = false;	break;
		case 17:  				Controller.control=false;   break;
	}
}

function mouse_up(event) {
	switch(event.which){
		case 1: Controller.mouse.click.left =   false; break;
		case 2: Controller.mouse.click.middle = false; break;
		case 3: Controller.mouse.click.right =  false; break;
	}
}

function mouse_down(event) {
	switch(event.which){
		case 1: Controller.mouse.click.left =   true; break;
		case 2: Controller.mouse.click.middle = true; break;
		case 3: Controller.mouse.click.right =  true; break;
	}
}

function mouse_scroll(event) {
	var evt=window.event || event //equalize event object
	var delta=evt.detail? evt.detail*(-120) : evt.wheelDelta //check for detail first so Opera uses that instead of wheelDelta
	// delta now holds the amount that the wheel was scrolled
}