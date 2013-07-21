/////////// requestAnimationFrame shim

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

/////////// performance.now() shim

window.performance = window.performance || {};
performance.now = (function() {
  return performance.now      ||
        performance.mozNow    ||
        performance.msNow     ||
        performance.oNow      ||
        performance.webkitNow ||
        function() { return new Date().getTime(); };
})();

window.addEventListener('dragstart', function(){return false;}, true);
CanvasTag = document.getElementById("draw_canvas");
CanvasTag.focus();
Canvas = CanvasTag.getContext("2d");
physExecuteMs = 7;
tempFlag = false;

Preloader.ready(function(){
    console.log("Preloader finished: Beginning game...");
    begin_game();
});

Preloader.addImage(["images/grass_tileset/grass_single.png", "images/grass_tileset/grass_bottom_single.png", "images/grass_tileset/grass_right_single.png", "images/grass_tileset/grass_bottom_right.png", "images/grass_tileset/grass_left_single.png", "images/grass_tileset/grass_bottom_left.png", "images/grass_tileset/grass_middle_single_horizontal.png", "images/grass_tileset/grass_bottom_middle.png", "images/grass_tileset/grass_top_single.png", "images/grass_tileset/grass_middle_single_vertical.png", "images/grass_tileset/grass_top_right.png", "images/grass_tileset/grass_middle_right.png", "images/grass_tileset/grass_top_left.png", "images/grass_tileset/grass_middle_left.png", "images/grass_tileset/grass_top_middle.png", "images/grass_tileset/ground_tile.png"]);