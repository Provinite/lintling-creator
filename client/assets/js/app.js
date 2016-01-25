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