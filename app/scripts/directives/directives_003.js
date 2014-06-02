'use strict';
/*globals angular */

angular.module('ProductList.directives', [])
	// Get the inline width for the ratings block based on supplied rating
	.directive('plRating', function() {
		return {
			restrict: 'A',
			link: function(scope, element /*, attrs */) {

				var rating = scope.averageRating || 0,
					starWidth = 12,
					padding = 1;

				var width = (rating * starWidth) + (Math.floor(rating) * padding);

				element.css('width', width + 'px');
			}
		};
	});


