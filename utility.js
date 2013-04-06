(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

function Position(x_pos, y_pos){
	this.x = 	 			x_pos;  // x pos
	this.y = 	  			y_pos;	// y pos
}

function Timer(end_time, repeat, curr_game) {
	IN_ACTION = 			10;
	DONE = 					11;

	this.loop = 			repeat;
	this.game = 			curr_game;
	this.time = 			{};
	this.time.current = 	0;
	this.time.end = 		end_time;
	this.status = 			IN_ACTION;

	UpdateManager.push(this);

	this.physics = function() {
		if(this.status == IN_ACTION){
			this.time.current += curr_game.physCorrect * physExecuteMs / 16.667;
		}
		if(this.time.current >= this.time.end){
			if(!this.loop){
				this.status = DONE;
			}
			// if the timer is done, remove it from the UpdateManager
			if(this.loop){
				this.time.current = 0;
			} else {
				for(i = 0; i<UpdateManager.length; i++){
					if(this == UpdateManager[i]){
						UpdateManager.splice(i, 1);
					}
				}
			}
		}
	}
}

function Animation(imageUrlArray, duration, repeat, curr_game){
	IN_ACTION = 10;
	DONE = 		11;

	this.duration = 	duration;
	this.repeat = 		repeat;
	this.game = 		curr_game;
	this.status = 		IN_ACTION;
	this.timer = 		null;
	this.imageArray = 	new Array(imageUrlArray.length-1);
	parent = 			this;

	for(var i = 0; i<imageUrlArray.length; i++){
		this.imageArray[i] = new Image();
		this.imageArray[i].src = imageUrlArray[i];
	}

	this.frame = 		{};

	this.current = function(){
		if(this.timer == null){
			this.timer = new Timer(this.duration, this.repeat, this.game);	// if a timer doesn't exist for animation, create it
		}
		this.status = this.timer.status;
		return this.imageArray[ Math.round( (this.timer.time.current / this.timer.time.end) * (this.imageArray.length-1) ) ];
	}
}

function PlaceableAnimation(x_pos, y_pos, imageUrlArray, duration, repeat, curr_game){
	IN_ACTION = 		10;
	DONE = 				11;

	this.animation = 	new Animation(imageUrlArray, duration, repeat, curr_game);
	this.position = 	new Position(x_pos, y_pos);

	this.physics = function(x_change){
   		this.position.x += x_change;

   		// if the timer's status is DONE, remove this animation from the update manager.
   		// (never happens if the animation loops)
   		if(this.animation.timer.status == DONE){
   			for(i = 0; i<UpdateManager.length; i++){
				if(this == UpdateManager[i]){
					UpdateManager.splice(i, 1);
				}
			}
   		}
   	}

   	this.current = function(){
		return this.animation.current();
	}

	this.draw = function(){
		ctx.drawImage(this.current(), Math.floor(this.position.x), Math.floor(this.position.y)+Math.sin(BuckyGame.drunkTime+(this.position.x-BuckyGame.drawOffset)/Math.pow(blocksize, 2)*BuckyGame.drunkPeriod)*BuckyGame.drunkStrength);
	}
}

function MotionTween(startx, starty, endx, endy, duration, game){
	this.begin_x = 	startx;
	this.begin_y = 	starty;
	this.end_x = 	endx;
	this.end_y = 	endy;
	this.duration = duration;
	this.current = 	{};
	this.game = 	game;
	this.timer = 	new Timer(this.duration, false, this.game);

	this.x = function(){
		return Math.round( (this.timer.time.current / this.timer.time.end) * (this.end_x - this.begin_x) + this.begin_x );
	}

	this.y = function(){
		return Math.round( (this.timer.time.current / this.timer.time.end) * (this.end_y - this.begin_y) + this.begin_y );
	}
}



function collisionAction(movable, stationary){

	var movableCenterX = 0;
	var movableCenterY = 0;
	var stationaryCenterX = 0;
	var stationaryCenterY = 0;
	var distanceX = 0;
	var distanceY = 0;
	var minDistanceX = 0;
	var minDistanceY = 0;
	var depthX = 0;
	var depthY = 0;

	movableCenterX = movable.position.x + movable.width/2;
	movableCenterY = movable.position.y + movable.height/2;
	stationaryCenterX = stationary.position.x + stationary.width/2;
	stationaryCenterY = stationary.position.y + stationary.height/2;

	distanceX = movableCenterX - stationaryCenterX;
	distanceY = movableCenterY - stationaryCenterY;

	minDistanceX = (movable.width-movable.collision.width_offset)/2 + (stationary.width-stationary.collision.width_offset)/2;
	minDistanceY = (movable.height-movable.collision.height_offset)/2 + (stationary.height-stationary.collision.height_offset)/2;

	if(Math.abs(distanceX) >= minDistanceX || Math.abs(distanceY) >= minDistanceY){
		return false;
		depthX = 0;
		depthY = 0;
	} else {
		depthX = distanceX > 0 ? minDistanceX - distanceX : -minDistanceX - distanceX;
		depthY = distanceY > 0 ? minDistanceY - distanceY : -minDistanceY - distanceY;
	}

	if( (movable instanceof Player || movable instanceof Enemy) && stationary instanceof Block ||
		 (movable instanceof Enemy && stationary instanceof ItemBlock )){
				if(Math.abs(depthY) < Math.abs(depthX)){ // resolve y first if true
					movable.position.y += depthY;
					if(depthY<0){
						movable.jump.toggle = true;
						movable.jump.release = false;
						movable.vel.y = 0;
					} else {
						movable.vel.y = 0;
					}
				} else { // resolve x first if the first statement was false
					movable.position.x += depthX;

					if(movable instanceof Enemy && depthX != 0){
						movable.collided = true;
					}

					//this.x_speed = 0;
				}
				return true;
	} else if (movable instanceof Player && stationary instanceof Item){
				if(depthY != 0 || depthX != 0){
					if(BuckyGame.drunkStrength <= BuckyGame.drunkStrengthLimit && stationary.visible){
						BuckyGame.drunkStrength += BuckyGame.drunkStrengthIncrement;
					}
					stationary.visible = false;
					return true;
				} else {
					return false;
				}
	} else if (movable instanceof Player && stationary instanceof ItemBlock){
				if(Math.abs(depthY) < Math.abs(depthX)){ // resolve y first if true
					movable.position.y += depthY;
					if(depthY<0){
						movable.jump.toggle = true;
						movable.jump.release = false;
						movable.vel.y = 0;
					} else {
						movable.vel.y = 0;
						if(stationary.state != HIT){
							for(i = 0; i<itemTypes.length; i++){
								if(itemTypes[i].num == stationary.contains){
									UpdateManager.push( new Item(stationary.position.x, stationary.position.y-blocksize, itemTypes[i].getTile()));
								}
							}
						}
						stationary.state = HIT;
					}
				} else { // resolve x first if the first statement was false
					movable.position.x += depthX;
					//this.x_speed = 0;
				}
				return true;
	} else if (movable instanceof Player && stationary instanceof Enemy){
				if(Math.abs(depthY)<20 && movable.vel.y >= 0){

					movable.position.y -= Math.abs(movable.position.y + movable.height - stationary.position.y) * 1.1;
					if(Controller.space){
						movable.vel.y = -8;
					} else {
						movable.vel.y = -4;
					}
					
					stationary.state = DEAD;
					movable.sounds.splat.currentTime = 0;
					movable.sounds.splat.play();

					

				} else {
					movable.state = DEAD;
					movable.sounds.boom.currentTime = 0;
					movable.sounds.boom.play();
				}
	} else if (movable instanceof Player && stationary instanceof HurtBlock){
				if(depthY != 0 || depthX != 0){
					movable.state = DEAD;
					movable.sounds.boom.currentTime = 0;
					movable.sounds.boom.play();
				}
				return true;
	}
}

// tile collection, used for sets of random-use tiles
function TileCollection(imageUrlArray) {
	this.tileArray = new Array(imageUrlArray.length-1);

	for(i = 0; i<imageUrlArray.length; i++){
		this.tileArray[i] = new Image();
		this.tileArray[i].src = imageUrlArray[i];
	}
	
	this.getRandomTile = function() {
		return(this.tileArray[Math.floor(Math.random()*this.tileArray.length)])
	}
}

// used to implement autotiling, making map creating much easier
function TileSet(imageUrlArray, typeNum, tileType) {
	// starts off with 9 set, ends with 4 set
	// topleft, topmiddle, topright, middleleft, middlemiddle, middleright, bottomleft, bottommiddle, bottomright
	// topsingle, leftsingle, rightsingle, bottomsingle
	this.tileArray = new Array(imageUrlArray.length-1);
	this.type = tileType;
	this.num = typeNum;

	for(i = 0; i<imageUrlArray.length; i++){
		this.tileArray[i] = new Image();
		this.tileArray[i].src = imageUrlArray[i];
	}


	this.aryComp = function(array1, array2){
		for(i = 0; i<array1.length; i++){
			for(k = 0; k<array1[i].length; k++){
				if( ( array1[i][k] != array2[i][k] ) && ( array2[i][k] != 9 ) ) return false;
			}
		}
		return true;
	}


	this.getTile = function(sur){
		// get sent a 3x3 array of the tiles around current spot (this one being the middle)

		if(sur != null){
			for(i = 0; i<sur.length; i++){
				for(k = 0; k<sur[1].length; k++){
					if(sur[i][k] != this.num){
						sur[i][k] = 0;
					}
				}
			}
		}

		if(sur != null && this.num != sur[1][1]) return false;

		if(this.type == "full"){
			if( 	   this.aryComp(sur,  [[9,0,9],[0,this.num,this.num],[9,this.num,9]] ) ){ 			    return this.tileArray[0];
			} else if( this.aryComp(sur,  [[9,0,9],[this.num,this.num,this.num],[9,this.num,9]] ) ){ 	    return this.tileArray[1];
			} else if( this.aryComp(sur,  [[9,0,9],[this.num,this.num,0],[9,this.num,9]] ) ){ 			    return this.tileArray[2];
			} else if( this.aryComp(sur,  [[9,this.num,9],[0,this.num,this.num],[9,this.num,9]] ) ){ 	    return this.tileArray[3];
			} else if( this.aryComp(sur,  [[9,this.num,9],[this.num,this.num,this.num],[9,this.num,9]] ) ){ return this.tileArray[4];
			} else if( this.aryComp(sur,  [[9,this.num,9],[this.num,this.num,0],[9,this.num,9]] ) ){ 	    return this.tileArray[5];
			} else if( this.aryComp(sur,  [[9,this.num,9],[0,this.num,this.num],[9,0,9]] ) ){ 			    return this.tileArray[6];
			} else if( this.aryComp(sur,  [[9,this.num,9],[this.num,this.num,this.num],[9,0,9]] ) ){ 	    return this.tileArray[7];
			} else if( this.aryComp(sur,  [[9,this.num,9],[this.num,this.num,0],[9,0,9]] ) ){ 			    return this.tileArray[8];
			} else if( this.aryComp(sur,  [[9,0,9],[0,this.num,0],[9,this.num,9]] ) ){					    return this.tileArray[9];
			} else if( this.aryComp(sur,  [[9,0,9],[0,this.num,this.num],[9,0,9]] ) ){ 					    return this.tileArray[10];
			} else if( this.aryComp(sur,  [[9,0,9],[this.num,this.num,0],[9,0,9]] ) ){ 					    return this.tileArray[11];
			} else if( this.aryComp(sur,  [[9,this.num,9],[0,this.num,0],[9,0,9]] ) ){ 					    return this.tileArray[12];
			} else if( this.aryComp(sur,  [[9,0,9],[this.num,this.num,this.num],[9,0,9]] ) ){ 			    return this.tileArray[13];
			}  else if( this.aryComp(sur, [[9,this.num,9],[0,this.num,0],[9,this.num,9]] ) ){ 			    return this.tileArray[14];
			} else {	return this.tileArray[15]; }
		} else if(this.type == "dual"){
			if( 	   this.aryComp(sur, [[9,0,9],[9,this.num,9],[9,this.num,9]])){ return this.tileArray[0];							  // top
			} else if( this.aryComp(sur, [[9,0,9],[9,this.num,9],[9,0,9]])){ 		return this.tileArray[0];					  		  // bottom
			} else { return this.tileArray[1]; }
		} else if(this.type == "single"){ return this.tileArray[0]; }
	}
}

function Parallax(imageSrc, percentMovementSpeed, currGame){
	this.image = new Image();
	this.image.src = imageSrc;
	this.width = this.image.width;
	this.height = this.image.height;
	this.multiplier = percentMovementSpeed;
	this.game = currGame;

	this.draw = function(){

		x_draw1 = Math.round(this.game.drawOffset * this.multiplier%this.width-this.width);
		x_draw2 = Math.round(this.game.drawOffset * this.multiplier%this.width);
		x_draw3 = Math.round(this.game.drawOffset * this.multiplier%this.width+this.width);

		if(x_draw1 < this.game.boundary.x && x_draw1+this.width >= 0){
			ctx.drawImage(this.image, x_draw1, 0);
		}
		if(x_draw2 < this.game.boundary.x && x_draw2+this.width >= 0){
			ctx.drawImage(this.image, x_draw2, 0);
		}
		if(x_draw3 < this.game.boundary.x && x_draw3+this.width >= 0){
			ctx.drawImage(this.image, x_draw3, 0);
		}
	}
}

function mapGen(){
	// map already included by a separate map.js file
	UpdateManager = new Array();
	imageMap = new Array(map.length);

	for(i = 0; i<map.length; i++){
		imageMap[i] = new Array(map[0].length);
	}

	// process map file for use in drawing, and logic segments
	for(var i = 0; i<map.length; i++){
		for(var k = 0; k<map[i].length; k++){

			/***********************************************
			 PROCESS MAP FILE FOR EACH TILESET, GENERATING
			 AN IMAGE MAP ARRAY.
			 ***********************************************/
			for(j = 0; j<TilesetArrays.length; j++){
				var checkArray = [  [  			0		     , (i-1>=0)?map[i-1][k]:0	 	  ,  			0		   				 ],
									[ (k-1>=0)?map[i][k-1]:0 ,          map[i][k] 	      	  , (k+1<map[i].length)?(map[i][k+1]):0  ],
									[  			0		     , (i+1<map.length)?map[i+1][k]:0 ,  			0		   				 ]  ];
				
				var result = TilesetArrays[j].getTile(checkArray);

				if(result){
					imageMap[i][k] = result;
				}
			}

			if(imageMap[i][k] == undefined) imageMap[i][k] = null;


			/***********************************************
			 PROCESS MAP FILE FOR ITEMS
			 ***********************************************/
			
			for(j = 0; j<itemTypes.length; j++){
				if(map[i][k] == itemTypes[j].num){
					UpdateManager.push(new Item(k*blocksize+BuckyGame.drawOffset, i*blocksize, itemTypes[j].getTile()));
				}
			}

			/************************************************
			 PROCESS INDIVIDUAL TILE ITEMS THAT AREN'T IN
			 A COLLECTION
			 ************************************************/
			 // Item block
			 if(map[i][k] == ItemBlockTileset.num){
			 	UpdateManager.push(new ItemBlock(k*blocksize+BuckyGame.drawOffset, i*blocksize, 3, ItemBlockTileset.tileArray[0], ItemBlockTileset.tileArray[1]));
			 }

			 // Spike block
			 if(map[i][k] == 4){
			 	UpdateManager.push(new HurtBlock(k*blocksize+BuckyGame.drawOffset, i*blocksize, blocksize, blocksize) );
			 }

			 // Enemy
			 if(map[i][k] == 5){
			 	UpdateManager.push(new Enemy(k*blocksize+BuckyGame.drawOffset, i*blocksize, BuckyGame) );
			 }
		}	
	}

	/***********************************
	 FIRST SCREENING OF COLLISION BLOCKS
	 ***********************************/

	for(var i = 0; i<map.length; i++){ // map y
		var start = 0;
		var numfound = 0;
		for(var k = 0; k<map[i].length; k++){ // map x
			var blockfound = false;
			// scan along the map file horizontally looking for block strips. When found,
			// continue until you don't find one. If it's at least one block, create the
			// new large block.

			for(j = 0; j<collideTypes.length; j++){
				if(map[i][k] == collideTypes[j].num){
					blockfound = true;
					numfound ++;
					//UpdateManager.push(new Block(k*blocksize, i*blocksize, blocksize, blocksize));
				}
			}

			if(!blockfound && numfound > 0){
				UpdateManager.push(new Block(start*blocksize+BuckyGame.drawOffset, i*blocksize, numfound*blocksize, blocksize));
				start = k+1;
				numfound = 0;
			} else if(!blockfound) {
				start = k+1;
				numfound = 0;
			}

		}
	}

	/************************************
	 SECOND SCREENING OF COLLISION BLOCKS
	 COMBINE SIMILAR GROUPS TO REDUCE THE
	 NUMBER OF COLLISION SQUARES/RECTANGLES
	 ************************************/

	 // check each strip of blocks in the UpdateManager to see if they are identical, except
	 // shifted up or down one row. These we can combine into larger rectangles.
	 // This step can be considered relatively slow, but it only happens once upon loading
	 // a map, so it doesn't become a problem.

	 u_length = UpdateManager.length;  // copy the updatemanager length here, as it can change in the loop
	 for(j = 0; j<5; j++){	// Perform 5 passes of the second screening type.
		 for(i = 0; i<u_length; i++){
		 	first = UpdateManager[i];
		 	if(first instanceof Block){
		 		for(k = i; k<u_length; k++){
		 			second = UpdateManager[k];
		 			if(second instanceof Block && i != k){
		 				if(first.position.x == second.position.x 
		 					&& first.position.y + first.height == second.position.y
		 					&& first.width == second.width){
		 					// match was found, combine the rectangles
		 					new_x = first.position.x;
		 					new_y = first.position.y;
		 					new_w = first.width;
		 					new_h = first.height + second.height;
		 					// splice in new rectangle, remove the two old rectangles
		 					UpdateManager.splice(i, 1, new Block(new_x, new_y, new_w, new_h));
		 					UpdateManager.splice(k, 1);
		 				}
		 			}
		 		}
		 	}
		}
	}

}