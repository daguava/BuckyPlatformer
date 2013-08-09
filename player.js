var Player = (function(Canvas, Position){

	// constructor
	var Player = function(argX, argY, argW, argH, argBlocksize){
		this.blocksize = argBlocksize;
		this.type = "Player";
		this.layerDraws = true;
		this.position = new Position(argX, argY);
		this.image = new Image();
		this.image.src = "./images/bucky/bucky_right.gif";
		this.width = argW;
		this.height = argH;
	};

	Player.prototype = {

		constructor: Player,

		get: function(firstArg, secondArg) {
			if(typeof secondArg === 'undefined'){
				return this.elements[firstArg];
			} else {
				for(var i = 0, len = this.elements.length; i < len; i++){
					if(this.elements[i].xTile() === firstArg && this.elements[i].yTile() === secondArg){
						return this.elements[i];
					}
				}
				return false;
			}
		},

		add: function(newObject){
			this.elements.push(newObject);
		},

		draw: function(drawView){
			if(this.draws){
				if(this.image instanceof Image && this.image.src != ""){
					Canvas.drawImage( this.image, this.x() * drawView.zoom() + drawView.Offset.x, this.y() * drawView.zoom() + drawView.Offset.y, this.w()  * drawView.zoom(), this.h()  * drawView.zoom());
					if(this.debugging){
						Canvas.fillStyle = "#FFFFFF";
						Canvas.font = '18px Calibri';
						Canvas.fillText(this.tileScore, this.x() + 3, this.y() + 20);
					}
				} else {
					Canvas.strokeStyle = "#FF0000";
					Canvas.fillStyle = "rgba(255, 0, 0, 0.25)";
					Canvas.strokeRect( this.x() * drawView.zoom() + drawView.Offset.x, this.y() * drawView.zoom() + drawView.Offset.y, this.w() * drawView.zoom(), this.h() * drawView.zoom());
					Canvas.fillRect(  this.x() * drawView.zoom() + drawView.Offset.x, this.y() * drawView.zoom() + drawView.Offset.y, this.w() * drawView.zoom(), this.h() * drawView.zoom());
				}
			}

		},

		draws: function(argDraws){
			if(typeof argDraws === 'undefined'){
				return this.layerDraws;
			} else {
				this.layerDraws = argDraws;
			}
		},

		toggleDraw: function(){
			this.layerDraws = !this.layerDraws;
		},

		getType: function(){
			return this.type;
		},

		x: function(newX){
			if(typeof newX === 'undefined'){
				return this.position.x * this.blocksize;
			} else {
				this.position.x += newX;
			}
		},

		y: function(newY){
			if(typeof newY === 'undefined'){
				return this.position.y * this.blocksize;
			} else {
				this.position.y += newY;
			}
		},

		xTile: function(newX){
			if(typeof newX === 'undefined'){
				return this.position.x;
			} else {
				this.position.y = newX;
			}
		},

		yTile: function(newY){
			if(typeof newY === 'undefined'){
				return this.position.y;
			} else {
				this.position.y = newY;
			}
		},

		w: function(newWidth){
			if(typeof newWidth === 'undefined'){
				return this.width;
			} else {
				this.width = newWidth;
			}
		},

		h: function(newHeight){
			if(typeof newHeight === 'undefined'){
				return this.height;
			} else {
				this.height = newHeight;
			}
		}

	};

	return Player;

})(Canvas, Position);