(function() {
	angular.module('lintling-christmas', [])

	.constant('ORIGIN_W', 2041)
	.constant('ORIGIN_H', 1900)
	.constant('IMAGE_BASE', '/assets/image/')
	.constant('IMAGE_SCALE', 0.3)
    .filter('capitalize', function() {
        return function(input, scope) {
            if (input!=null)
            input = input.toLowerCase();
            return input.substring(0,1).toUpperCase()+input.substring(1);
        }
    });
})();


/*

var O_H = 1900;
var O_W = 2041;

var CANVAS_X = 0.3 * O_W;
var CANVAS_Y = 0.3 * O_H;

var drawLintling = function(ctx, lintling) {
	var drawOrder = ["base", "teeth", "ears", "coat", "whiskers", "paws", "eyes", "tail"];
	var images = [];
	var completed = 0;

	var drawImages = function() {
		console.log("Ready to draw!");
		ctx.drawImage(images[0], 0, 0, CANVAS_X, CANVAS_Y);
		for (var i = images.length - 1; i > 0; i--) {
			console.log("Drawing: " + i);
			ctx.drawImage(images[i], 0, 0, CANVAS_X, CANVAS_Y);
		}
	}

	//ctx.globalCompositeOperation = "multiply";
	for (var i = 0; i < drawOrder.length; i++) {
		var url = "./assets/image/" + drawOrder[i] + "/" + lintling[drawOrder[i]];
		var img = new Image();

		img.onload = (function(k, img) {
			return function() {
				console.log("Drawing: " + img.src);
				images[k] = img;
				completed++;
				if (completed == drawOrder.length) {
					drawImages();
				}
			}
		})(i, img);

		img.src = url;
	}
}

$(document).ready(function() {
	var lintling = {
		teeth: "top_set_teeth.png",
		ears: "droop_large_ears_-_medium_fluff.png",
		coat: "fluffy_coat.png",
		whiskers: "extra_long_whiskers.png",
		paws: "claws.png",
		eyes: "glass_eyes.png",
		tail: "medium_tail_-_buzzed_fluff.png",
		base: "base.png"
	};

	var canvas = document.getElementById("canvas");
	canvas.width = CANVAS_X;
	canvas.height = CANVAS_Y;
	var ctx = canvas.getContext("2d");

	drawLintling(ctx, lintling);
})

*/