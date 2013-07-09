function TileSet(type, imageUrlArray, pattern) {
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