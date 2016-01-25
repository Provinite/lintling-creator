(function() {
	angular.module('lintling-christmas', [])

	.constant('ORIGIN_W', 2041)
	.constant('ORIGIN_H', 1900)
	.constant('IMAGE_BASE', './assets/image/')
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
var dollMaker = function($scope, $http, $element, $q, ORIGIN_W, ORIGIN_H, IMAGE_BASE, IMAGE_SCALE) {
    $http.get('./assets/json/parts.json').success(function(data) {
        var parts = {};
        for (var i in data) {
            parts[i] = [];
            for (var k in data[i]) {
                parts[i][k] = {};
                parts[i][k]['url'] = IMAGE_BASE + i + '/' + data[i][k];
                parts[i][k]['name'] = data[i][k]
                    .replace(/_/g, " ")
                    .replace('.png', '')
                    .replace(' - ', ', ');
            }
        }
        $scope.parts = parts;
        console.log(parts);
    });

    $scope.selectedBits = {base: "./assets/image/base/base.png", paws:"", eyes: "", teeth: "", tail: "", coat: "", ears: "", whiskers: ""};

    $scope.partChange = function(part) {
        console.log(part + ": " + $scope.selectedBits[part]);
    }

    $scope.ctx = $element.find("canvas")[0].getContext("2d");

    $scope.drawLintling = function() {
        var drawOrder = ["teeth", "ears", "coat", "whiskers", "paws", "eyes", "tail", "base"].reverse();

        var getImage = function(url) {
            var img = new Image();
            var loaded = false;
            var error = false;

            var promise = $q.defer();

            img.onload = function() {
                promise.resolve(img);
            }
            img.onerror = function() {
                promise.reject();
            }

            img.src = url;
            return promise.promise;
        }

        var images = {};
        var promises = [];
        for (var part in $scope.selectedBits) {
            if ($scope.selectedBits[part] != "" && $scope.selectedBits[part] != undefined) {
                var promise = getImage($scope.selectedBits[part]);
                promise.then((function(part) {
                    return function(img) {
                        images[part] = img;
                    };
                })(part));
                promises.push(promise);
            }
        }
        $q.all(promises).then(function() {
            $scope.ctx.clearRect(0, 0, IMAGE_SCALE * ORIGIN_W, IMAGE_SCALE * ORIGIN_H);
            for (var k in drawOrder) {
                if (drawOrder[k] in images) {
                    $scope.ctx.drawImage(images[drawOrder[k]], 0, 0, IMAGE_SCALE * ORIGIN_W, IMAGE_SCALE * ORIGIN_H);
                }
            }
            $scope.ctx.font = "15px Arial";
            $scope.ctx.fillText("Lintling Creator - CloverCoin.DeviantArt.com", 30, IMAGE_SCALE * ORIGIN_H - 40);
        });
    }
};

angular.module('lintling-christmas')
.controller('dollmaker', [
    '$scope',
    '$http',
    '$element',
    '$q',
    'ORIGIN_W',
    'ORIGIN_H',
    'IMAGE_BASE',
    'IMAGE_SCALE',
    dollMaker]);
