function Player(x_pos, y_pos, curr_game) {

	var parent = 					this;
	this.game = 					curr_game;
	this.action = 					{};
	this.draw = 					{};
	this.draw.image = 				new Image();
	this.draw.image.src = 			"images/bucky/bucky_small.gif";
	this.jump = 					{};
	this.jump.toggle = 				false;
	this.jump.release = 			true;
	this.position = 				{};
	this.position.x = 	 			x_pos;  // x pos
	this.position.y = 	  			y_pos;	// y pos
	this.vel = 						{};
	this.vel.x =					0;		// x speed
	this.vel.y =					0;		// y speed
	this.vel.dir = 					{};
	this.vel.dir.x = 				1;		// x dir
	this.vel.dir.last = 			RIGHT;
	this.vel.dir.y = 				1;		// y dir
	this.vel.accel = 				{};
	this.vel.accel.x = 				0.1;
	this.vel.accel.y = 				GRAVITY;
	this.state = 		  			WALKING; 
	this.image = 		  			new Image();
	this.image.src = 				"images/bucky/bucky_small.gif";
	this.width  =   				32;
	this.height =   				41;
	this.visible =  				true;
	this.collision = 				{};
	this.collision.width_offset = 	10;
	this.collision.height_offset = 	10;

	this.test_tween = 				new MotionTween(300, 300, 600, 400, 240, this.game);

	this.alcohol = 					{};
	this.alcohol.drunk = 			false;
	this.alcohol.effect_start = 	5;
	this.alcohol.effect_end = 		5;
	this.anim = 					{};
	this.animations = new Array(
		new Array(
			new Animation(new Array("images/bucky/bucky_right.gif"), 1, false, this.game),
			STILL,
			RIGHT
		),
		new Array(
			new Animation( new Array("images/bucky/bucky_left.gif"), 1, false, this.game ),
			STILL,
			LEFT
		),
		new Array(
			new Animation( new Array("images/bucky/bucky_right_jump.gif"), 1, false, this.game ),
			JUMPING,
			RIGHT
		),
		new Array(
			new Animation( new Array("images/bucky/bucky_left_jump.gif"), 1, false, this.game ),
			JUMPING,
			LEFT
		),
		new Array(
			new Animation( new Array("images/bucky/bucky_left.gif", "images/bucky/bucky_normal.gif"), 30, false, this.game ),
			ATTACKING,
			RIGHT
		),
		new Array(
			new Animation( new Array("images/bucky/bucky_left.gif", "images/bucky/bucky_normal.gif"), 30, false, this.game ),
			ATTACKING,
			LEFT
		),
		new Array(
			new Animation( new Array("images/bucky/bucky_right.gif", "images/bucky/bucky_right_second.gif"), 15, true, this.game ),
			WALKING,
			RIGHT
		),
		new Array(
			new Animation( new Array("images/bucky/bucky_left.gif", "images/bucky/bucky_left_second.gif"), 15, true, this.game ),
			WALKING,
			LEFT
		),
		new Array(
			new Animation( new Array("images/bucky/bucky_dead1.gif", "images/bucky/bucky_dead2.gif"), 9, true, this.game ),
			DEAD,
			null
		)
	);
	
	this.draw = function() {
		for(i = 0; i<this.animations.length; i++){
			if(this.state == this.animations[i][1] && (this.vel.dir.last == this.animations[i][2] || this.animations[i][2] == null)){
				this.draw.image = this.animations[i][0].current();
			}
		}
		ctx.drawImage(this.draw.image, this.position.x, this.position.y+Math.sin(BuckyGame.drunkTime+(this.position.x-BuckyGame.drawOffset)/blocksize/blocksize*BuckyGame.drunkPeriod)*BuckyGame.drunkStrength, this.width, this.height);
   	}


   	//+Math.sin(BuckyGame.drunkTime+(this.position.x-BuckyGame.drawOffset)/Math.pow(blocksize, 2)*BuckyGame.drunkPeriod)*BuckyGame.drunkStrength

	this.update = function() {

		/********************************************************************
		 Based on controller input, determine how to change acceleration
		 ********************************************************************/
		if(this.state != DEAD){
			if(Controller.shift){
				if(Controller.right){
					if(this.vel.x<0){
						this.vel.accel.x = 0.8;
					} else {
						this.vel.accel.x = 0.1;
					}
				} else if(Controller.left){
					if(this.vel.x>0){
						this.vel.accel.x = -0.8;
					} else {
						this.vel.accel.x = -0.1;
					}
				}
			} else {
				if(Controller.right){
					if(this.vel.x<0){
						this.vel.accel.x = 0.8;
					} else {
						this.vel.accel.x = 0.07;
					}
				} else if(Controller.left){
					if(this.vel.x>0){
						this.vel.accel.x = -0.8;
					} else {
						this.vel.accel.x = -0.07;
					}
				}
			}


			if(Controller.left || Controller.right){
				this.vel.x += this.vel.accel.x
			} else {
				this.vel.x *= 0.70;
			}

			if(!Controller.shift && ((this.vel.x > 2.5 && Controller.right) || (this.vel.x < -2.5 && Controller.left))){
				this.vel.x = (this.vel.x>0) ? 2.5 : -2.5;
				if(this.vel.x>0){
					this.vel.x = 2.5;
				} else if(this.vel.x<0){
					this.vel.x = -2.5
				}
			} else if (Controller.shift && ((this.vel.x > 3.2 && Controller.right) || (this.vel.x < -3.2 && Controller.left))){
				if(this.vel.x>0){
					this.vel.x = 3.2;
				} else if(this.vel.x<0){
					this.vel.x = -3.2
				}
			}

		    /********************************************************************
			 Set x velocity to zero if it is decently close to it
			 ********************************************************************/

			if(Math.abs(this.vel.x) < 0.001){
				this.vel.x = 0;
			}

			/********************************************************************
			 Handle JUMPING input and its associated flags
			 ********************************************************************/

			if(Controller.space && this.jump.toggle){
				this.vel.y = -8.0;
				this.jump.toggle = !this.jump.toggle;
			}

			if(!this.jump.toggle && !Controller.space && this.vel.y < 0 && !this.jump.release){
				this.jump.release = true;
				this.vel.y *= 0.2;
			}

			if(this.vel.y > 0){
				this.jump.toggle = false;
			}

			/********************************************************************
			 Set LEFT / RIGHT status, used a lot for determining which animation
			 ********************************************************************/

			if(this.vel.x>0){
				this.vel.dir.last = RIGHT;
			} else if(this.vel.x<0){
				this.vel.dir.last = LEFT;
			}

			if(this.jump.toggle){
				if(this.vel.x > 0){
					this.state = WALKING;
				} else if(this.vel.x < 0) {
					this.state = WALKING;
				} else {
					this.state = STILL;
				}
			}

			/********************************************************************
			 If Y velocity is less than 0, we're going up, we are jumping
			 *********************************************************************/
			if(this.vel.y < 0){
				this.state = JUMPING;
			}
			/********************************************************************
			 Update Player's Y Position
			 *********************************************************************/

			this.vel.y += this.vel.accel.y * curr_game.physCorrect;

			this.image.src = "images/bucky/bucky_small.gif";

			x_change = this.vel.x * this.vel.dir.x * curr_game.physCorrect;
			y_change = this.vel.y * this.vel.dir.y * curr_game.physCorrect;


			/********************************************************************
			 Update X Position
			 Determine whether to move Player or Camera, then do it
			 Also apply the change in position to all items that need it
			 *********************************************************************/

			if( (this.position.x >= 350 && this.vel.x > 0) || (this.position.x <= 200 && this.vel.x < 0) ){
				// move platforms
				for(i = 0; i<UpdateManager.length; i++){
					temp = UpdateManager[i];
					if(temp instanceof Block 
						|| temp instanceof ItemBlock 
						|| temp instanceof Item
						|| temp instanceof Enemy){

						temp.update(-x_change);

					}
				}

				curr_game.drawOffset -= x_change;

			} else {
				this.position.x += x_change;
			}


			this.position.y += y_change;

			/********************************************************************
			 Perform Collision Actions with types: Item, ItemBlock, Block
			 *********************************************************************/

			for(i = 0; i<UpdateManager.length; i++){
				temp = UpdateManager[i];
				if(temp instanceof Item 
					|| temp instanceof ItemBlock 
					|| temp instanceof Block
					|| temp instanceof Enemy){

					collisionAction(this,temp);
				}
			}
		}
	}
}