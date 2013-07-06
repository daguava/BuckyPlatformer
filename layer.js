var layer = (function(){
	
	// private variables
	var elements = [];

	// constructor
	var layer = function(){

	};

	layer.prototpe = {

		constructor: layer,

		get: function(i) {
			return this.elements[i];
		},

		add: function(newObject){
			this.elements[this.elements.length] = newObject;
		},

		remove: function(objectToRemove) {
			for(var i = 0; i < this.elements.length; i++){
				if(this.elements[i] === objectToRemove){
					this.elements.splice(i, 1);
					return true;
				}
			}
			return false;
		},

		each: function(funcToCall){
			for (var i = 0, len = this.elements.length; i < len; i++){
				funcToCall.call(this.elements[i]);
			}
		},

		length: function(){
			return this.elements.length;
		}

	};

	return layer;

})();