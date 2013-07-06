function position(x_pos, y_pos){
	this.x = x_pos;
	this.y = y_pos;
}

function tile(x_pos, y_pos, arg_width, arg_height){
	this.position = new position(x_pos, y_pos);
	this.image = new Image();
	this.visible = true;
	this.width = arg_width;
	this.height = arg_height;
}

var elements = {


	grass: (function(tile){



	// constructor
	var grass = function(x_pos, y_pos, arg_width, arg_height){
		tile.prototype.constructor.call(this, x_pos, y_pos, arg_width, arg_height);
	};

	grass.prototype = new tile();

	grass.prototype.constructor = grass;

	
	grass.prototype.talk = function(){
		alert("Talking grass, dawg.");
	};

	return grass;


	})(tile)

};