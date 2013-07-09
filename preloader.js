var Preloader = (function(){

	var images = {};
	var sounds = {};
	var addedCount = 0;
	var readyCount = 0;
	var failedCount = 0;
	var callback = null;
	var fired = false;

	return {

		addImage: function(argImageSrc) {
			// called with an array of images
			if(argImageSrc instanceof Array){
				addedCount += argImageSrc.length;
				for(var i = 0, len = argImageSrc.length; i<len; i++){
					Preloader.addImage(argImageSrc[i]);
				}
			} else { // called with a single image
				addedCount++;
				images[argImageSrc] = new Image();
				images[argImageSrc].src = argImageSrc;

				images[argImageSrc].onload = function(){
					readyCount++;
					Preloader.checkDone();
				};

				images[argImageSrc].onerror = function(){
					failedCount++;
					Preloader.checkDone();
				};
			}
		},
		hasImage: function(argImageSrc) {
			return images.hasOwnProperty(argImageSrc);
		},
		getImage: function(argImageSrc) {
			return images[argImageSrc];
		},

		addSound: function(argSoundSrc) {
			addedCount++
			sounds[argSoundSrc] = new Audio(argSoundSrc);
		},
		hasSound: function(argSoundSrc) {
			return sounds.hasOwnProperty(argSoundSrc);
		},
		getSound: function(argSoundSrc) {
			return sounds[argSoundSrc];
		},
		checkDone: function(){
			if( readyCount === addedCount && failedCount === 0 && addedCount > 0 ){
				callback();
			} else {
				console.log("Still loading -> successes: " + readyCount + ", failures: " + failedCount);
			}
		},
		ready: function(argCallback){
			callback = argCallback;
		},
		rearm: function(){
			fired = false;
		}

	};

})();