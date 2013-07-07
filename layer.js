var Layer = (function(){
	
	// private variables
	var elements = [];
	var priorityNumber;

	// constructor
	var Layer = function(initialPriority){
		this.priority(initialPriority);
	};

	Layer.prototype = {

		constructor: Layer,

		get: function(elementNumber) {
			return this.elements[elementNumber];
		},

		add: function(newObject){
			this.elements[this.elements.length] = newObject;
		},

		draw: function(){
			this.each(function(){
				this.draw();
			});
		},

		remove: function(objectToRemove) {
			// if an object is passed in, use it to find the matching object, and terminate it
			if(objectToRemove !== null && typeof objectToRemove === 'object'){
				for(var i = 0; i < this.elements.length; i++){
					if(this.elements[i] === objectToRemove){
						this.elements.splice(i, 1);
						return true;
					}
				}
			// otherwise, if an integer was passed in, find its index and splice it out
			} else {
				if(objectToRemove <= this.elements.length){
					for(var i = 0; i < this.elements.length; i++){
						this.elements.splice(i, 1);
						return true;
					}
				}
			}
			// unable to remove object, return false
			return false;
			
		},

		each: function(funcToCall){
			for (var i = 0, len = this.elements.length; i < len; i++){
				funcToCall.call(this.elements[i]);
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
		},

		sort: function(){
			this.sort(function(layer1, layer2){
	   			return layer1.priority() > layer2.priority();
	   		});
		}

	};

	return Layer;

})();