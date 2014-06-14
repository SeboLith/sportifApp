'use strict';

/* Filters */

angular.module('directives')
.filter('limitToIf', function() {
	return function(input, limit, condition) {
		if (condition && input.length > limit) {
			var hasActive = false;
			for (var i = limit; i < input.length; i++) {
				if (input[i].active) {
					hasActive = true;
					break;
				}
			};
		}
		return condition && !hasActive ? input.slice(0, limit) : input;
	};
}).filter('increment', function() {
	return function(input, condition) {
		if (condition) {
			input++;
		}
		return input;
	};
});
