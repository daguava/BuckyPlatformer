var Scene = (function(Layer, Materials, Canvas){

	var Scene = function(map, argSize) {

		this.blocksize = 		argSize;

		this.defaultMapElement = 'Clipping';

		this.parallax = 	[];
		this.background = 	[];
		this.main = 		[];
		this.character = 	[];
		this.npc = 			[];
		this.foreground = 	[];
		this.clipping = 	[];

		this.layersObject = {
			parallax: 		this.parallax,
			background: 	this.background,
			main: 			this.main,
			character:  	this.character,
			npc: 			this.npc,
			foreground: 	this.foreground,
			clipping: 		this.clipping
		};

		this.layersArray = [ this.parallax, this.background, this.main, this.character, this.npc, this.foreground, this.clipping ];

		this.graphicsPerformance = performance.now();
		this.drawCorrect = 0;
		this.drawFps = 0;

		for(var currentLayer = 0; currentLayer < map.length; currentLayer++){

			console.log("Adding new layer '" + map[currentLayer].layer + "' with priority " + map[currentLayer].priority);
			var newLayer = new Layer(map[currentLayer].priority, map[currentLayer].layer, this.blocksize);

			for(var currentElement = 0; currentElement < map[currentLayer].elements.length; currentElement++){

				var tempElement = map[currentLayer].elements[currentElement];
				var newType, newX, newY, newWidth, newHeight;

				newType = 	(typeof tempElement.type   !== 'undefined') ? tempElement.type 		: this.defaultMapElement;
				newWidth = 	(typeof tempElement.width  !== 'undefined') ? tempElement.width 	: this.blocksize;
				newHeight = (typeof tempElement.height !== 'undefined') ? tempElement.height 	: this.blocksize;
				
				// incomplete, need types of blocks, items, etc yet
				// placeholder line adds the type text as the object, for now.
				newLayer.add( new Materials[ newType ](tempElement.x*this.blocksize, tempElement.y*this.blocksize, newWidth, newHeight) );

			}

			this.addLayer(newLayer, map[currentLayer].layer);

		}

	};

	Scene.prototype = {

		constructor: Scene,

		addLayer: function(newLayer, destination){
			if(this.layersObject[destination] instanceof Array){
				this.layersObject[destination][this.layersObject[destination].length] = newLayer;
			}
		},

		getLayer: function(layer, arrayPos) {
			if(typeof arrayPos === 'undefined'){
				return this.layersObject[layer];
			} else {
				return this.layersObject[layer][arrayPos];
			}
			
		},

		eachLayer: function(funcToCall, flags){
			var defaults = {
				includeNpcs: true,
				includeCharacter: true
			};

			var options = {};

			if(typeof flags !== 'undefined'){
				options.includeNpcs = flags.includeNpcs;
				options.includeCharacter = flags.includeCharacter;
			} else {
				options = defaults;
			}

			for (var i = 0, len = this.layersArray.length; i < len; i++){
				// execute if we're on char layer and including chars, 
				// OR we're on npc layer and including npcs
				// OR we're not on the npc layer and not on the char later at all (what a mouthful)
				if(    ( options.includeCharacters && this.layersArray[i] === this.layersObject['character'] )
					|| ( options.includeNpcs 		 && this.layersArray[i] === this.layersObject['npc'] )
					|| ( this.layersArray[i] !== this.layersObject['character'] && this.layersArray[i] !== this.layersObject['npc'] ) ){

					if(this.layersArray[i] instanceof Array){
						// if the element is an array of layers instead of a single layer, iterate through
						for(var k = 0, len2 = this.layersArray[i].length; k < len2; k++){
							funcToCall.call(this.layersArray[i][k]);
						}
					} else if( this.layersArray[i] !== null ){
						// otherwise deal with single layer
						funcToCall.call(this.layersArray[i]);
					}
				}
			}

			// Now is the time to go back through and process which tile connections and blocking optimizations must be made
		},

		addNpc: function(newNpc){
			this.npc[this.npc.length] = newNpc;
		},

		getNpc: function(arrayPos){
			return this.npc[arrayPos];
		},

		eachNpc: function(funcToCall){
			for (var i = 0, len = this.layersObject['npc'].length; i < len; i++){
				funcToCall.call(npc[i]);
			}
		},

		draw: function(){

			Canvas.fillStyle = "#7ADAE1";
			Canvas.fillRect(0, 0, 1000, 600);

			this.drawDelta = performance.now()-this.graphicsPerformance;
			this.graphicsPerformance = performance.now(); 
			this.drawFps = this.drawFps * (49/50) + 1000/this.drawDelta * 1/50;
			if(this.drawFps > 1000) this.drawFps = 60; // sanity check (check for infinity)
			this.drawCorrect = this.drawCorrect * (4/5) + this.drawDelta/this.drawExecuteMs * (1/5);
			if(this.drawCorrect > 2) this.drawCorrect = 2;

			this.eachLayer(function(){
				this.draw();
			});

			Canvas.fillText(this.drawFps, 100, 100);
		},

		player: function(newCharacter){
			if(typeof newCharacter === 'undefined'){
				return this.character;
			} else {
				this.character = newCharacter;
			}
		},

		getLayersObject: function(){
			return this.layersObject;
		},

		getLayersArray: function(){
			return this.layersArray;
		}

	};

	return Scene;

})(Layer, Materials, Canvas);