function Position(xPos, yPos){
	this.x = xPos;
	this.y = yPos;
}

function HitBox(xArg, yArg){
	// negative value = inward extension, positive = outward extension
	this.xOffset = xArg;
	this.yOffset = yArg;
}

function MapElement(xPos, yPos, argWidth, argHeight, xOffset, yOffset){
	this.type = "";
	this.position = new Position(xPos, yPos);
	this.image = null;
	this.visible = true;
	this.width = argWidth || 25;
	this.height = argHeight || 25;
	this.hitbox = null;

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



var Materials = (function(MapElement){

	var tilesetsArray = [];
	var tilesetsObject = {};
	var tileArray = [];
	var tileObject = {};

	var Tile = function(argType, xPos, yPos, argWidth, argHeight, xOffset, yOffset, argTileset){
		MapElement.call(this, xPos, yPos, argWidth, argHeight, xOffset, yOffset);
		this.type = argType;
		this.tileset = argTileset;
		this.image = new Image();
	};

	Tile.prototype = new MapElement(); // inherit from MapElement
	Tile.prototype = {
		constructor: Tile,
		talk: function(){
			alert("Talking tile, dawg.");
		}
	};

	return {

		createTileset: function(argTileset) {
			// two different methods of storing
			// -- an array, for a fast foreach type scenario
			// -- an object, for a quick retrieval by type
			tilesetsArray[tilesetsArray.length] = argTileset;
			tilesetsObject[argTileset.type] = argTileset;
		},
		getTileset: function(argTilesetType){
			return tilesetsObject[argTilesetType];
		},
		defineTile: function(argType, argTileset, xPos, yPos, argWidth, argHeight, xOffset, yOffset){
			var newTile = {
				type: argType,
				x: xPos,
				y: yPos,
				width: argWidth,
				height: argHeight,
				xOffset: xOffset,
				yOffset: yOffset,
				tileset: argTileset
			};
			
			tileArray[tileArray.length] = newTile;
			tileObject[newTile.type] = newTile;
		},
		createTile: function(argType, xPos, yPos){
			var curr = tileObject[argType];
			var newTile = new Tile(curr[argType].type, xPos, yPos, curr[argType].width, curr[argType].height, curr[argType].xOffset, curr[argType].yOffset, curr[argType].tileset);
			return newTile;
		}
	};
})(MapElement);


///////////////// NOTES TO SELF
/*
Need to make defining a tile and creating a tile separate things, otherwise, when I go
to generate the map tiles, I can't just go new Tile, because i have it require x,y now
*/