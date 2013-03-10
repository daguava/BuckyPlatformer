function Enemy(x_pos, y_pos, curr_game) {

	var parent = 					this;
	this.game = 					curr_game;
	this.action = 					{};
	this.draw = 					{};
	this.draw.image = 				new Image();
	this.draw.image.src = 			"images/enemy/generic_enemy_placeholder.gif";
	this.jump = 					{};
	this.jump.toggle = 				false;
	this.jump.release = 			true;
	this.position = 				{};
	this.position.x = 	 			x_pos;  // x pos
	this.position.y = 	  			y_pos;	// y pos
	this.vel = 						{};
	this.vel.x =					1.2;	// x speed
	this.vel.y =					1;		// y speed
	this.vel.dir = 					{};
	this.vel.dir.x = 				1;		// x dir
	this.vel.dir.last = 			RIGHT;
	this.vel.dir.y = 				1;		// y dir
	this.vel.accel = 				{};
	this.vel.accel.x = 				0.1;
	this.vel.accel.y = 				GRAVITY;
	this.state = 		  			WALKING; 
	this.image = 		  			new Image();
	this.image.src = 				"images/enemy/generic_enemy_placeholder.gif";
	this.width = 					this.image.width;
	this.height = 					this.image.height;
	this.visible =  				true;
	this.collision = 				{};
	this.collision.width_offset = 	10;
	this.collision.height_offset = 	10;
	this.collided = 				false;
	this.collided_last_frame = 		false;
	
	this.draw = function() {
		ctx.drawImage(this.image, Math.floor(this.position.x), Math.floor(this.position.y), this.width, this.height);
   	}

   	this.update = function(x_change){
   		this.position.x += x_change;
   	}

	this.physics = function() {

		if(this.collided && this.collided_last_frame){
			this.vel.dir.x *= -1;
			this.collided = false;;
		}

		this.collided_last_frame = this.collided;
		this.collided = false;



		if(this.vel.dir.x == 1){

				this.vel.accel.x = 0.8;

		} else if(this.vel.dir.x == -1){

				this.vel.accel.x = -0.8;

		}


		this.vel.x += this.vel.accel.x * this.vel.dir.x;
		this.vel.y += this.vel.accel.y;


		if( Math.abs(this.vel.x) > 1.2 ){
			this.vel.x = (this.vel.x > 0) ? 1.2 : -1.2;
		}

	    /********************************************************************
		 Set x velocity to zero if it is decently close to it
		 ********************************************************************/

		if(Math.abs(this.vel.x) < 0.001){
			this.vel.x = 0;
		}

		this.position.x += this.vel.x * this.vel.dir.x * curr_game.physCorrect;
		this.position.y += this.vel.y;

		 for(i = 0; i<UpdateManager.length; i++){
		 	temp = UpdateManager[i];
		 	if(temp instanceof Block){
		 		if(    this.position.x < temp.position.x + temp.width 
		 			&& this.position.x + this.width >= temp.position.x
		 			&& this.position.y < temp.position.y + temp.height
		 			&& this.position.y + this.height >= temp.position.y){
		 			collisionAction(this,temp);
		 		}
		 	}
		}
	}
}