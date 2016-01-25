var dollMaker = function($scope, $http, $element, $q, ORIGIN_W, ORIGIN_H, IMAGE_BASE, IMAGE_SCALE) {
    $http.get('/assets/json/parts.json').success(function(data) {
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

    $scope.selectedBits = {base: "/assets/image/base/base.png", paws:"", eyes: "", teeth: "", tail: "", coat: "", ears: "", whiskers: ""};

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
