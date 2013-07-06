var scene = (function(layer){
	var parallax 		= [];
		parallax[0] 	= new layer();
		parallax[1] 	= new layer();

	var background 		= [];
		background[0] 	= new layer();
		background[1] 	= new layer();

	var foreground 		= [];	
		foreground[0] 	= new layer();
		foreground[1] 	= new layer();

	var main 			= new layer();
	var character		= new layer();	// need to deal with character yet
	var blocking		= new layer();

	var layersArray = {
		parallax: 		parallax,
		background: 	background, 
		main: 			main, 
		foreground: 	foreground, 
		blocking: 		blocking
	};

	var scene = function(map) {
		// construct scene from map file
	};

	scene.prototpe = {

		constructor: scene,

		get: function(layerToReturn) {
			return this.layersArray[layerToReturn];
		},

		draw: function(){
			this.each(function(){
				this.draw();
			});
		},

		each: function(funcToCall){
			for (var i = 0, len = this.layersArray.length; i < len; i++){
				if(this.layersArray[i] instanceof Array){
					// if the element is an array of layers instead of a single layer, iterate through
					for(var k = 0, len2 = this.layersArray[i].length; k < len2; k++){
						funcToCall.call(this.layersArray[i][k]);
					}
				} else {
					// otherwise deal with single layer
					funcToCall.call(this.layersArray[i]);
				}
			}
		}

	};

})(layer);