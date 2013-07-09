var Tileset = (function(Preloader){

	// constructor
	// argImgArray is an array with a bunch of img src strings
	//   we do this so we can query a preloader for the image object, or
	//   make it if it isn't found
	var Tileset = function(argType, argImgArray, argPattern){
		this.type = argType;
		this.images = [];
		this.pattern = argPattern;

		for(var i = 0, len = argImgArray.length; i++){
			newPos = Math.pow(i, 2);

			if(Preloader.hasImage(argImgArray[i])){
				this.images[newPos] = Preloader.getImage(argImgArray[i]);
			} else {
				this.images[newPos] = new Image();
				this.images[newPos].src = argImgArray[i]
			}
		}
	};

	Tileset.prototype = {

		constructor: Tileset,

		get: function(elementNumber) {
			return elements[elementNumber];
		}

	};

	return Tileset;

})(Preloader);