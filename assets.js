assets_loaded = 0;
img_preload = new Array();

function logstats(){
	if(assets_loaded != image_preload_array.length){
		console.log(assets_loaded + " / " + image_preload_array.length);
	}
}

function preload(){
	image_preload_array = new Array(
		"images/grass_tileset/grass_top_left.png", 
		"images/grass_tileset/grass_top_middle.png", 
		"images/grass_tileset/grass_top_right.png", 
		"images/grass_tileset/grass_middle_left.png", 
		"images/grass_tileset/ground_tile.png", 
		"images/grass_tileset/grass_middle_right.png", 
		"images/grass_tileset/grass_bottom_left.png", 
		"images/grass_tileset/grass_bottom_middle.png", 
		"images/grass_tileset/grass_bottom_right.png", 
		"images/grass_tileset/grass_top_single.png", 
		"images/grass_tileset/grass_left_single.png", 
		"images/grass_tileset/grass_right_single.png", 
		"images/grass_tileset/grass_bottom_single.png", 
		"images/grass_tileset/grass_middle_single_horizontal.png", 
		"images/grass_tileset/grass_middle_single_vertical.png",
		"images/grass_tileset/grass_single.png",
		"images/rock_tileset/platform.png", 
		"images/rock_tileset/platform_underneath.png",
		"images/spike_tileset/spike_pit.png", 
		"images/spike_tileset/spike_lower.png",
		"images/items/beer_mug.png",
		"images/items/item_block.png",
		"images/items/item_block_hit.png",
		"images/blank.png",
		"images/enemy/generic_enemy_placeholder.gif",
		"images/animations/explosion/explosion1.gif", 
		"images/animations/explosion/explosion2.gif", 
		"images/animations/explosion/explosion3.gif", 
		"images/animations/explosion/explosion4.gif", 
		"images/animations/explosion/explosion5.gif", 
		"images/animations/explosion/explosion6.gif", 
		"images/animations/explosion/explosion7.gif", 
		"images/animations/explosion/explosion8.gif", 
		"images/animations/explosion/explosion9.gif", 
		"images/animations/explosion/explosion10.gif", 
		"images/animations/explosion/explosion11.gif", 
		"images/animations/explosion/explosion12.gif", 
		"images/animations/explosion/explosion13.gif", 
		"images/animations/explosion/explosion14.gif", 
		"images/animations/explosion/explosion15.gif", 
		"images/animations/explosion/explosion16.gif", 
		"images/animations/explosion/explosion17.gif", 
		"images/animations/explosion/explosion18.gif", 
		"images/animations/explosion/explosion19.gif", 
		"images/animations/explosion/explosion20.gif", 
		"images/animations/explosion/explosion21.gif", 
		"images/animations/explosion/explosion22.gif", 
		"images/animations/explosion/explosion23.gif", 
		"images/animations/explosion/explosion24.gif",
		"images/backgrounds/test_background.jpg",
		"images/winblock/winblock.png",
		"images/bucky/bucky_small.gif",
		"images/bucky/bucky_right.gif",
		"images/bucky/bucky_left.gif",
		"images/bucky/bucky_right_jump.gif",
		"images/bucky/bucky_left_jump.gif",
		"images/bucky/bucky_normal.gif",
		"images/bucky/bucky_right.gif",
		"images/bucky/bucky_right_second.gif",
		"images/bucky/bucky_left_second.gif"
	);

	for(i = 0; i<image_preload_array.length; i++){
		img_preload[i] = new Image();
		//img_preload[i].num = i;
		img_preload[i].addEventListener("load", function() {
            assets_loaded++;
            console.log(this.src + " loaded!");
        }, false);
        img_preload[i].addEventListener("error", function() {
		    console.log("hmm, " + this.src + " failed!");
		}, false);
        img_preload[i].src = image_preload_array[i];
	}

	preload_interval = setInterval(preload_poller, 100);
}

function preload_poller(){
	if(assets_loaded == image_preload_array.length){
		clearInterval(preload_interval);
		begin_game();
	}
}