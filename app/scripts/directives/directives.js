'use strict';
/*globals angular, _ */

angular.module('ShoeFinder.directives', [])
	// Grand title for something that hides outgoing view and fades in the new one
	.directive('sfViewManager', function() {
		return {
			restrict: 'A',
			link: function(scope, element /*, attrs */) {
				// console.log('Scope', scope, scope.$eval(attrs.toggleVisibility));
				// Watch changes to currentView prop so we can hide outgoing view and fadeIn incoming
				scope.$watch('currentView', function(newValue /*, oldValue */) {
					// console.log(newValue, oldValue);
					if (newValue) {
						var $selected = element.find('#' + newValue.id)
							.stop(true, true).fadeIn('slow', function() {
								if (newValue.id === 'pro') {
									// Neutral should always be pre-selected on pronation
									element.find('#neutral').trigger('click');
								}
							});

						element.find('.view').not($selected).hide();
					}
				});

				// Watch for changes on product length so we can shift scroll position
				scope.$watch('products.length', function(newValue /*, oldValue */) {
					if (newValue) {
						var shoeFinder = angular.element('#shoe-finder');
						angular.element('html body')
							.delay(1000)
							.animate({ scrollTop: shoeFinder.offset().top }, 500, 'easeOutQuart');
					}
				});
			}
		};
	})
	// Builds the left-hand step menu
	.directive('sfMenu', function() {
		return {
			restrict: 'A',
			scope: {
				views: '=',
				storage: '=',
				currentView: '='
			},
			controller: function($scope) {
				$scope.isPopulated = function(id) {
					// Multi-select filters are an array, single select an object
					var filter = this.storage.filters[id];
					return _.isArray(filter) ? filter.length : filter;
				};
			},
			template:
	            '<li ng-repeat="view in views | filter:{menu: true}" ng-class="{selected: currentView.id == view.id, populated: isPopulated(view.id)}">' +
	              '<div>' +
	                '<p>{{$index + 1}} {{view.label}}</p>' +
	                '<span></span>' +
	                '<p class="selections">{{storage.filters[view.id] | selections}}</p>' +
	              '</div>' +
	            '</li>'
		};
	})
	// Handles switch of pronation animations
	.directive('sfPronation', function() {
		return {
			restrict: 'A',
			link: function(scope, element /*, attrs */) {
				var $li = element.find('li').hide();
				scope.$watch('$storage.filters.pro', function(newValue, oldValue) {
					if (newValue !== oldValue && newValue !== null) {
						$li.hide();
						element.find('#' + newValue.id).stop().fadeIn();
					}
				});
			}
		};
	})
	// Animated bar chart
	.directive('sfBarChart', function() {
		return {
			restrict: 'A',
			/*scope: { view: '@sfBarChart', min: '@minHeight', max: '@maxHeight' },*/
			link: function(scope, element, attrs) {

				scope.$watch('currentView', function(newValue, oldValue) {

					var $bars = element.find('.bar');

					var min = parseInt(attrs.minHeight, 10) || 10,
						max = parseInt(attrs.maxHeight, 10) || 90,
						delay = parseInt(attrs.delay, 10) || 2000,
						duration = parseInt(attrs.duration, 10) || 1000,
						inc = (max - min) / ($bars.length - 1),
						view = attrs.id;

					if (newValue !== oldValue) {
						if (newValue.id === view) {
							$bars.find('figure div').each(function(i) {
								angular.element(this).stop().delay(delay)
									.animate({ height:  (min + (inc * i)) + 'px' }, duration, 'easeOutQuart');
							});
						}
					}
				});
			}
		};
	})
	// Custom checkbox / radio button
	.directive('sfToggleGroup', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {

				var group = attrs.sfToggleGroup,
					multiSelect = attrs.multiSelect;

				element.find('.control').click(function(event) {

					var $target = angular.element(event.target),
						$this = angular.element(this),
						filter = scope.$storage.filters[group];
				
					// Ignore clicks on the hidden input field
					if (!$target.is('input')) {

						var model = {
							id: $this.attr('id'), // We use this to identify the object
							value: $this.find('input').attr('value'), // The filter value passed to back-end API
							label: $this.find('span:first-child').text() // The translatable label for display
						};

						// Apply the model to the scope
						scope.$apply(function() {
							// Model handling is different for multi-select
							scope.$storage.filters[group] = multiSelect ?
								toggleModel(filter, model) :
								model;
						});
					}
				});

				// For multi-select, value needs to be toggled in and out of filter
				function toggleModel(filter, model) {

					if (!_.where(filter, { id: model.id }).length) {
						// Model isn't already on the filter list so add it
						filter.push(model);
					} else {
						// Model is on the filter list so we remove it
						filter = _.reject(filter, function(val) {
							return val.id === model.id;
						});
					}

					// And return the updated filter
					return filter;
				}
			}
		};
	})
	.directive('sfLoader', function($timeout, $window) {
		return {
			restrict: 'A',
			scope: { loading: '=' },
			link: function(scope, element/*, attrs */) {

				var $graphic = element.find('span'),
					frameHeight = 34,
					totalHeight = 646;

				angular.element($window).bind('mousemove', function(e) {
					position(e.pageX, e.pageY);
				});

				function position(x, y) {
					$graphic.css({
						left: x + 'px',
						top: (y - element.offset().top) + 'px'
					});
				}

				// Animates the loader sprite
				function animate(currentFrame) {
					$timeout(function() {
						var y = currentFrame * frameHeight;
						$graphic.css('background-position', '0px ' + (y * -1) + 'px');
						currentFrame = (y < (totalHeight - frameHeight)) ?
							currentFrame + 1 : 0;
						animate(currentFrame);
					}, 100);
				}

				// Start animating the loader
				animate(0);

				// Fade loader in / out when scope property changes
				scope.$watch('loading', function(newValue) {
					if (newValue) {
						element.stop().delay(500).fadeIn();
					} else {
						element.stop().hide();
					}
				});

				// Bind loader position to mouse position 
				scope.$watch('position', function(newValue, oldValue) {
					if (newValue !== oldValue) {
						position(newValue.x, newValue.y);
					}
				});
			}
		};
	});