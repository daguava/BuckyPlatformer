var Editor = (function(Controller, CanvasTag){

	var isEditing = false;
	var sceneIsCurrent = false;
	var currentTool = "";
	var currentTileset = "";
	var floodTerminate = false;

	var scene = null;

	var layerTab = $('#layer');
	var mappingTab = $('#mapping');
	var extraContent = $('#extra');

	var layerContainer = $('#layer_container');
	var extraContainer = $('#layer_container');
	var mappingContainer = $('#layer_container');

	var layerContent = $('#layer_content');
	var extraContent = $('#extra_content');
	var mappingContent = $('#mapping_content');

	var layerDiv = $('<div class="layerDiv"></div>');
	var sublayer = $('<div class="subLayer"></div>');

	var tilesetDiv = $('<div class="tilesetDiv"></div>');
	var subTileset = $('<div class="subTileset"></div>');

	var toolsDiv = $('<div class="tools"></div>');
	var toolButton = $('<div class="tool_button"></div>');

	var checkbox = $('<input type="checkbox"/>');
	var radio = $('<input type="radio">');

	var selectedLayerObj = null;

	$('.editor_tab').click(function(){

		$('.editor_tab').removeClass('active').addClass('inactive');
		$(this).removeClass('inactive').addClass('active');

		$('.editor_tab').each(function(){
			$( "#" + $(this).attr('id') + "_container").stop().hide();
		});

		$( "#" + $(this).attr('id') + "_container").stop().show();

	});

	return {

		initialize: function(argScene) {
			scene = argScene;

			var newToolsDiv = toolsDiv.clone();

			// create tool buttons
			var pencilTool = toolButton.clone();
			pencilTool.html("<img src='images/ui/editor/pencil.png' id='pencil' />");
			pencilTool.attr('id', 'pencil');
			var bucketTool = toolButton.clone();
			bucketTool.html("<img src='images/ui/editor/bucket.png' id='bucket' />");
			bucketTool.attr('id', 'bucket');
			var panTool = toolButton.clone();
			panTool.html("<img src='images/ui/editor/pan.png' id='pan' />");
			panTool.attr('id', 'pan');

			// add tool buttons to tools div
			newToolsDiv.append(pencilTool);
			newToolsDiv.append(bucketTool);
			newToolsDiv.append(panTool);

			// add tools div before layersContent (so it doesn't clear when layers update)
			layerContainer.prepend(newToolsDiv);

			// add right-border to last div
			$('.tool_button').last().css('border-right', '1px solid #333333');
			// make all tools appear inactive
			$('.tool_button').addClass('inactive');
			// make first tool appear active
			$('.tool_button').first().removeClass('inactive').addClass('active');
			// add left border to first tab
			$('.editor_tab').first().css('border-left', '1px solid #000000');

			// set first tool as the first tool button that appears
			Editor.tool( $('.tool_button.active').first().attr('id') );

			// generate layer content
			Editor.genLayerContent();
			Editor.genMappingContent();

			// bind handlers
			$(CanvasTag).bind('mousedown', function(){
				if(Editor.tool() === "pencil" || Editor.tool() === "pan"){
					$(CanvasTag).bind('mousemove.editorMapping', function(){
						if( Editor.editing() ){
							Editor.mapping();
						} 
					});
				} else if(Editor.tool() === "bucket"){
					if( Editor.editing() ){
						Editor.mapping();
					} 
				}
				
			});

			$(CanvasTag).bind('mousewheel.editorMappingWheel', function(){
				if(Editor.tool() === "pan"){
					if( Editor.editing() ){
						Editor.mapping();
					} 
				}
			});

			$(CanvasTag).bind('mouseup', function(){
				$(CanvasTag).unbind('mousemove.editorMapping');
				if( Editor.editing() ){ // final mapping call, for regen
					Editor.mapping();
				} 
			});

			$('.tool_button').click(function(){
				Controller.mouse().scroll.editorSum = 0;
				$('.tool_button').removeClass('active').addClass('inactive');
				$(this).removeClass('inactive').addClass('active');
				Editor.tool( $(this).attr('id') );
			});

			$('.subTileset').last().css('border-bottom', '1px solid #333333');

			$('.subTileset').click(function(){
				$('.subTileset').removeClass('active').addClass('inactive');
				$(this).removeClass('inactive').addClass('active');
				Editor.tileset( $(this).attr('id') );
			});

			$('.subTileset').first().trigger('click');

			
		},

		tool: function(argTool){
			if(typeof argTool !== 'undefined'){
				currentTool = argTool;
			} else {
				return currentTool;
			}
		},

		tileset: function(argTileset){
			if(typeof argTileset !== 'undefined'){
				currentTileset = argTileset;
			} else {
				return currentTileset;
			}
		},

		editing: function(argStatus){
			if(typeof argStatus !== 'undefined'){
				isEditing = argStatus;
			} else {
				return isEditing;
			}
		},

		mapping: function(){

			if( Editor.tool() === "pencil" ){
				Editor.pencilTool();
			} else if( Editor.tool() === "bucket" ){
				Editor.bucketTool();
			} else if( Editor.tool() === "pan" ){
				Editor.panTool();
			}

		},

		pencilTool: function(){

			var x = Math.floor( (Controller.mouse().move.x-scene.view.x() )/scene.getBlocksize()/scene.view.zoom());
			var y = Math.floor( (Controller.mouse().move.y-scene.view.y() )/scene.getBlocksize()/scene.view.zoom());
			var radioBtn = $('input[name="drawLayer"]:checked');
			var currentLayer =  scene.getLayer( radioBtn.data("layerType"), radioBtn.data("pos") ); 

			if( Controller.mouse().click.left ){
				sceneIsCurrent = false;
				
				if( !currentLayer.get(x, y) || currentLayer.get(x, y).getType() !== Editor.tileset() ){
					if( currentLayer.get(x, y) ) currentLayer.remove(x, y);
					currentLayer.add( new Materials.createTile(Editor.tileset(), x, y, scene.getBlocksize() ) );
				}

			} else if( Controller.mouse().click.right ){
				sceneIsCurrent = false;
				currentLayer.remove(x, y);
			} else if( !sceneIsCurrent ){
				map = scene.mapify();
				scene.reloadMap();
				Editor.genLayerContent();
				sceneIsCurrent = true;
			}
		},

		bucketTool: function(){

			var floodLimit = 1000;

			function floodFill(x, y, count, type){

				if( typeof count === "undefined"){
					count = 0;
				}

				count++;

				if( count > floodLimit || floodTerminate ){
					if(count > floodLimit && !floodTerminate){
						console.log("MAX FLOOD REACHED, NO BOUNDS FOUND"); 
					}
					floodTerminate = true;
					return false;
				} 
				
				var currentElement = scene.getLayer( radioBtn.data("layerType"), radioBtn.data("pos") ).get(x, y);
				if( currentElement ) currentElement = currentElement.getType();

				if(  currentElement === type && Editor.tileset() !== type ){
					sceneIsCurrent = false;
					var layer = scene.getLayer( radioBtn.data("layerType"), radioBtn.data("pos") );

					layer.remove(x, y);
					layer.add( new Materials.createTile(Editor.tileset(), x, y, scene.getBlocksize()) );
					// call surrounding four

					floodFill(x+1, y, count, type);
					floodFill(x-1, y, count, type);
					floodFill(x, y+1, count, type);
					floodFill(x, y-1, count, type);
					if(count === 1) floodTerminate = false;
				} else {
					return false;
				}
			}

			function floodRemove(x, y){
				
				var currentElement = scene.getLayer( radioBtn.data("layerType"), radioBtn.data("pos") ).get(x, y);

				if(  currentElement  ){
					sceneIsCurrent = false;
					var layer = scene.getLayer( radioBtn.data("layerType"), radioBtn.data("pos") );
					layer.remove(x, y);
					// call surrounding four

					floodRemove(x+1, y);
					floodRemove(x-1, y);
					floodRemove(x, y+1);
					floodRemove(x, y-1);
				} else {
					return false;
				}
			}

			if( Controller.mouse().click.left ){
				var radioBtn = $('input[name="drawLayer"]:checked');
				var x = Math.floor((Controller.mouse().move.x-scene.view.x())/scene.getBlocksize()/scene.view.zoom());
				var y = Math.floor((Controller.mouse().move.y-scene.view.y())/scene.getBlocksize()/scene.view.zoom());
				var lookupType = scene.getLayer( radioBtn.data("layerType"), radioBtn.data("pos") ).get(x, y);
				if( lookupType ) lookupType = lookupType.getType();

				floodFill( x, y, 0, lookupType );

			} else if( Controller.mouse().click.right ){
				var x = Math.floor((Controller.mouse().move.x-scene.view.x())/scene.getBlocksize()/scene.view.zoom());
				var y = Math.floor((Controller.mouse().move.y-scene.view.y())/scene.getBlocksize()/scene.view.zoom());
				var radioBtn = $('input[name="drawLayer"]:checked');
				floodRemove( x, y );

			} else if( !sceneIsCurrent ){
				var radioBtn = $('input[name="drawLayer"]:checked');
				map = scene.mapify();
				scene.reloadMap();
				Editor.genLayerContent();
				sceneIsCurrent = true;
			}
		},

		panTool: function(){
			if( Controller.mouse().click.left ){
				scene.view.x(Controller.mouse().move.deltaX);
				scene.view.y(Controller.mouse().move.deltaY);
			}
			if ( Controller.mouse().scroll.editorSum !== 0 ){
				scene.view.zoom(Controller.mouse().scroll.editorSum);
				Controller.mouse().scroll.editorSum = 0;
			}
			
		},

		selectedLayer: function(argLayerObj){
			if(typeof argLayerObj !== 'undefined'){
				selectedLayerObj = argLayerObj;
			} else {
				return selectedLayerObj;
			}
		},

		genLayerContent: function(){

			var sceneLayers = scene.getLayersObject();
			var radioSetFlag = false;

			// empty layer to prepare for new generation
			layerContent.empty();

			// add each layer, with a respective radio and checkbox button (radio->drawOn, checkbox->visible)
			for(layerArray in sceneLayers){

				var newLayerDiv = layerDiv.clone();
				newLayerDiv.html(layerArray + "<br />");
				for(var _i = 0; _i < sceneLayers[layerArray].length; _i++){

					var current = sceneLayers[layerArray][_i];

					var newRd = radio.clone();
					newRd.data( "layerType", current.getType() );
					newRd.data( "pos", _i );
					if(Editor.selectedLayer() != null && Editor.selectedLayer().type === current.getType() && Editor.selectedLayer().pos === _i){
						newRd.attr('checked', true);
					} else {
						newRd.attr('checked', !radioSetFlag);
					}
					
					newRd.attr('name', "drawLayer");
					newRd.click(function(){
						Editor.selectedLayer({
							type: $(this).data("layerType"),
							pos: $(this).data("pos")
						});
					});

					var newCb = checkbox.clone();
					newCb.data( "layerType", current.getType() );
					newCb.data( "pos", _i );
					newCb.attr('checked', current.draws());
					newCb.click(function(){
						scene.getLayer( $(this).data("layerType"), $(this).data("pos") ).toggleDraw();
					});

					var newSl = sublayer.clone();
					newSl.append( ' Priority: ' + current.priority() + ', Elements: ' + current.length() );
					newSl.prepend( newCb );
					newSl.prepend( newRd );
					newLayerDiv.append(newSl);

					radioSetFlag = true;

				}

				layerContent.append(newLayerDiv).append("<hr />");

			}
		},

		genMappingContent: function(){

			var tilesetArray = Materials.getTilesetArray();
			var newTilesetDiv = tilesetDiv.clone();

			mappingContent.empty();
			
			for(_tileset = 0; _tileset < tilesetArray.length; _tileset++){
				var currentTileset = tilesetArray[_tileset];
				var newSubTileset = subTileset.clone();
				newSubTileset.attr('id', currentTileset.getType() );
				var layerImage = currentTileset.getImage(0);
				var layerImageElement;
				if( layerImage ){
					layerImageElement = "<img src='" + layerImage.src + "' /> ";
				} else {
					layerImageElement = "<div style='width: 23px; height: 23px; border: 1px solid red; display: inline-block;'> </div>";
				}
				newSubTileset.html( layerImageElement + " " + currentTileset.getType() );
				newTilesetDiv.append( newSubTileset );
			}
			mappingContent.append(newTilesetDiv);
		},

		genExtraContent: function(){

		}



	};

})(Controller, CanvasTag);