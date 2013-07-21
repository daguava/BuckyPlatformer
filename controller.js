var Controller = (function(){
		var codes = {
			space:		32,
			shift:		16,
			right:		[39, 68],
			left:		[37, 65],
			up:			[38, 87],
			down:		[40, 83],
			plus: 		189,
			minus:		187,
			control: 	17
		}

		var keyStates = {
			space:		false,
			shift:		false,
			right:		false,
			left:		false,
			up:			false,
			down:		false,
			plus: 		false,
			minus:		false,
			control: 	false
		}

		var mouseStates = {
			click: {
				left: 	false,
				right: 	false,
				middle: false,
				x: 0,
				y: 0
			},
			move: {
				x: 0,
				y: 0
			}
		}


	return {

		keyEventDown: function(e){
			for(currKey in codes){
				if(codes[currKey] instanceof Array){
					for(var altKey = 0; altKey < codes[currKey].length; altKey++){
						if(e.keyCode === codes[currKey][altKey]){
							keyStates[currKey] = true;
						}
					}
					
				} else {
					if(e.keyCode === codes[currKey]){
						keyStates[currKey] = true;
					}
				}
			}
			
		},
		keyEventUp: function(e){
			for(currKey in codes){
				if(codes[currKey] instanceof Array){
					for(var altKey = 0; altKey < codes[currKey].length; altKey++){
						if(e.keyCode === codes[currKey][altKey]){
							keyStates[currKey] = false;
						}
					}
				} else {
					if(e.keyCode === codes[currKey]){
						keyStates[currKey] = false;
					}
				}
			}
		},
		mouseDown: function(e){
			console.log("Called");
			switch(e.which){
				case 1: mouseStates.click.left =   true; break;
				case 2: mouseStates.click.middle = true; break;
				case 3: mouseStates.click.right =  true; break;
			}
			mouseStates.click.x = event.offsetX?(event.offsetX):event.pageX-document.getElementById("draw_canvas").offsetLeft;
			mouseStates.click.y = event.offsetY?(event.offsetY):event.pageY-document.getElementById("draw_canvas").offsetTop;
		},
		mouseUp: function(e){
			switch(e.which){
				case 1: mouseStates.click.left =   false; break;
				case 2: mouseStates.click.middle = false; break;
				case 3: mouseStates.click.right =  false; break;
			}
		},
		mouseMove: function(e){
			mouseStates.move.x = event.offsetX?(event.offsetX):event.pageX-document.getElementById("draw_canvas").offsetLeft;
			mouseStates.move.y = event.offsetY?(event.offsetY):event.pageY-document.getElementById("draw_canvas").offsetTop;
		},
		key: function(btn){
			return keyStates;
		},
		mouse: function(btn){
			return mouseStates;
		}

	}
})();


CanvasTag.addEventListener('keydown', 	Controller.keyEventDown,	true);
CanvasTag.addEventListener('keyup', 	Controller.keyEventUp,		true);
CanvasTag.addEventListener('mouseup', 	Controller.mouseUp, 		false);
CanvasTag.addEventListener('mousedown', Controller.mouseDown, 		false);
CanvasTag.addEventListener('mousemove', Controller.mouseMove,	 	false);
