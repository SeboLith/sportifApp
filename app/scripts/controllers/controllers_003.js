'use strict';
/*global angular, _, globals*/

/* Controllers */

// Package by feature and use modules for layers within the package as described 
// under the large to very large project structure outline here:  
// http://codingsmackdown.tv/blog/2013/04/19/angularjs-modules-for-great-justice/

angular.module('ShoeFinder.controllers', [])
	// Define the main ShoeFinder controller
	.controller('ShoeFinderCtrl', function ShoeFinder($scope, $rootScope, $location, $localStorage, ProductListService) {

		// Define the views which make up the application
		// Ultimately this could be written to containing page from JSP template
		$scope.views = [
			{ id: 'splash', url: 'splash', menu: false, data: false },
			{ id: 'surface', url: 'surface', menu: true, label: 'Surface', type: 'check', data: false },
			{ id: 'gender', url: 'gender', menu: true, label: 'Gender', type: 'radio', data: false },
			{ id: 'experience', url: 'experience', menu: true, label: 'Experience', type: 'radio', data: true },
			{ id: 'pro', url: 'pronation', menu: true, label: 'Pronation', type: 'radio', data: true },
			{ id: 'results', url: 'results', menu: false, data: true }
		];
		
		// We'll persist filter data to local storage
		$scope.$storage = $localStorage.$default({
			filters: {
				surface: [],
				gender: null,
				bmi: null,
				type: null,
				experience: null,
				pro: null
			}
		});

		$scope.location = $location;
		$scope.productListService = ProductListService;
		$scope.error = false;

		if ($scope.location.path() === '') {
			$scope.location.path('/');
		}

		var nextView; // If data is loading we need to store incoming view until it completes

		function resetFrom(index) {
			// Loop over views including and after the index and reset user filter data
			_.each(_.rest($scope.views, index), function(val/*, key */) {
				$scope.$storage.filters[val.id] = (val.type === 'check') ? [] : null;
			});
		}

		// Update URL according to supplied id
		function setLocation(id) {
			$location.path('/' + id);
		}

		// Call the product list service with the currently 
		// selected filters and sort options
		function getData() {
			$scope.productListService.getProducts(
				$scope.$storage.filters,
				$scope.$storage.sort
			);
		}

		// Converts current path to valid and active view, defaults to splash if path is invalid
		function setCurrentView(id) {

			// Get the view which relates to the supplied id if it's valid.
			// If view is not valid, default to first view in the view list
			nextView = _.where($scope.views, { id: id })[0] || $scope.views[0];

			// Reset filters from this point forwards
			resetFrom(_.indexOf($scope.views, nextView));

			// Load product data if required for this particular view.  
			// If no data is to be loaded for this view, we simply advance
			if (nextView.data) {
				getData();
			} else {
				$scope.currentView = nextView;
			}
		}

		// Returns the index of the current view
		function getCurrentIndex() {
			return _.indexOf($scope.views, _.where($scope.views,
				{ id: $scope.currentView.id })[0]);
		}

		function isResultsView() {
			return getCurrentIndex() === $scope.views.length - 1;
		}

		// Implement our own routing using the location service
		function handlePathChange(path) {
			// console.log('Current path:', path);
			setCurrentView(path.replace('/', ''));
		}

		function handleProductsLoading(/*event*/) {
			$scope.loading = true;
		}

		function handleProductsLoaded(event, result) {

			$scope.loading = false;
			$scope.products = result.products;
			$scope.resultCount = result.resultCount;

			// Only move to the next view if we have results,
			// otherwise show an error. 
			if ($scope.products.length) {
				$scope.currentView = nextView;
			} else {
				$scope.error = true;
			}
		}

		// Handles analytics required on view changes
		function handleViewAnalytics(newValue, oldValue) {
			
			if (newValue && newValue !== oldValue) {

				var index = getCurrentIndex();

				// Splash screen is not included in analytics
				if (index === 0) { return; }

				// The filter data we need was set on the previous view
				var previousView = $scope.views[index - 1],
					filter = $scope.$storage.filters[previousView.id];

				trackPageview('virtual/shoefinder/' + $scope.currentView.url + '/step' + index);

				// Send filters set on previous step
				if (filter) {
					var selections = _.isArray(filter) ? _.pluck(filter, 'id').join(',') : filter.id;
					trackEvent(previousView.url, selections);
				}

				// Only happens on results view
				if (isResultsView()) {
					// Concatenate names of first 15 products returned
					var products = _.pluck($scope.products, 'name').splice(0, 15).join(',');
					var experience = $scope.$storage.filters.experience.id;

					setCustomVar(3, 'Running Experience Level', experience, 1);
					trackEvent('Shoes Loaded', products);
				}
			}
		}

		// Helper methods for google analytics - not entirely necessary, but useful in dev
		// as asicsAnalytics object was not available in this branch.
		function trackPageview(pageURL) {
			globals.googleAnalytics.trackPageview(pageURL);
			// console.log('shoe-finder trackPageView:', pageURL);
		}

		function trackEvent(action, label, value, noninteraction, url) {
			globals.googleAnalytics.trackEvent('Shoe Finder', action, label, value, noninteraction, url);
			// console.log('shoe-finder trackEvent:', 'Shoe Finder', action, label, value, noninteraction);
		}

		function setCustomVar(slot, name, value, scope) {
			globals.googleAnalytics.setCustomVar(slot, name, value, scope);
			// console.log('shoe-finder setCustomVar:', slot, name, value, scope);
		}

		// Set up listeners and watches. 
		$scope.$on('productList.loading', handleProductsLoading);
		$scope.$on('productList.loaded', handleProductsLoaded);

		$scope.$watch('location.path()', handlePathChange);
		$scope.$watch('currentView', handleViewAnalytics);

		// Advances to the next view 
		$scope.next = function() {

			// Get the index of the current view
			var index = getCurrentIndex();
			var view;

			// Reset the index if we're currently on the final view
			if (index === $scope.views.length - 1) {
				index = -1;
				$scope.products = [];
				$rootScope.$broadcast('productListData.reset');
			}

			// Resolve the next view 
			view = $scope.views[++ index];
			
			// Now update the URL
			setLocation(view.id);
		};

		// Closes the error message and returns to previous view (ie. current index)
		$scope.closeErrorMessage = function() {

			// Get the index of the current view
			var index = _.indexOf($scope.views, _.where($scope.views,
				{ id: $scope.currentView.id })[0]);

			$scope.error = false;

			// Only URL has updated, not view index - set location to url of current index
			setLocation($scope.views[index].id);
		};

		// returns true if element of supplied group and property is selected
		$scope.isSelected = function(group, prop) {
			return _.where($scope.$storage.filters[group], { id: prop }).length;
		};
	});