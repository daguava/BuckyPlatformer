var layer = (function(){
	
	// private variables
	var elements = [];
	var priorityNumber;

	// constructor
	var layer = function(initialPriority){
		this.priority(initialPriority);
	};

	layer.prototype = {

		constructor: layer,

		get: function(elementNumber) {
			return this.elements[elementNumber];
		},

		add: function(newObject){
			this.elements[this.elements.length] = newObject;
		},

		draw: function(){
			// to come later
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

	return layer;

})();