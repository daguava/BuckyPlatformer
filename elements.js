function Position(x_pos, y_pos){
	this.x = x_pos;
	this.y = y_pos;
}

function HitBox(xArg, yArg){
	// negative value = inward extension, positive = outward extension
	this.xOffset = xArg;
	this.yOffset = yArg;
}

function MapElement(x_pos, y_pos, arg_width, arg_height, xOffset, yOffset){
	this.type = "";
	this.position = new Position(x_pos, y_pos);
	this.image = null;
	this.visible = true;
	this.width = arg_width || 25;
	this.height = arg_height || 25;
	this.hitbox;

	if(typeof xOffset !== 'undefined' && typeof xOffset !== 'undefined'){
		this.hitbox = new Hitbox(xOffset, yOffset);
	}

	this.draw = function(){
		if(this.image instanceof Image && this.image.src != ""){
			Canvas.drawImage( this.image, this.x(), this.y(), this.w(), this.h() );
		} else {
			Canvas.strokeStyle = "#FF0000";
			Canvas.strokeRect(this.x(), this.y(), this.w(), this.h());
		}
	};
	

	this.x = function(newX){
		if(typeof newX === 'undefined'){
			return this.position.x;
		} else {
			this.position.x = newX;
		}
	};

	this.y = function(newY){
		if(typeof newY === 'undefined'){
			return this.position.y;
		} else {
			this.position.y = newY;
		}
	};

	this.w = function(newWidth){
		if(typeof newWidth === 'undefined'){
			return this.width;
		} else {
			this.width = newWidth;
		}
	};

	this.h = function(newHeight){
		if(typeof newHeight === 'undefined'){
			return this.height;
		} else {
			this.height = newHeight;
		}
	};
}

var Materials = {


	Grass: (function(MapElement){

		// constructor
		var Grass = function(x_pos, y_pos, arg_width, arg_height){
			MapElement.call(this, x_pos, y_pos, arg_width, arg_height);
			this.type = "Grass";
			this.image = new Image();
			this.image.src = "./images/grass_tileset/grass_top_middle.png";
		};

		Grass.prototype = new MapElement(); // inherit from MapElement
		Grass.prototype = {
			constructor: Grass,
			talk: function(){
				alert("Talking grass, dawg.");
			}
		};

		return Grass;


	})(MapElement),


	Rock: (function(MapElement){

		// constructor
		var Rock = function(x_pos, y_pos, arg_width, arg_height){
			MapElement.call(this, x_pos, y_pos, arg_width, arg_height);
			this.type = "Rock";
			this.image = new Image();
			this.image.src = "./images/rock_tileset/platform.png";
		};

		Rock.prototype = new MapElement(); // inherit from MapElement
		Rock.prototype = {
			constructor: Rock,
			talk: function(){
				alert("Talking Rock, dawg.");
			}
		};

		return Rock;


	})(MapElement),



	Clipping: (function(MapElement){

		// constructor
		var Clipping = function(x_pos, y_pos, arg_width, arg_height){
			MapElement.call(this, x_pos, y_pos, arg_width, arg_height);
			this.type = "Clipping";
			this.image = new Image();
		};

		Clipping.prototype = new MapElement(); // inherit from MapElement
		Clipping.prototype = {
			constructor: Clipping,
			talk: function(){
				alert("Talking Clipping, dawg.");
			}
		};

		return Clipping;


	})(MapElement)

};