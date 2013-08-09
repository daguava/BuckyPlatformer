function begin_game() {

	GrassTileset = new Tileset(
		"Grass", 
		[
			"images/grass_tileset/grass_single.png", 
			"images/grass_tileset/grass_bottom_single.png", 
			"images/grass_tileset/grass_right_single.png", 
			"images/grass_tileset/grass_bottom_right.png", 
			"images/grass_tileset/grass_left_single.png", 
			"images/grass_tileset/grass_bottom_left.png", 
			"images/grass_tileset/grass_middle_single_horizontal.png", 
			"images/grass_tileset/grass_bottom_middle.png", 
			"images/grass_tileset/grass_top_single.png", 
			"images/grass_tileset/grass_middle_single_vertical.png", 
			"images/grass_tileset/grass_top_right.png", 
			"images/grass_tileset/grass_middle_right.png", 
			"images/grass_tileset/grass_top_left.png", 
			"images/grass_tileset/grass_middle_left.png", 
			"images/grass_tileset/grass_top_middle.png", 
			"images/grass_tileset/ground_tile.png"
		], 
		"full", 
		true, // clips
		true  // draws
	);

	RockTileset = new Tileset(
		"Rock", 
		[
			"images/rock_tileset/platform_only.png", 
			"images/rock_tileset/platform_underneath.png", 
			"images/rock_tileset/platform_only.png", 
			"images/rock_tileset/platform_underneath.png", 
			"images/rock_tileset/platform_only.png", 
			"images/rock_tileset/platform_underneath.png", 
			"images/rock_tileset/platform_only.png", 
			"images/rock_tileset/platform_underneath.png", 
			"images/rock_tileset/platform.png", 
			"images/rock_tileset/platform_underneath.png", 
			"images/rock_tileset/platform.png", 
			"images/rock_tileset/platform_underneath.png", 
			"images/rock_tileset/platform.png", 
			"images/rock_tileset/platform_underneath.png", 
			"images/rock_tileset/platform.png", 
			"images/rock_tileset/platform_underneath.png"
		], 
		"full", 
		true, // clips
		true  // draws
	);

	SpikeTileset = new Tileset(
		"Spike", 
		[
			"images/spike_tileset/spike_pit.png", 
			"images/spike_tileset/spike_lower.png", 
			"images/spike_tileset/spike_pit.png", 
			"images/spike_tileset/spike_lower.png", 
			"images/spike_tileset/spike_pit.png", 
			"images/spike_tileset/spike_lower.png", 
			"images/spike_tileset/spike_pit.png", 
			"images/spike_tileset/spike_lower.png", 
			"images/spike_tileset/spike_pit.png", 
			"images/spike_tileset/spike_lower.png", 
			"images/spike_tileset/spike_pit.png", 
			"images/spike_tileset/spike_lower.png", 
			"images/spike_tileset/spike_pit.png", 
			"images/spike_tileset/spike_lower.png", 
			"images/spike_tileset/spike_pit.png", 
			"images/spike_tileset/spike_lower.png"
		],
		"full", 
		true, // clips
		true  // draws
	);

	ClipTileset = new Tileset( 
		"Clipping", 
		[], 
		"none", 
		false, // clips
		true   // draws
	);

	Materials.defineTileset(GrassTileset);
	Materials.defineTileset(RockTileset);
	Materials.defineTileset(SpikeTileset);
	Materials.defineTileset(ClipTileset);


	var blocksize = 25;

	Materials.defineTile(Materials.getTileset("Grass"), blocksize, blocksize, 0, 0);
	Materials.defineTile(Materials.getTileset("Rock"), blocksize, blocksize, 0, 0);
	Materials.defineTile(Materials.getTileset("Spike"), blocksize, blocksize, 0, 0);
	Materials.defineTile( Materials.getTileset("Clipping"), blocksize, blocksize, 0, 0 );

	BuckyGame = new Scene(map, blocksize);

	Character = new Player(10, 10, 25, 50, blocksize);
	BuckyGame.getLayer("Character", 0).player(Character); // define our new character

	Editor.initialize(BuckyGame);
	Editor.editing(true);

	caller();	// start the physics and drawing loops to start game
}

function caller(){
	physInterval = setInterval(physics, physExecuteMs);
	draw_world();
}

function physics(){

	

}

function stats() {

	/******************************************
	 GENERATE SOME STATISTICS FOR SHOWING ONSCREEN
	 ******************************************/
	 // currently unused, replaced by canvas infobox.
}


function draw_world() { 

	/******************************************
	 GRAPHICS TIMER, USED FOR STATS DISPLAY
	 ******************************************/

	BuckyGame.draw();

	animId = window.requestAnimationFrame(draw_world);

}