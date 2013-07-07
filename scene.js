var Scene = (function(Layer){
	var parallax 		= [];
	var background 		= [];
	var foreground 		= [];	
	var npc				= [];

	var main;					// only one main layer
	var characterObject;
	var blocking;				// only one block-mask layer

	var layersArray = {
		parallax: 		this.parallax,
		background: 	this.background, 
		main: 			this.main, 
		character:  	this.character,
		npc: 			this.npc,
		foreground: 	this.foreground, 
		blocking: 		this.blocking
	};

	var Scene = function(map) {

		for(var currentLayer = 0; currentLayer < map.length; currentLayer++){

			var newLayer = new layer(map[currentLayer].priority);

			for(var currentElement = 0; currentElement < map[currentLayer].elements.length; currentElement++){
				// incomplete, need types of blocks, items, etc yet
				// placeholder line adds the type text as the object, for now.
				newLayer.add(map[currentLayer].elements[currentElement].type);

			}

			this.addLayer(newLayer, map[currentLayer].layer);

		}

	};

	Scene.prototype = {

		constructor: Scene,

		addLayer: function(newLayer, destination){
			if(this.layersArray[destination] instanceof Array){
				this.layersArray[destination][this.layersArray[destination].length] = newLayer;
			} else {
				this.layersArray[destination] = newLayer;
			}
		},

		getLayer: function(layer, arrayPos) {
			if(typeof arrayPos === 'undefined'){
				return this.layersArray[layer];
			} else {
				return this.layersArray[layer][arrayPos];
			}
			
		},

		eachLayer: function(funcToCall, flags){
			var defaults = {
				includeNpcs: true,
				includeCharacter: true,
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
				// OR we're not on the npc layer and not on the char later at all (what a mouthfull)
				if(    options.includeCharacters && this.layersArray[i] === this.character 
					|| options.includeNpcs 		 && this.layersArray[i] === this.npc
					|| (this.layersArray !== this.character && this.layersArray[i] !== this.npc) ){

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
		},

		addNpc: function(newNpc){
			this.npc[npc.length] = newNpc;
		},

		getNpc: function(arrayPos){
			return this.npc[arrayPos];
		},

		eachNpc: function(funcToCall){
			for (var i = 0, len = this.npc.length; i < len; i++){
				funcToCall.call(this.npc[i]);
			}
		},

		draw: function(){
			this.eachLayer(function(){
				this.draw();
			});
		},

		character: function(newCharacter){
			if(typeof newCharacter === 'undefined'){
				return this.characterObject;
			} else {
				this.characterObject = newCharacter;
			}
		}

	};

	return Scene;

})(Layer);