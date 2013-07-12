var Scene = (function(Layer, Materials, Canvas){

	var Scene = function(map, argSize) {

		this.blocksize = 		argSize;

		this.defaultMapElement = 'Clipping';

		this.Parallax = 	[];
		this.Background = 	[];
		this.Main = 		[];
		this.Character = 	[];
		this.Npc = 			[];
		this.Foreground = 	[];
		this.Clipping = 	[];

		this.layersObject = {
			Parallax: 		this.Parallax,
			Background: 	this.Background,
			Main: 			this.Main,
			Character:  	this.Character,
			Npc: 			this.Npc,
			Foreground: 	this.Foreground,
			Clipping: 		this.Clipping
		};

		this.performance = {
			graphics: performance.now(),
			drawCorrect: 1,
			drawFps: 60
		};

		this.layersArray = [ this.Parallax, this.Background, this.Main, this.Character, this.Npc, this.Foreground, this.Clipping ];

		for(var currLayer = 0; currLayer < map.length; currLayer++){

			console.log("Adding new layer '" + map[currLayer].layer + "' with priority " + map[currLayer].priority);
			var newLayer = new Layer(map[currLayer].priority, map[currLayer].layer, this.blocksize);

			for(var eCount = 0; eCount < map[currLayer].elements.length; eCount++){

				var tempE = map[currLayer].elements[eCount];
				var newType, newWidth, newHeight;

				newType = 	(typeof tempE.type   !== 'undefined') ? tempE.type 	  : this.defaultMapElement;
				newWidth = 	(typeof tempE.width  !== 'undefined') ? tempE.width   : this.blocksize;
				newHeight = (typeof tempE.height !== 'undefined') ? tempE.height  : this.blocksize;

				newLayer.add( new Materials.createTile(newType, tempE.x, tempE.y) );

				if( Materials.getTileset(newType).clips ){
					newLayer.add( new Materials.createTile("Clipping", tempE.x, tempE.y) );
				}

			}

			this.addLayer(newLayer, map[currLayer].layer);

		}

		// time to assign images to each block, now that we can check it against its surroundings
		// assign image of tile1 each time, tile2 is always the tile to be 'scored'
		console.log("Begin autotiling...");
		this.eachLayer(function(){
			var _layer = this;
			_layer.eachTile(function(){
				var _tile1 = this;
				_layer.eachTile(function(){
					var _tile2 = this;
					if(_tile1 !== _tile2){
						if(_tile1.type === _tile2.type){
							// same type, check four relational tiles
							if( _tile2.northOf(_tile1) ){
								_tile1.score(8);
							} else if( _tile2.eastOf(_tile1) ){
								_tile1.score(4);
							} else if( _tile2.southOf(_tile1) ){
								_tile1.score(1);
							} else if( _tile2.westOf(_tile1) ){
								_tile1.score(2);
							}
						}
					}
				});
				_tile1.setImage( _tile1.tileset.get( _tile1.score() ) );
			});
		}, {includeNpcs: false, includeCharacter: false});
		console.log("Autotiling complete.");

	};

	Scene.prototype = {

		constructor: Scene,

		addLayer: function(newLayer, destination){
			if(this.layersObject[destination] instanceof Array){
				this.layersObject[destination][this.layersObject[destination].length] = newLayer;
				this.sortLayers();
			}
		},

		getLayer: function(layer, arrayPos) {
			if(typeof arrayPos === 'undefined'){
				return this.layersObject[layer];
			} else {
				return this.layersObject[layer][arrayPos];
			}
			
		},

		eachLayer: function(funcToCall, flags, args){
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
						funcToCall.call(this.layersArray[i], null, args);
					}
				}
			}

			// Now is the time to go back through and process which tile connections and blocking optimizations must be made
		},

		addNpc: function(newNpc){
			this.Npc[this.Npc.length] = newNpc;
		},

		getNpc: function(arrayPos){
			return this.Npc[arrayPos];
		},

		eachNpc: function(funcToCall){
			for (var i = 0, len = this.layersObject['npc'].length; i < len; i++){
				funcToCall.call(npc[i]);
			}
		},

		draw: function(){

			Canvas.fillStyle = "#7ADAE1";
			Canvas.fillRect(0, 0, 1000, 600);

			var drawDelta = performance.now()-this.performance.graphics;
			this.performance.graphics = performance.now(); 
			this.performance.drawFps = this.performance.drawFps * (49/50) + (1000/drawDelta) * (1/50);
			if(this.performance.drawFps > 1000) this.performance.drawFps = 60; // sanity check (check for infinity)

			this.eachLayer(function(){
				this.draw();
			});
			
			Canvas.fillStyle = "#000000";
			Canvas.fillText(this.performance.drawFps, 100, 100);
		},

		player: function(newCharacter){
			if(typeof newCharacter === 'undefined'){
				return this.Character;
			} else {
				this.Character = newCharacter;
			}
		},

		getLayersObject: function(){
			return this.layersObject;
		},

		getLayersArray: function(){
			return this.layersArray;
		},

		sortLayers: function(){
			for(var i = 0, len = this.layersArray.length; i < len; i++){
				this.layersArray[i].sort(function(layer1, layer2){
		   			return layer1.priority() > layer2.priority();
		   		});
			}
		}

	};

	return Scene;

})(Layer, Materials, Canvas);