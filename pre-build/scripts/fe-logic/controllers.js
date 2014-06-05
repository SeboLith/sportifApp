'use strict';
/*global angular, globals*/

/* Controllers */
angular.module('controllers')
	/*
		FOOTER CONTROLLER
	----------------------------------------------------------------------------
	============================================================================ */
	.controller('FooterCtrl', ['$scope', 'ViewData', 'ProductsFactory', function ($scope, ViewData, ProductsFactory) {

		console.log(ProductsFactory.getOne);
		// // set the current date
        var currentDate = new Date();
	    $scope.year = currentDate.getFullYear();

        $scope.newsletter = {};

		$scope.emailRegexValidation = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

		var returnedViewData = ViewData.returnedData.then(function(data){

			$scope.popularProducts  = data[3].data.value;
			$scope.customerServices = data[4].data.value;
			$scope.corporateInfo    = data[5].data.value;
			$scope.company    		= data[0].data.value;

			$scope.validEmailErrorMessage   = data[1].data.value;
			$scope.newsLetterSignupMessage  = data[2].data.value;
		});

        $scope.signup = function(form) {

        	if(form.$valid) {
        		ViewData.newsletterSignup(form.email.$modelValue);
        	}
         };
	}])
	// Define the main ProductList controller
	.controller('ProductListCtrl', ['$scope', '$rootScope', '$localStorage', 'ProductListService', 'QuickBuyService', function ($scope, $rootScope, $localStorage, ProductListService, QuickBuyService) {

		var resetting = false;

		// Defaults
		var sortBy = 'featured';
		var sortLimit = 0;

		// We'll persist sort data to local storage
		$scope.$storage = $localStorage.$default({
			// Backend is effectively hardcoded to return 15
			// results by default, so limit is a bit redundant
			// until we request all ( * )
			sort: {
				by: sortBy,
				limit: sortLimit
			}
		});

		$scope.quickBuyData = QuickBuyService.model;
		$scope.productListService = ProductListService;

		function handleReset() {
			resetting = true;
			$scope.$storage.sort = { by: sortBy, limit: sortLimit };
			$scope.products = [];
		}

		function handleProductsLoaded(event, result) {
			if (result.products.length) {
				$scope.products = result.products;
				$scope.moreResults = result.attributes.showMoreResultsButton;
				$scope.resultCount = result.resultCount;
			}
		}

		// Handles changes to sort options
		function handleSortChange(newValue, oldValue) {

			// Stops this firing on init or when sort property has
			// been reset programmatically.
			if (newValue !== oldValue && !resetting) {
				// We fire off an AJAX call each time sort property changes
				$scope.productListService.getProducts(
					$scope.$storage.filters,
					$scope.$storage.sort
				);
			}
			resetting = false;
		}

		// Set up listeners and watches.
		$scope.$on('productList.loaded', handleProductsLoaded);
		$scope.$on('productListData.reset', handleReset);

		$scope.$watch('$storage.sort', handleSortChange, true);

		// Invoked by show more button (in fact, it shows all)
		$scope.showMore = function() {
			// Set limit to no-limit (there's no limit)
			$scope.$storage.sort.limit = $scope.resultCount;
		};

		// Integrate with existing quick buy functionality
		$scope.quickBuyBroadcast = function() {
			$scope.$parent.$broadcast('quick_buy');
		};

		// Prepends correct context to supplied URL
		$scope.getUrl = function(url) {
			return globals.contextPath + url;
		};
	}])
	// Define the Returns controller
	.controller('ReturnsCtrl', ['$scope', '$http', 'returnData', function ($scope, $http, returnData) {

	    $scope.returnForm = returnData;
	    $scope.errors = false;

	    $scope.validateCurrentStep = function() {
	        var isDataValid = false;
	        switch ($scope.currentStep) {
	            case 1:
	                isDataValid = _.some($scope.returnForm.items, function(item) {
	                    return item.quantity > 0;
	                });
	                break;
	            case 2:
	                isDataValid = _.every($scope.returnForm.items, function(item) {
	                    if (item.quantity > 0)
	                        return (item.reason && item.reason != 'null');
	                    else return true;
	                });
	                break;
	        }
	        if ($scope.moveStepAttempt) {
	            if (isDataValid) $scope.errors = false;
	            else $scope.errors = true;
	        }
	        return isDataValid;
	    }

        $scope.test = function() {
           $scope.returnForm.orderAddress=false;
        }

	    $scope.nextStep = function() {
	        $scope.moveStepAttempt = true;
	        var isDataValid = $scope.validateCurrentStep();
	        if (isDataValid) {
	            $scope.currentStep++;
	            $scope.moveStepAttempt = false;
	        }
	    }

	}])
	// Define the main ShoeFinder controller
	.controller('ShoeFinderCtrl', ['$scope', '$rootScope', '$location', '$localStorage', 'ProductListService', function ($scope, $rootScope, $location, $localStorage, ProductListService) {

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
		// as sportifAnalytics object was not available in this branch.
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
	}])
	.controller('HomeCtrl', ['$scope', function ($scope){

	}])
	.controller('ProductSelector', ['$rootScope', '$scope', '$http', '$window', 'ProductService', 'QuickBuyService', 'CartService', function ($rootScope, $scope, $http, $window, ProductService, QuickBuyService, CartService) {

		$scope.addingInProgress = false;
		// Sizing Processing

		Sportif.Common.urlParamsDetect();

		var model = {
			addAttempted: false,
			code: null,
			colours: null,
			data: {},
			query: window.location.search,
			selection: [],
			variants: null
		};

		var success = function(data) {
			// collect for use in dropdown selectors default settings
			$scope.defaultOneSizeCode = data.defaultOneSizeCode;

			if (data.primaryColourOption.sizeOptions[0].variantOptionQualifiers[0].qualifier == 'shoeWidthCode') {
				_.each(data.primaryColourOption.sizeOptions, function(size, s) {
					size.variantOptionQualifiers.reverse();
				});
			}
			model.data = data;
			model.variants = createVariantTrees(data.primaryColourOption.sizeOptions);
			model.selection = createSelection(data.primaryColourOption.sizeOptions[0].variantOptionQualifiers);
			preSetSelection(data.defaultOneSizeCode);

			// if Selectivizr being used (ie8), refresh the DOM
			if(typeof Selectivizr == 'object'){
				setTimeout(function(){
					Selectivizr.init();
				}, 100);
			}
		};

		var getOptionIndex = function(array, value) {
			var i = -1;
			_.each(array, function(option, o) { if (option.value == value) i = o; });
			return i;
		};

		var createVariantTrees = function(sizeOptions) {

			var variants = [];
			// Loop variant rows
			_.each(sizeOptions, function(size, s) {
				var options,
					option,
					styleNumber = size.styleNumber;
				// Collate into arrays (per qualifier)
				_.each(size.variantOptionQualifiers, function(qualifier, q) {
					// Create variant arrays
					if (s === 0) {
						var guidePage = (qualifier.qualifier == 'shoeSizeCode' || qualifier.qualifier == 'shoeSizeCodeUK' ) ? 'shoe-size-guide' :
							(qualifier.qualifier == 'shoeWidthCode') ? 'shoe-width-guide' : 'clothing-size-guide';
						variants[q] = {
							className: qualifier.qualifier.replace(/([A-Z])/g, function($1){ return "_" + $1.toLowerCase(); }),
							displayValue: qualifier.name,
							guideUrl: globals.contextPath + '/' + guidePage,
							sizes: [],
							value: qualifier.qualifier
						};
						if (size.variantOptionQualifiers.length == 2) variants[q].subVariantIndex = Math.abs(q - 1);
					}
					// Create/Update variant option
					options = variants[q].sizes;
					option = options[getOptionIndex(options, qualifier.value)];
					if (!option) {
						options.push({
							displayValue: qualifier.displayValue,
							value: qualifier.value,
							subVariants: {},
							styleNumber : styleNumber
						});
						option = options[options.length - 1];
					}
					if (size.variantOptionQualifiers.length == 1) {
						option.code = size.code;
						option.stock = (size.stockLevelStatus.code !== 'outOfStock');
					} else {
						option.stock = (option.stock || size.stockLevelStatus.code !== 'outOfStock');
						var subVariant = size.variantOptionQualifiers[Math.abs(q - 1)];
						option.subVariants[subVariant.value] = {
							code: size.variantCode,
							value: subVariant.value,
							stock: (size.stockLevelStatus.code !== 'outOfStock')
						};
					}
				});
			});
			return variants;
		};

		var createSelection = function(qualifiers) {
			var selection = [];
			_.each(qualifiers, function(qualifier, q) {
				selection[q] = {
					displayValue: qualifier.name,
					key: qualifier.qualifier,
					value: null
				};
			});
			return selection;
		};

		var preSetSelection = function(defaultOneSizeCode) {
			_.each(model.selection, function(qualifier, q) {
				if (Sportif.Common.urlParams[qualifier.key]) setVariant(q, Sportif.Common.urlParams[qualifier.key]);
				if (!model.selection[q].value) {
					if (qualifier.key == 'shoeWidthCode'  ) {
						if( getOptionIndex( model.variants[q], 'standard') !== -1) {
							setVariant(q, 'standard');
						}
						else {
							setVariant(q, model.variants[q].sizes[0].value);
						}
					};
					if (qualifier.key == 'apparelSizeCode') setVariant(q, defaultOneSizeCode);
				}
			});
		};

		var updateUnselectedMsg = function() {
			var msg = [];
			_.each(model.selection, function(s) { if (!s.value) msg.push(s.displayValue); });
			model.unselectedMsg = msg.join(' / ');
		};

		var setVariant = function(index, value, defaultOneSizeCode) {
			var selector = model.variants[index];
			var selected = model.selection;
			var variant = selector.sizes[getOptionIndex(selector.sizes, value)];
			if(model.variants.length === 1 && !variant) {
				$scope.selectedStyleNumber = 0;
				selected[0].styleNumber = selector.sizes[0].styleNumber;
			}
			var set = function(code) {
				selected[index].value = value;
				selected[index].styleNumber = variant.styleNumber;
				$scope.selectedStyleNumber = index;
				if (code) model.code = code;
				if (value !== defaultOneSizeCode) updateParams();
				if (model.addAttempted) updateUnselectedMsg();
	            if (variant.styleNumber == undefined || variant.styleNumber == null || variant.styleNumber == '') {
	                selected[index].styleNumber = model.data.styleNumber;
	            }
			};
			if (variant && variant.stock) {
				if (selected.length == 1) {
					set(variant.code);
				} else {
					var selectedOther = selected[Math.abs(index - 1)].value;
					if (selectedOther) {
						var selectedProduct = variant.subVariants[selectedOther];
						if (selectedProduct.stock) set(selectedProduct.code);
					} else {
						set();
					}
				}
			}
		};

		var updateParams = function() {
			model.query = [];
			_.each(model.selection, function(s) { if (s.value) model.query.push(s.key + '=' + s.value); })
			model.query = (model.query.length) ? '?' + model.query.join('&') : '';
		};

		var sendGoogleAnalytics = function(category, label, qty, price) {
			globals.googleAnalytics.trackEvent('Cart', category, label, qty, true);
			globals.googleAnalytics.trackEvent('Cart', category, label, price, true);
		};

		var sendMixpanelAnalytics = function(items, add) {

			function getItemList(items) {
				return _.map(items, function(item) {
					return item.quantity + 'x' + item.product.name;
				}).join(',');
			}

			function getSport(productTypes) {
				return _.pluck(_.pluck(_.pluck(productTypes,
					'supercategories'), '0'), 'name').join(',');
			}

			var itemData = model.data,
				cart = CartService.model.contents.data,
				itemList = getItemList(cart.entries);

			// Only fire these if an item has been added.
			// itemAddAttempted event is fired twice (see comment below on handler)
			// and for reasons unknown, genderData property is undefined the second
			// time the handler is invoked. This provides us a hook to prevent the
			// analytics being called twice, though long-term a solution for the
			// repeated event should be found.
			if (add && itemData.genderData) {

				globals.mixpanel.people.set('Last item', new Date());

				globals.mixpanel.track('Add Item to Cart', {
					'Product id': itemData.code,
					'Product Name': itemData.name,
					'Category': itemData.categoryNames,
					'Gender': itemData.genderData.code,
					'Sport': getSport(itemData.productTypes),
					'Size': model.selection[0].value,
					'Item list': itemList,
					'Item count': cart.totalItems
				});
			}
		};

		// Scope: Global
		$scope.contextPath = globals.contextPath;

		// Scope: Cart
		$scope.cart = CartService.model;
		$scope.cartAddItem = CartService.addItem;

		// Scope: Quick Buy
		$scope.quickBuyData = QuickBuyService.model;
		$scope.quickBuyBroadcast = function() { $scope.$parent.$broadcast('quick_buy'); };

		// Scope: Selector
		$scope.productData = model;
		$scope.productQty = 1;
		$scope.productGetSizeData = function(code) {
			model.variants = null;
			ProductService.getProductSizeData({productCode: code}, success);
		};
		$scope.productSelectionChange = function(value) {
			if ($scope.cart.contents.messages) $scope.cart.contents.messages.itemAdd = null;
		};
		$scope.productSetVariant = setVariant;
		$scope.productAdd = function(code, qty, parent) {

			var name = model.data.name,
				price = model.data.price.value;

			model.addAttempted = true;
			updateUnselectedMsg();

			if (!$scope.addingInProgress && !model.unselectedMsg.length) {
				// Analytics
				var category = (parent === 'quickbuy') ? 'QuickBuy' : 'AddToCart';
				sendGoogleAnalytics(category, name, qty, price);

				// Cart Add - set flag to avoid user trying to add again
				$scope.addingInProgress = true;
				CartService.addItem(code, qty);
			}
		};

		// Scope: html size selector
		$scope.sizeSelectorUpdate = function(index) {
			if(this.selectedItem !== null) {
				$scope.productSetVariant(index, this.selectedItem.value);
				$scope.productSelectionChange();
				updateParams();
				$scope.$emit('selectChanged', {index: index, item: this.selectedItem});
			}
		};
		// This, despite the misleading name, is fired on success of any of the following
		// methods in CartService:- updateLine, addCoupon, removeCoupon, addItem
		// It's also fired twice on pages with two instances of this controller, such as the
		// ProductDetails page on the desktop version of the site.
		// Too close to release to deal with it now, but addressing these issues shoule be a
		// priority as they are likely to cause further issues in the longer term.
		$scope.$on('itemAddAttempted', function(e, data){
			// reset flag, so user may add again then broadcast for the cart to be opened if successful message received
			$scope.addingInProgress = false;
			$rootScope.$broadcast('openCart');

			if (data.success) {
				sendMixpanelAnalytics(data.data.entries, data.messages.itemAdd);
			}
		});
		$scope.clearProductAddData = function() {
			if (CartService.model.contents.messages) CartService.model.contents.messages.itemAdd = null;
			CartService.model.localMessages.itemAdd = false;
			_.each(model.selection, function(qualifier, q) { qualifier.value = null; });
			model.unselectedMsg = [];
			model.addAttempted = false;
		};

	}])
	.controller('ProductsData', ['$scope', 'ProductsService', 'QuickBuyService', function ($scope, ProductsService, QuickBuyService) {

		// Model
		var model = {
			contents: {},
			pageTotalRendered: 0
		};
		function success(data) {
			if (data.products.length) {
				if (!model.contents.products) model.contents.products = [];
				_.each(data.products, function(product) {
					product.url = globals.contextPath + product.url;
					model.contents.products.push(product);
				});
				model.itemsTotal = data.total;
				model.pageTotalRendered += Math.ceil(data.products.length / model.pageItems);
			}
			// if Selectivizr being used (ie8), refresh the DOM
			if(typeof Selectivizr == 'object'){
				Selectivizr.init();
			}
		}
		$scope.getProducts = function(to) {
			var pageShift = (page + 1) - model.pageTotalRendered,
				query = {};
			if (to) {
				query.from = (model.contents.products) ? model.contents.products.length : 0;
				query.to = to;
			}
			if (model.productCodes) query.productCodes = model.productCodes;
			if (model.categoryCodes) query.categoryCodes = model.categoryCodes;
			ProductsService.getProducts(query, success);
		};
		var starWidth = 12;
		var starGap = 1;

		// Scope: Products
		$scope.productsData = model;
		$scope.ratingDisplayWidth = function(rating) {
			return ((rating * starWidth) + ((rating - ( rating % 1 )) * starGap)) + 'px';
		};

		// Scope: Quick Buy
		$scope.quickBuyData = QuickBuyService.model;
		$scope.quickBuyBroadcast = function() { $scope.$parent.$broadcast('quick_buy'); };

	}]).controller('ProductListing', ['$scope', '$http', '$timeout', '$window', 'QuickBuyService', 'TransitionEndService', 'GTMService', 'MixPanelService', function ($scope, $http, $timeout, $window, QuickBuyService, TransitionEndService, GTMService, MixPanelService) {

		// Setup

		$scope.contextPath = globals.contextPath;

		$scope.init = function(listing) {
			MixPanelService.update(listing);
			$scope.listing = listing;
			criteoProductList(listing);
			setHistoryState(listing);
		};

		$scope.hasAvailableAndStandardPrice = function(product){
			// product.purchasable and product.wasPrice eq null and product.price ne null and product.openPrice ne true
			var returnValue = false;
			if(product.purchasable && product.wasPrice === null && product.price !== null && product.openPrice !== true){
				returnValue = true;
				product.useDefault = false;
			}
			return returnValue;
		};

		$scope.hasAvailableAndMarkedownPrice = function(product){
			// product.purchasable and product.wasPrice ne null and product.price ne null  and product.openPrice ne true
			var returnValue = false;
			if(product.purchasable && product.wasPrice !== null && product.price !== null && product.openPrice !== true){
				returnValue = true;
				product.useDefault = false;
			}
			return returnValue;
		};

		$scope.hasAvailableAndOpenPrice = function(product){
			// product.purchasable and product.price ne null and product.wasPrice eq null and product.openPrice eq true
			var returnValue = false;
			if(product.purchasable && product.price !== null && product.wasPrice !== null && product.openPrice !== true){
				returnValue = true;
				product.useDefault = false;
			}
			return returnValue;
		};

		$scope.hasAvailableAndMarkedownAndOpenPrice = function(product){
			// product.purchasable and product.wasPrice ne null and product.price ne null and product.openPrice eq true
			var returnValue = false;
			if(product.purchasable && product.wasPrice !== null && product.price !== null && product.openPrice === true){
				returnValue = true;
				product.useDefault = false;
			}
			return returnValue;
		};

		$scope.notAvailableAndOpenPrice = function(product){
			// not product.purchasable and product.wasPrice eq null and product.price ne null and product.openPrice eq true
			var returnValue = false;
			if(!product.purchasable && product.wasPrice === null && product.price !== null && product.openPrice === true){
				returnValue = true;
				product.useDefault = false;
			}
			return returnValue;
		};

		$scope.notAvailableAndStandardPrice = function(product){
			// not product.purchasable and product.wasPrice eq null and product.price ne null and product.openPrice ne true
			var returnValue = false;
			if(!product.purchasable && product.wasPrice === null && product.price !== null && product.openPrice !== true){
				returnValue = true;
				product.useDefault = false;
			}
			return returnValue;
		};

		// Listing

		$scope.listingView = { // For holding/sharing state (as listing gets replaced on change)
			facetShowAll : {},
			facetCollapse : {}
		};

		$scope.starWidth = 12;
		$scope.starGap = 1;

		function setHistoryState(listing) {
			if ($window.history.replaceState) {
				$window.history.replaceState({query: listing.results.query}, '', $window.location.pathname);
			}
		}


		// Listing Update

		$scope.loading = false;
		$scope.coverDelay = false;

		var newListing,
			delay,
			newURL;

		$scope.update = function(url, preventScroll, state) {
			if (!url) return;
			if ($scope.loading) { return; }
			$scope.loading = true;
			newListing = null;
			newURL = null;
			if (!state) {
				$scope.coverDelay = true;
				delay = true;
				newURL = url;
				$http.get($scope.listing.results.baseUrlAjax + url).success(function(response) {
					updateListing(response);
					if (!preventScroll) $scope.$broadcast('scrollToSearchTop');
				});
				if (!TransitionEndService) {
					updateDelay();
				}
			} else {
				delay = false;
				$http.get($scope.listing.results.baseUrlAjax + url).success(function(response) {
					updateListing(response);
				});
				$scope.loading = false;
			}
		};

		if ($window.addEventListener) {
			$window.addEventListener('popstate', function(e) {
				if (e.state && e.state.query != $scope.listing.results.query) {
					if ($scope.$$phase) {
						$scope.update(e.state.query, false, true);
					} else {
						$scope.$apply(function() {
							$scope.update(e.state.query, false, true);
						});
					}
				}
			});
		}

		function updateListing(response) {
			MixPanelService.update(response);
			newListing = response;
			updateComplete();
			criteoProductList(response);
		}

		function updateComplete() {
			if (delay || !newListing) { return; }
			$scope.coverDelay = false;
			$scope.listing = newListing;
			updateHistory(newListing);
		}

		function updateHistory() {
			if (!newURL) { return; }
			if ($window.history.pushState) {
				$window.history.pushState({query: newListing.results.query}, '', newListing.results.baseUrl + newURL);
			}
		}

		function updateKeypoints() {
			if ($scope.loading) {
				if (delay) {
					delay = false;
					updateComplete();
				} else if (newListing) {
					$scope.loading = false;
				}
			}
		}

		function updateDelay() {
			$timeout(function(){
				delay = false;
				updateComplete();
				$scope.loading = false;
			}, 500);
		}

		if (TransitionEndService) {
			$scope.$on('coverTransitionEnded', updateKeypoints);
		}


		// Quickbuy

		$scope.quickBuyData = QuickBuyService.model;
		$scope.quickBuyBroadcast = function() { $scope.$parent.$broadcast('quick_buy'); };


		// Tracking

		function criteoProductList(listing) {
			var productids = _.pluck(listing.results.items,'code');
			GTMService.updateDataLayer({'searchterms': listing.results.searchTerm});
			GTMService.updateDataLayer({'event': 'criteoProductList', 'productids': productids.join( "|" )});
		}
	}])
	.controller('SocialFeeds', ['$scope', 'SocialService', function ($scope, SocialService) {

		// Global namespace to collect tweets
		var tweets = globals.sportifSocialTweets;

		// Model
		var model = {
			contents: [],
			pageTotalRendered: 0
		};

		// Processing
		function successTwitter(data) {
			var statuses = data;
			model.contents = statuses;
			model.pageTotalRendered = model.itemsTotal = data.length;
		}

		// Scope: Social Feeds
		$scope.getSocialFeed = function(type, id) {
			// previous implementation called SocialService to get the tweets using Twitter v1.0
			// Tweets are now passed through from the page as they are loaded by the backend.
			if (type == 'twitter') {
				successTwitter(tweets);
			}
		};
		$scope.socialFeeds = model;

	}])
	.controller('MiniCart', ['$scope', 'CartService', function ($scope, CartService) {
		$scope.cart = CartService.model;
	}])
	.controller('MainCart', ['$scope', 'CartService', function ($scope, CartService) {
		// Scope: Promotions form
		$scope.isPromotionsVisible = false;
		$scope.showPromotions = function() {
			$scope.isPromotionsVisible = true;
			globals.googleAnalytics.trackEvent('Discount Code', 'Tab Opened');
		};
		$scope.cart = CartService.model;
		$scope.cartUpdateLine = CartService.updateLine;
		$scope.cartAddCoupon = CartService.addCoupon;
		$scope.cartRemoveCoupon = CartService.removeCoupon;
	}])
	.controller( 'Modal', ['$scope', function ($scope) {
		$scope.modalShown = false;

		$scope.toggleModal = function () {
			$scope.modalShown = !$scope.modalShown;
		};
	}])
	.controller('QuickShop', ['$scope', 'QuickShopService', 'CartService', function ($scope, QuickShopService, CartService) {

		$scope.quickShop = QuickShopService.model;
		$scope.cart = CartService.model;
		$scope.addingInProgress = false;
		$scope.starWidth = 12;
		$scope.starGap = 1;
		$scope.contextPath = globals.contextPath;

		var guidePageUrl = function () {
			if( $scope.quickShop.contents.sizeWrapper ) {
				var sizeGuide = ( $scope.quickShop.contents.sizeWrapper.sizes[0].qualifier == 'shoeSizeCode' ||
					$scope.quickShop.contents.sizeWrapper.sizes[0].qualifier == 'shoeSizeCodeUK' ) ? 'shoe-size-guide' : 'clothing-size-guide';

				$scope.quickShop.contents.sizeWrapper.guideUrl = globals.contextPath + '/' + sizeGuide;
			}
			else {
				$scope.quickShop.contents.widthWrapper.guideUrl = globals.contextPath + '/shoe-width-guide';
				$scope.quickShop.contents.widthWrapper.widths[0].sizeWrapper.guideUrl = globals.contextPath + '/shoe-size-guide';
			}
		};

		var widthStockCheck = function () {
			if ( $scope.selectedWidth !== undefined ) {
				delete $scope.selectedWidth;
				delete $scope.unselected;
			}
			_.each( $scope.quickShop.contents.widthWrapper.widths, function ( width , index ) {
				width.stockLevelStatus = { 'code' : 'outOfStock' };
				var i,
					length = width.sizeWrapper.sizes.length;

				for( i=0; i < width.sizeWrapper.sizes.length; i++ ) {
					if( width.sizeWrapper.sizes[i].stockLevelStatus.code != 'outOfStock' ) {
						width.stockLevelStatus.code = 'inStock';
						if( $scope.selectedWidth === undefined && width.code === 'standard' ) {
							$scope.selectedWidth = index;
						}
						break;
					}
				}
			});
			if( $scope.quickShop.contents.widthWrapper.widths.length === 1 ){
				$scope.selectedWidth = 0;
			}else {
				if( $scope.selectedWidth  === undefined) {
					$scope.unselected = 0;
				}
			}
		};

		var sendMixpanelAnalytics = function ( items, add ) {

			var getItemList = function ( items ) {
				return _.map(items, function ( item ) {
					return item.quantity + 'x' + item.product.name;
				}).join(',');
			};

			var getSport  = function ( productTypes ) {
				return _.pluck( _.pluck( _.pluck( productTypes,
					'supercategories' ), '0' ), 'name' ).join( ',' );
			};

			var getItemData = function() {
				var product;
				var variant;
				if( $scope.quickShop.contents.widthWrapper ) {
					variant = $scope.quickShop.contents.widthWrapper.widths[$scope.selectedWidth].sizeWrapper.sizes[$scope.selectedSize];
					productSize = variant.code;
				}
				else {
					variant = $scope.quickShop.contents.sizeWrapper.sizes[$scope.selectedSize];
					productSize = variant.code;
				}
				_.each( items , function ( item ) {
					if ( item.product.code === variant.productCode ){
						product = item.product;
						return;
					}
				});

				return product;
			};
			var productSize,
				itemData = getItemData(),
				cart = CartService.model.contents.data,
				itemList = getItemList( cart.entries );

			// Only fire these if an item has been added.
			// itemAddAttempted event is fired twice (see comment below on handler)
			// and for reasons unknown, genderData property is undefined the second
			// time the handler is invoked. This provides us a hook to prevent the
			// analytics being called twice, though long-term a solution for the
			// repeated event should be found.
			if ( add && itemData.genderData ) {

				globals.mixpanel.people.set( 'Last item', new Date() );

				globals.mixpanel.track( 'Add Item to Cart', {
					'Product id': itemData.code,
					'Product Name': itemData.name,
					'Category': itemData.categoryNames,
					'Gender': itemData.genderData.code,
					'Sport': getSport(itemData.productTypes),
					'Size': productSize,
					'Item list': itemList,
					'Item count': cart.totalItems
				} );
			}
		};

		var sendGoogleAnalytics = function(category, label, qty, price) {
			globals.googleAnalytics.trackEvent('Cart', category, label, qty, true);
			globals.googleAnalytics.trackEvent('Cart', category, label, price, true);
		};

		$scope.changeWidth = function ( width ) {
			if ( $scope.quickShop.contents.widthWrapper.widths[ width ].stockLevelStatus.code != 'outOfStock' ) {
				if ( $scope.selectedSize !==null ) {
					if ( $scope.quickShop.contents.widthWrapper.widths[ width ].sizeWrapper.sizes[ $scope.selectedSize ].stockLevelStatus.code != 'outOfStock' ) {
						$scope.selectedWidth = width;
						if ( $scope.unselected === 0 ) {
							delete $scope.unselected;
							delete $scope.quickShop.contents.unselectedMsg;
						}
						if( $scope.cart.contents.messages ) {
							delete $scope.cart.contents.messages;
						}
					}
				}
				else {
					$scope.selectedWidth = width;
					if ( $scope.quickShop.contents.unselectedMsg ) {
						$scope.quickShop.contents.unselectedMsg = $scope.quickShop.contents.widthWrapper.widths[ width ].sizeWrapper.typeName;
					}
					if ( $scope.unselected === 0 ) {
						delete $scope.unselected;
					}
				}
			}
		};

		$scope.changeSize = function ( size ) {
			if ( $scope.quickShop.contents.sizeWrapper ) {
				if ( $scope.quickShop.contents.sizeWrapper.sizes[ size ].stockLevelStatus.code != 'outOfStock' ) {
					$scope.selectedSize = size;
					if( $scope.quickShop.contents.unselectedMsg ) {
						delete $scope.quickShop.contents.unselectedMsg;
					}
					if( $scope.cart.contents.messages ) {
						delete $scope.cart.contents.messages;
					}
				}
			}
			else {
				if( $scope.selectedWidth !== undefined ) {
					if( $scope.quickShop.contents.widthWrapper.widths[ $scope.selectedWidth ].sizeWrapper.sizes[ size ].stockLevelStatus.code != 'outOfStock' ) {
						$scope.selectedSize = size;
						if( $scope.quickShop.contents.unselectedMsg ) {
							delete $scope.quickShop.contents.unselectedMsg;
						}
						if( $scope.cart.contents.messages ) {
							delete $scope.cart.contents.messages;
						}
					}
				}
				else {
					if( $scope.quickShop.contents.widthWrapper.widths[ 0 ].sizeWrapper.sizes[ size ].stockLevelStatus.code != 'outOfStock' ) {
						$scope.selectedSize = size;
						if( $scope.quickShop.contents.unselectedMsg ) {
							$scope.quickShop.contents.unselectedMsg = $scope.quickShop.contents.widthWrapper.typeName;
						}
						if( $scope.cart.contents.messages ) {
							delete $scope.cart.contents.messages;
						}
					}
				}
			}
		};

		$scope.productAdd = function() {
			if ( !$scope.addingInProgress ) {
				if ( $scope.quickShop.contents.sizeWrapper ) {
					if( $scope.selectedSize !== null ) {
						$scope.addingInProgress = true;
						CartService.addItem( $scope.quickShop.contents.sizeWrapper.sizes[ $scope.selectedSize ].productCode, 1);
						sendGoogleAnalytics( 'quickbuy', $scope.quickShop.contents.name, 1, $scope.quickShop.contents.price.value );
					}
					else {
						$scope.quickShop.contents.unselectedMsg = $scope.quickShop.contents.sizeWrapper.typeName;
					}
				}
				else {
					if ( $scope.selectedSize !== null && $scope.selectedWidth !== undefined ) {
						$scope.addingInProgress = true;
						CartService.addItem( $scope.quickShop.contents.widthWrapper.widths[ $scope.selectedWidth ].sizeWrapper.sizes[ $scope.selectedSize ].productCode, 1);
						sendGoogleAnalytics( 'quickbuy', $scope.quickShop.contents.name, 1, $scope.quickShop.contents.price.value );
					}
					else {
						if( $scope.selectedSize === null && $scope.selectedWidth === undefined ){
							$scope.quickShop.contents.unselectedMsg = $scope.quickShop.contents.widthWrapper.widths[ 0 ].sizeWrapper.typeName +
								' / ' + $scope.quickShop.contents.widthWrapper.typeName;

						}
						else {
							if( $scope.selectedSize === null ) {
								$scope.quickShop.contents.unselectedMsg = $scope.quickShop.contents.widthWrapper.widths[ 0 ].sizeWrapper.typeName;
							}
							else {
								$scope.quickShop.contents.unselectedMsg = $scope.quickShop.contents.widthWrapper.typeName;
							}
						}
					}
				}
			}
		};

		$scope.$watch('quickShop.contents', function ( value ) {
			if( $scope.quickShop.contents ){
				if ( $scope.quickShop.contents.widthWrapper ){
					widthStockCheck();
					$scope.selectedSize = $scope.quickShop.contents.widthWrapper.widths[0].sizeWrapper.sizes.length > 1 ? null : 0;
				}
				else {
					$scope.selectedSize = $scope.quickShop.contents.sizeWrapper.sizes.length > 1 ? null : 0;
				}
				if( $scope.cart.contents.messages ) {
					delete $scope.cart.contents.messages;
				}
				guidePageUrl();
			}
		});

		$scope.$on('itemAddAttempted', function ( event, data ){
			// reset flag, so user may add again then broadcast for the cart to be opened if successful message received
			$scope.addingInProgress = false;

			if ( data.success && $scope.quickShop.contents ) {
				sendMixpanelAnalytics( data.data.entries, data.messages.itemAdd );
			}
		});
	}])
	.controller('PostcodeAnywhereCapture', ['$scope', 'PostcodeAnywhereCaptureService',
		function($scope, PostcodeAnywhereCaptureService) {

			$scope.pacActive = false;
			$scope.results = 0;
			$scope.addresses = [];
			$scope.address = null;

			$scope.find = function (searchTerm, lastId) {
				$scope.pacActive = true;
				PostcodeAnywhereCaptureService.find(searchTerm, lastId ? lastId : null, findSuccess);
			};

			function findSuccess (response) {
				if (!response.Items.length) {
					$scope.addresses = [];
					$scope.results = 1;
					return;
				}
				else if (response.Items.length && response.Items[0].Error) {
					$scope.addresses = [];
					$scope.results = 0;
					return;
				}
				$scope.addresses = response.Items;
				$scope.results = $scope.addresses.length;
				$scope.activeIndex = -1;
			}

			$scope.retrieve = function (id) {
				PostcodeAnywhereCaptureService.retrieve(id, retrieveSuccess);
			};

			function retrieveSuccess (response) {
				$scope.address = response.Items[0];

				if (Sportif.PostcodeAnywhere.postcodeFilter) {
					var regex;
					for(var i=0; i<Sportif.PostcodeAnywhere.postcodeFilter.length; i++) {
						regex = new RegExp('^' + Sportif.PostcodeAnywhere.postcodeFilter[i]);
						if (regex.test($scope.address.PostalCode)) {
							$scope.address.noShippingArea = true;
							break;
						}
					};
				}
				$scope.updateAddressForm();
				$scope.resetFind();
				$scope.pacActive = false;
				$scope.results = 0;
			}

			$scope.select = function (address) {
				if (address.Next === 'Find') {
					$scope.find(address.Text, address.Id);
				}
				else {
					$scope.retrieve(address.Id);
				}
			};
		}
	]);
