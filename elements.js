function Position(xPos, yPos){
	this.x = xPos;
	this.y = yPos;
}

function Hitbox(xArg, yArg){
	// negative value = inward extension, positive = outward extension
	this.xOffset = xArg;
	this.yOffset = yArg;
}

function MapElement(xPos, yPos, argWidth, argHeight, xOffset, yOffset, argBlocksize){
	this.type = "";
	this.position = new Position(xPos, yPos);
	this.image = null;
	this.visible = true;
	this.width = argWidth || 25;
	this.height = argHeight || 25;
	this.hitbox = null;
	this.tempflag = false;
	this.blocksize = argBlocksize || 25;
	this.draws = false;
	this.tileScore = 0;

	if(typeof xOffset !== 'undefined' && typeof xOffset !== 'undefined'){
		this.hitbox = new Hitbox(xOffset, yOffset);
	}

	this.draw = function(){
		if(this.draws){
			if(this.image instanceof Image && this.image.src != ""){
				Canvas.drawImage( this.image, this.x(), this.y(), this.w(), this.h() );
			} else {
				Canvas.strokeStyle = "#FF0000";
				Canvas.strokeRect(this.x(), this.y(), this.w(), this.h());
			}
		}
	};

	this.northOf = function(compTile){
		return this.yTile()-1 === compTile.yTile() && this.xTile() === compTile.xTile();
	};

	this.southOf = function(compTile){
		return this.yTile()+1 === compTile.yTile() && this.xTile() === compTile.xTile();
	};

	this.eastOf = function(compTile){
		return this.yTile() === compTile.yTile() && this.xTile()-1 === compTile.xTile();
	};

	this.westOf = function(compTile){
		return this.yTile() === compTile.yTile() && this.xTile()+1 === compTile.xTile();
	};

	this.score = function(increment){
		if(typeof increment === 'undefined'){
			return this.tileScore;
		} else {
			this.tileScore += increment;
		}
	};

	this.setScore = function(newScore){
		this.tileScore = newScore;
	};

	this.x = function(newX){
		if(typeof newX === 'undefined'){
			return this.position.x * this.blocksize;
		} else {
			this.position.x = newX;
		}
	};

	this.y = function(newY){
		if(typeof newY === 'undefined'){
			return this.position.y * this.blocksize;
		} else {
			this.position.y = newY;
		}
	};

	this.xTile = function(){
		return this.position.x;
	};

	this.yTile = function(){
		return this.position.y;
	}

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
		this.draws = argTileset.draws;
	};

	Tile.prototype = new MapElement(); // inherit from MapElement
	Tile.prototype = {
		constructor: Tile,
		talk: function(){
			alert("Talking tile, dawg.");
		},
		setImage: function(imgObj){
			this.image = imgObj;
		}
	};

	return {

		defineTileset: function(argTileset) {
			// two different methods of storing
			// -- an array, for a fast foreach type scenario
			// -- an object, for a quick retrieval by type
			tilesetsArray[tilesetsArray.length] = argTileset;
			tilesetsObject[argTileset.type] = argTileset;
		},
		getTileset: function(argTilesetType){
			return tilesetsObject[argTilesetType];
		},
		defineTile: function(argTileset, argWidth, argHeight, xOffset, yOffset){
			var newTile = {
				type: argTileset.type,
				width: argWidth,
				height: argHeight,
				xOffset: xOffset,
				yOffset: yOffset,
				tileset: argTileset,
				draws: argTileset.draws
			};
			
			tileArray[tileArray.length] = newTile;
			tileObject[newTile.type] = newTile;
		},
		createTile: function(argType, xPos, yPos){
			var curr = tileObject[argType];
			var newTile = new Tile(argType, xPos, yPos, curr.width, curr.height, curr.xOffset, curr.yOffset, curr.tileset);
			newTile.image = curr.tileset.get(0);
			return newTile;
		},
		getTileArray: function(){
			return tileArray;
		},
		getTileObject: function(){
			return tileObject;
		}
	};
})(MapElement);


// define the only premade tileset we need, the clipping tile (blocking tile)
Materials.defineTileset( new Tileset( "Clipping", [], "none", false, false ) );
Materials.defineTile( Materials.getTileset("Clipping"), 25, 25, 0, 0 );
