'use strict';
/*globals angular, _*/

angular.module('filters')
	// Filter selections for use display in menu
	.filter('selections', function() {
		return function(input) {
			return _.isArray(input) ?
				_.pluck(input, 'label').join(' / ') :
				input && input.id || '';
		};
	});
