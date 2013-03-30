function enemyProfile(walk_array, attack_array, jump_array){
	// walk 	{do-i-walk?, speed, avoid-falls}
	// attack 	{do-i-attack?}
	// jump 	{do-i-jump?, speed, time-delay}
	this.walk = 					{};
	this.walk.enabled = 			walk_array[0];
	this.walk.speed = 				walk_array[1];
	this.walk.avoidFalls = 			walk_array[2];
	this.attack = 					{};
	this.attack.enabled = 			attack_array[0];
	this.jump = 					{};
	this.jump.enabled = 			jump_array[0];
	this.jump.speed = 				jump_array[1];
	this.jump.delay = 				jump_array[2];
}

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
	this.position = 				new Position(x_pos, y_pos);
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
	this.profile = 					new enemyProfile([true, 1.2, false], [false], [false, 0, 0]);
	
	this.draw = function() {
		if(debugging){
			ctx.strokeStyle = "#FF3333";
			ctx.fillStyle = 'rgba(255,33,33, 0.25)';
			ctx.lineWidth = 1;
			ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
			ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
		}
		ctx.drawImage(this.image, Math.floor(this.position.x), Math.floor(this.position.y)+Math.sin(BuckyGame.drunkTime+(this.position.x-BuckyGame.drawOffset)/Math.pow(blocksize, 2)*BuckyGame.drunkPeriod)*BuckyGame.drunkStrength, this.width, this.height);
   	}

	this.physics = function(x_change) {

		if(this.state == DEAD){
			for(var i = 0; i < UpdateManager.length; i++){
				if(UpdateManager[i] == this){
					UpdateManager.splice(i, 1);
				}
			}
		}

		this.position.x += BuckyGame.camera.offset;

		if(this.profile.walk.enabled && Math.abs(this.position.x - Buckingham.position.x) < BuckyGame.boundary.x * 1.1){
			if(this.collided && this.collided_last_frame){
				this.vel.dir.x *= -1;
				this.collided = false;
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

			if( Math.abs(this.vel.x) > this.profile.walk.speed ){
				this.vel.x = (this.vel.x > 0) ? this.profile.walk.speed : -this.profile.walk.speed;
			}

		    /********************************************************************
			 Set x velocity to zero if it is decently close to it
			 ********************************************************************/

			if(Math.abs(this.vel.x) < 0.001){
				this.vel.x = 0;
			}

			// sanity check
			if(this.vel.x > 200){
				console.log("Tripped Sanity Check (x velocity): It was " + this.vel.x);
				this.vel.x = 0;
			}
			if(this.vel.y > 200){
				console.log("Tripped Sanity Check (y velocity): It was " + this.vel.y);
				this.vel.y = 0;
			}

			this.position.x += this.vel.x * this.vel.dir.x * curr_game.physCorrect;
			this.position.y += this.vel.y;
		}
		

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

		if(this.position.y > BuckyGame.height){
			this.state = DEAD;
		}
	}
}