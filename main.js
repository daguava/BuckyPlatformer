function begin_game() {

	GrassTileset = new Tileset(
		"Grass", 
		["images/grass_tileset/grass_single.png", "images/grass_tileset/grass_bottom_single.png", "images/grass_tileset/grass_right_single.png", "images/grass_tileset/grass_bottom_right.png", "images/grass_tileset/grass_left_single.png", "images/grass_tileset/grass_bottom_left.png", "images/grass_tileset/grass_middle_single_horizontal.png", "images/grass_tileset/grass_bottom_middle.png", "images/grass_tileset/grass_top_single.png", "images/grass_tileset/grass_middle_single_vertical.png", "images/grass_tileset/grass_top_right.png", "images/grass_tileset/grass_middle_right.png", "images/grass_tileset/grass_top_left.png", "images/grass_tileset/grass_middle_left.png", "images/grass_tileset/grass_top_middle.png", "images/grass_tileset/ground_tile.png"], 
		"full", 
		true, // clips
		true  // draws
	);

	Materials.defineTileset(GrassTileset);

	Materials.defineTile(Materials.getTileset("Grass"), 25, 25, 0, 0);

	BuckyGame = new Scene(map, 25);

	Editor.initialize(BuckyGame);

	caller();	// start the physics and drawing loops to start game
}

function caller(){
	physInterval = setInterval(physics, physExecuteMs);
	draw_world();
}

function physics(){
	Controller.poller();
	if(Controller.mouse().click.left){
		tempFlag = true;
		BuckyGame.getLayer('Main', 0).add(
			new Materials.createTile("Grass", Math.floor(Controller.mouse().move.x/25), Math.floor(Controller.mouse().move.y/25))
		);
		map[0].elements[map[0].elements.length] = {type: "Grass", x: Math.floor(Controller.mouse().move.x/25), y: Math.floor(Controller.mouse().move.y/25)};
	} else if(tempFlag){
		tempFlag = false;
		BuckyGame.reloadMap();
		Editor.genLayerContent();
	}
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