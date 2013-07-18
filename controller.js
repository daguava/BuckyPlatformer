var Controller = (function(){
	
	// constructor
	var Controller = function(initialPriority, argType, argBlockSize){
		this.priority(initialPriority);
		this.elements = [];
		this.priorityNumber;
		this.type = argType;
		this.blocksize = argBlockSize
	};

	Controller.prototype = {

		constructor: Controller,

		get: function(elementNumber) {
			return elements[elementNumber];
		}

	};

	return Controller;
})();