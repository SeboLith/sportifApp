'use strict';

/* Controllers */
angular.module('controllers')
.controller('App', function App($scope){
	$scope.sites = function(sites){
		$scope.sites = sites;
	}
}).controller('ProductSelector', function ProductSelector($rootScope, $scope, $http, $window, ProductService, QuickBuyService, CartService) {

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

}).controller('ProductsData', function ProductsData($scope, ProductsService, QuickBuyService) {

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

}).controller('ProductListing', function ProductListing($scope, $http, $timeout, $window, QuickBuyService, TransitionEndService, GTMService, MixPanelService) {

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


}).controller('SocialFeeds', function SocialFeeds($scope, SocialService) {

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

}).controller('MiniCart', function MiniCart($scope, CartService) {
	$scope.cart = CartService.model;
}).controller('MainCart', function MainCart($scope, CartService) {
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
}).controller( 'Modal', function ( $scope ) {
	$scope.modalShown = false;

	$scope.toggleModal = function () {
		$scope.modalShown = !$scope.modalShown;
	};
}).controller('QuickShop', function ( $scope, QuickShopService, CartService ) {

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
}).controller('PostcodeAnywhereCapture', ['$scope', 'PostcodeAnywhereCaptureService',
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
