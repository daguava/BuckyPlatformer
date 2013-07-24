var Editor = (function(Controller, CanvasTag){

	var isEditing = false;
	var sceneIsCurrent = false;
	var currentTool = "";

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
	var sublayer = $('<div class="sublayer"></div>');

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

			// add tool buttons to tools div
			newToolsDiv.append(pencilTool);
			newToolsDiv.append(bucketTool);

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

			// bind handlers
			$(CanvasTag).bind('mousedown.editorMapping', function(){
				$(CanvasTag).bind('mousemove', function(){
					if( Editor.editing() ){
						Editor.mapping();
					} 
				});
			});

			$(CanvasTag).bind('mouseup', function(){$(CanvasTag).unbind('mousedown.editorMapping')} );

			$('.tool_button').click(function(){
				$('.tool_button').removeClass('active').addClass('inactive');
				$(this).removeClass('inactive').addClass('active');
				Editor.tool( $(this).attr('id') );
			});

			
		},

		tool: function(argTool){
			if(typeof argTool !== 'undefined'){
				currentTool = argTool;
			} else {
				return currentTool;
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
			}

		},

		pencilTool: function(){
			if( Controller.mouse().click.left ){
				sceneIsCurrent = false;
				var radioBtn = $('input[name="drawLayer"]:checked');
				scene.getLayer( radioBtn.data("layerType"), radioBtn.data("pos") ).add(
					new Materials.createTile("Grass", Math.floor(Controller.mouse().move.x/25), Math.floor(Controller.mouse().move.y/25))
				);
			} else if( Controller.mouse().click.right ){
				sceneIsCurrent = false;
				var radioBtn = $('input[name="drawLayer"]:checked');
				layer = scene.getLayer( radioBtn.data("layerType"), radioBtn.data("pos") );
				layer.remove(  Math.floor(Controller.mouse().move.x/25), Math.floor(Controller.mouse().move.y/25) );
			} else if( !sceneIsCurrent ){
				var radioBtn = $('input[name="drawLayer"]:checked');
				map = scene.mapify();
				scene.reloadMap();
				Editor.genLayerContent();
				sceneIsCurrent = true;
			}
		},

		bucketTool: function(){

			function floodFill(x, y, count){

				if( typeof count === "undefined"){
					count = 0;
				}

				count++;

				if( count > 100 ){
					console.log("max flood reached"); 
					return;
				} 

				if( !scene.getLayer( radioBtn.data("layerType"), radioBtn.data("pos") ).get(x, y) ){
					// mark this one
					scene.getLayer( radioBtn.data("layerType"), radioBtn.data("pos") ).add(
						new Materials.createTile("Grass", x, y)
					);
					// call surrounding four
					floodFill(x+1, y, count);
					floodFill(x-1, y, count);
					floodFill(x, y+1, count);
					floodFill(x, y-1, count);
				} else {
					return false;
				}
			}

			function floodRemove(x, y){

			}

			if( Controller.mouse().click.left ){
				sceneIsCurrent = false;
				var radioBtn = $('input[name="drawLayer"]:checked');

				floodFill( Math.floor(Controller.mouse().move.x/25), Math.floor(Controller.mouse().move.y/25) );

			} else if( Controller.mouse().click.right ){
				sceneIsCurrent = false;
				var radioBtn = $('input[name="drawLayer"]:checked');

				//layer = scene.getLayer( radioBtn.data("layerType"), radioBtn.data("pos") );
				//layer.remove(  Math.floor(Controller.mouse().move.x/25), Math.floor(Controller.mouse().move.y/25) );
				floodRemove( Math.floor(Controller.mouse().move.x/25), Math.floor(Controller.mouse().move.y/25) );

			} else if( !sceneIsCurrent ){
				var radioBtn = $('input[name="drawLayer"]:checked');
				map = scene.mapify();
				scene.reloadMap();
				Editor.genLayerContent();
				sceneIsCurrent = true;
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

		},

		genExtraContent: function(){

		}



	};

})(Controller, CanvasTag);