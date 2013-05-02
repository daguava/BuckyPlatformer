function mapGen(){
	// map already included by a separate map.js file
	tmpArray = new Array();
	if(UpdateManager.length != 0){
		tmpArray = UpdateManager.slice(0);
	}
	UpdateManager = new Array();

	for(i = 0; i < tmpArray.length; i++){
		if(tmpArray[i] instanceof InfoBox
			|| tmpArray[i] instanceof Button
			|| tmpArray[i] instanceof PlaceableAnimation){
			UpdateManager.push(tmpArray[i]);
		}
	}

	imageMap = new Array(map.length);

	for(i = 0; i<map.length; i++){
		imageMap[i] = new Array(map[i].length);
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

			 if(map[i][k] == 7){
			 	UpdateManager.push(new WinBlock(k*blocksize+BuckyGame.drawOffset, i*blocksize, blocksize, blocksize) );
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

		if(numfound > 0){
				UpdateManager.push(new Block(start*blocksize+BuckyGame.drawOffset, i*blocksize, numfound*blocksize, blocksize));
				//start = k+1;
				//numfound = 0;
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