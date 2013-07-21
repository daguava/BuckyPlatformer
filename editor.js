var Editor = (function(){

	var scene = null;

	var layerTab = $('#layer');
	var mappingTab = $('#mapping');
	var extraContent = $('#extra');

	var layerContent = $('#layer_content');
	var extraContent = $('#extra_content');
	var mappingContent = $('#mapping_content');

	var layerDiv = $('<div class="layerDiv"></div>');
	var sublayer = $('<div class="sublayer"></div>');
	var checkbox = $('<input type="checkbox"/>');
	var radio = $('<input type="radio">');

	$('.editor_tab').click(function(){

		$('.editor_tab').removeClass('active').addClass('inactive');
		$(this).removeClass('inactive').addClass('active');

		$('.editor_tab').each(function(){
			$( "#" + $(this).attr('id') + "_content").stop().hide();
		});

		$( "#" + $(this).attr('id') + "_content").stop().show();

	});


	return {

		initialize: function(argScene) {
			scene = argScene;
			Editor.genLayerContent();
		},
		genLayerContent: function(){

			var sceneLayers = scene.getLayersObject();
			var radioSetFlag = false;
			layerContent.empty();

			for(layerArray in sceneLayers){

				var newLayerDiv = layerDiv.clone();
				newLayerDiv.html(layerArray + "<br />");
				for(var _i = 0; _i < sceneLayers[layerArray].length; _i++){

					var current = sceneLayers[layerArray][_i];

					var newRd = radio.clone();
					newRd.data( "layerType", current.getType() );
					newRd.data( "pos", _i );
					newRd.attr('checked', !radioSetFlag);
					newRd.attr('name', "drawLayer");

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

})();