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
    });

    $scope.selectedBits = {
        watermark: IMAGE_BASE + "watermark/watermark.png", 
        base: IMAGE_BASE + "base/base.png", 
        paws: "", 
        eyes: "", 
        teeth: "", 
        tail: "", 
        coat: "", 
        ears: "", 
        whiskers: ""
    };

    $scope.ctx = $element.find("canvas")[0].getContext("2d");

    $scope.drawnBits = {};
    $scope.savedImages = {};

    $scope.drawLintling = function() {
        var drawOrder = ["watermark", "teeth", "ears", "coat", "whiskers", "paws", "eyes", "tail", "base"].reverse();

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

        var promises = [];
        for (var part in $scope.selectedBits) {
            if ($scope.selectedBits[part] != "" && $scope.selectedBits[part] != undefined && $scope.selectedBits[part] != $scope.drawnBits[part]) {
                var promise = getImage($scope.selectedBits[part]);
                promise.then((function(part) {
                    return function(img) {
                        $scope.savedImages[part] = img;
                    };
                })(part));
                promises.push(promise);
            }
            if ($scope.selectedBits[part] == "" || $scope.selectedBits[part] == undefined) {
                $scope.savedImages[part] = null;
            }
        }
        $q.all(promises).then(function() {
            $scope.ctx.clearRect(0, 0, IMAGE_SCALE * ORIGIN_W, IMAGE_SCALE * ORIGIN_H);
            for (var k in drawOrder) {
                if (drawOrder[k] in $scope.savedImages && $scope.savedImages[drawOrder[k]] != null) {
                    $scope.ctx.drawImage($scope.savedImages[drawOrder[k]], 0, 0, IMAGE_SCALE * ORIGIN_W, IMAGE_SCALE * ORIGIN_H);
                }
            }
            $scope.drawnBits = angular.copy($scope.selectedBits);
        });
    };

    $scope.saveDesign = function() {
        $scope.savedDesign = $scope.selectedBits;
        localStorage.setItem("savedLintling", JSON.stringify($scope.savedDesign));
        $scope.hasSavedDesign = true;
    };

    $scope.loadDesign = function() {
        angular.extend($scope.selectedBits, JSON.parse(localStorage.getItem("savedLintling")));
    }

    $scope.$watch(function() { return $scope.selectedBits; }, $scope.drawLintling, true);

    $scope.hasSavedDesign = false;
    $scope.savedDesign = JSON.parse(localStorage.getItem("savedLintling"));
    if ($scope.savedDesign != null) {
        $scope.hasSavedDesign = true;
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
