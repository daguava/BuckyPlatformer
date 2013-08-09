var Layer = (function(Canvas){

	// constructor
	var Layer = function(initialPriority, argType, argBlockSize){
		this.priority(initialPriority);
		this.elements = [];
		this.priorityNumber;
		this.type = argType;
		this.blocksize = argBlockSize
		this.layerDraws = true;
		this.char = null;
	};

	Layer.prototype = {

		constructor: Layer,

		get: function(firstArg, secondArg) {
			if(typeof secondArg === 'undefined'){
				return this.elements[firstArg];
			} else {
				for(var i = 0, len = this.elements.length; i < len; i++){
					if(this.elements[i].xTile() === firstArg && this.elements[i].yTile() === secondArg){
						return this.elements[i];
					}
				}
				return false;
			}
		},

		add: function(newObject){
			this.elements.push(newObject);
		},

		draw: function(drawView){
			if(this.layerDraws){
				this.eachTile(function(){
					this.draw(drawView);
				});
			}
			if(this.char !== null){
				this.char.draw(drawView);
			}
		},

		draws: function(argDraws){
			if(typeof argDraws === 'undefined'){
				return this.layerDraws;
			} else {
				this.layerDraws = argDraws;
			}
		},

		player: function(argPlayer){
			if(typeof argPlayer === 'undefined'){
				return this.char;
			} else {
				this.char = argPlayer;
			}
		},

		removePlayer: function(){
			this.char = null;
		},

		toggleDraw: function(){
			this.layerDraws = !this.layerDraws;
		},

		getType: function(){
			return this.type;
		},

		getElements: function(){
			return this.elements;
		},

		remove: function(firstArg, secondArg) {
			// if an object is passed in, use it to find the matching object, and terminate it
			if(firstArg !== null && typeof firstArg === 'object'){
				for(var i = 0, len = this.elements.length; i < len; i++){
					if(this.elements[i] === firstArg){
						this.elements.splice(i, 1);
						return true;
					}
				}
			// otherwise, if an integer was passed in, find its index and splice it out
			} else if( typeof firstArg === 'number' && typeof secondArg === 'undefined'){
				if(firstArg <= this.elements.length){
					for(var i = 0; i < this.elements.length; i++){
						this.elements.splice(i, 1);
						return true;
					}
				}
			// otherwise, check if x,y coordinate tile pair was passed in
			} else if( typeof firstArg === 'number' && typeof secondArg === 'number'){
				for(var i = 0, len = this.elements.length; i < len; i++){
					if(this.elements[i].xTile() === firstArg && this.elements[i].yTile() === secondArg){
						this.elements.splice(i, 1);
						return true;
					}
				}
			}
			// unable to remove object, return false
			return false;
			
		},

		eachTile: function(funcToCall, args){
			for (var i = 0, len = this.elements.length; i < len; i++){
				funcToCall.call(this.elements[i], args);
			}
		},

		length: function(){
			return this.elements.length;
		},

		priority: function(newPriority){
			if(typeof newPriority === 'undefined'){
				return this.priorityNumber;
			} else {
				this.priorityNumber = newPriority;
			}
		}

	};

	return Layer;

})(Canvas);