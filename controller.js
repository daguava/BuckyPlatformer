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
				y: 0,
				deltaX: 0,
				deltaY: 0
			},
			scroll: {
				amount: 0,
				editorSum: 0
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
			switch(e.which){
				case 1: mouseStates.click.left =   true; break;
				case 2: mouseStates.click.middle = true; break;
				case 3: mouseStates.click.right =  true; break;
			}
			mouseStates.click.x = event.offsetX?(event.offsetX):event.pageX-CanvasTag.offsetLeft;
			mouseStates.click.y = event.offsetY?(event.offsetY):event.pageY-CanvasTag.offsetTop;
		},
		mouseUp: function(e){
			switch(e.which){
				case 1: mouseStates.click.left =   false; break;
				case 2: mouseStates.click.middle = false; break;
				case 3: mouseStates.click.right =  false; break;
			}
		},
		mouseMove: function(e){
			var newX = e.offsetX?(e.offsetX):e.pageX-CanvasTag.offsetLeft;
			var newY = e.offsetY?(e.offsetY):e.pageY-CanvasTag.offsetTop;
			mouseStates.move.deltaX = newX - mouseStates.move.x;
			mouseStates.move.deltaY = newY - mouseStates.move.y;
			mouseStates.move.x = newX;
			mouseStates.move.y = newY;
		},
		mouseScroll: function(e){
			var delta=e.detail? e.detail : e.wheelDelta/120;
			mouseStates.scroll.amount = delta;
			mouseStates.scroll.editorSum += delta;
		},
		key: function(){
			return keyStates;
		},
		mouse: function(){
			return mouseStates;
		}

	}
})();

var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel";

CanvasTag.addEventListener('keydown', 		Controller.keyEventDown,	true);
CanvasTag.addEventListener('keyup', 		Controller.keyEventUp,		true);
CanvasTag.addEventListener('mouseup', 		Controller.mouseUp, 		false);
CanvasTag.addEventListener('mousedown', 	Controller.mouseDown, 		false);
CanvasTag.addEventListener('mousemove', 	Controller.mouseMove,	 	false);
CanvasTag.addEventListener(mousewheelevt, 	Controller.mouseScroll, 	false);




