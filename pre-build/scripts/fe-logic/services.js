'use strict';
/* globals app, Sportif, $, globals */

/* Services */

angular.module('services')
    .factory('TransitionEndService', ['$window', function($window) {
        var transitionEnd = null
        var transitions = {
                'transition': 'transitionend',
                'WebkitTransition': 'webkitTransitionEnd',
                'MozTransition': 'transitionend',
                'OTransition': 'otransitionend'
            },
            elem = document.createElement('div');
        for (var t in transitions) {
            if (elem.style[t] !== undefined) {
                transitionEnd = transitions[t];
                break;
            }
        }
        return transitionEnd;
    }])
    .factory('ProductService', ['$resource', function($resource) {
        var service = $resource(globals.contextPath + '/json/product/:action.json', {}, {
            getProductSizeData: { method: 'GET',  params: { action: 'getProductData' } }
        });
        return {
            getProductSizeData: service.getProductSizeData
        }
    }])
    .factory('ProductsService', ['$resource', function($resource) {
        var service = $resource(globals.contextPath + '/json/searchProductData/products.json', {}, {
            getProducts: { method: 'GET' }
        });
        return {
            getProducts: service.getProducts
        }
    }])
    .factory('SocialService', ['$resource', function($resource) {
        var service = {
            twitter : $resource('https://api.twitter.com/1/statuses/user_timeline.json',
                { callback: 'JSON_CALLBACK', count: '5', include_rts: '1'},
                { getStatuses: { method: 'JSONP', isArray: true } }
            )
        };
        return {
            getTwitter: service.twitter.getStatuses
        };
    }])
    .factory('ProductListService', ['$rootScope', '$http', function($rootScope, $http) {

        // We're trying to build a lovely wee string which looks something like the following:
        // f:((cat,Footwear,b),(pro,Over Pronate,u),(experience,Intermediate,u),(gender,Male,u))
        function parseFilters(filters) {

            // TODO: having this hardcoded here may be an enemy to reuse
            var arr = ['(cat,(Footwear),b)'];

            _.each(filters, function(val, key) {
                if (val) {
                    if (_.isArray(val)) {
                        arr = arr.concat(parseArray(val, key));
                    } else {
                        arr.push(parseObject(val, key));
                    }
                }
            });

            return 'f:(' + arr.join() + ')';
        }

        function parseArray(arr, key) {
            if (!arr.length) { return []; }
            var value = _.map(arr, function(val) { return val.value; }).join();
            return '(' + key + ',(' + value + '),u)';
        }

        function parseObject(val, key) {
            return '(' + key + ',(' + val.value + '),u)';
        }

        function parseSort(sort) {
            return '0-' + sort.limit + '-' + sort.by;
        }

        return {

            getProducts: function(filters, sort) {
                // Let subscribers know we're loading some data
                $rootScope.$broadcast('productList.loading');

                $http({
                    method: 'GET',
                    url: globals.contextPath + '/json/searchProductData/shoes.json',
                    params: { q: parseFilters(filters), c: parseSort(sort) }
                })
                    .then(function(result) {
                        // Broadcast returned product data to subscribers
                        $rootScope.$broadcast('productList.loaded', result.data);
                    });
            }
        };

    }])
    .factory( 'QuickShopService', ['$http', function ($http) {
        var model = {
            contents: null
        };
        return {
            model: model,

            getProductData: function ( code, callback ) {
                var promise = $http.get( globals.contextPath + '/json/product/getLightweightProductData.json?productCode=' + code ).success( function ( data ) {
                    if( data.primaryImage ) {
                        data.primaryImage.url = data.primaryImage.url.indexOf('?') === -1 ? data.primaryImage.url +'?time='+ ( new Date().getTime() ) :
                            data.primaryImage.url +'&time='+ ( new Date().getTime() );
                    }
                    model.contents = data;
                    // callback();
                }).error( function ( err ) {
                    if(window.console)
                        window.console.log(err);
                });

                return promise;
            }
        };
    }])
    .factory('QuickShopPanelService', ['QuickShopService', '$rootScope', function(QuickShopService, $rootScope){
        var panel = {
            left: 0,
            top: 0,
            width: 0,

            setLeft: function(value){
                panel.left = value;
            },

            setTop: function(value){
                panel.top = value;
            },

            setWidth: function(value){
                panel.width = value;
            },

            getProductData: function(productCode){
                $rootScope.$broadcast('quickShopLoading');
                return QuickShopService.getProductData( productCode );
            }

        };

        return {
            panel: panel
        };
    }])
    .factory('QuickBuyService', function() {
        var model = {};
        return {
            model: model
        };
    })
    .factory( 'GTMService', function () {
        return {
            // notify gtm with a event to update variable value
            updateDataLayer: function ( data ) {

                if ( typeof dataLayer !== 'undefined' ) {
                    dataLayer.push( data );
                }

            }

        };
    })
    .factory('CartService', ['$rootScope', '$resource', '$window', 'GTMService', function($rootScope, $resource, $window, GTMService) {
        var service = $resource(globals.contextPath + '/json/cart/:action.json', {_: new Date().getTime()}, {
            getCurrent:   { method: 'GET',  params: { action: 'getCurrent' } },
            updateLine:   { method: 'POST', params: { action: 'updateLine' } },
            addCoupon:    { method: 'POST', params: { action: 'addCoupon' } },
            removeCoupon: { method: 'POST', params: { action: 'removeCoupon' } },
            addItem:      { method: 'POST', params: { action: 'addItem' } }
        });

        var model = {
            contents: service.getCurrent(),
            inputs: { coupon: '' },
            localMessages: { itemAdd: false }
        };

        // Delay for DOM update
        var updateCartHeight = function(product) {
            // sportif.js
            Sportif.Nav.updateCartHeight();
        };


        // Creates basket JSON's for criteo

        var criteoBasket = function () {

            var productids = [],
                prices = [],
                quantities = [];

            _.each( model.contents.data.entries, function ( item ) {
                productids.push( item.product.code );
                prices.push( item.basePrice.value );
                quantities.push( item.quantity );
            });

            GTMService.updateDataLayer( { 'quantities': quantities.join( "|" ) } );
            GTMService.updateDataLayer( { 'prices': prices.join( "|" ) } );
            GTMService.updateDataLayer( { 'event': 'criteoBasket', 'productids': productids.join( "|" ) } );

        };

        var success = function(data) {

            var messages = data.messages;

            model.contents = data;
            model.localMessages.itemAdd = false;
            model.localMessages.loading = false;
            model.inputs.coupon = '';
            updateCartHeight();

            // broadcast to controller that item has been added and pass received data
            $rootScope.$broadcast('itemAddAttempted', data);

            GTMService.updateDataLayer( { 'event': 'basketUpdated', 'cartTotal': model.contents.data.subTotal.value + model.contents.data.totalTax.value } );
            criteoBasket();

            if (messages.coupons) {

                var success = messages.coupons.type !== 'error';

                // Track attempted submission of promo code
                globals.googleAnalytics.trackEvent(
                    'Discount Code',
                    'Code Submitted',
                    success.toString()
                );

                if (success) {
                    // For mixpanel, we're only interested in accepted codes
                    globals.mixpanel.people.set({ 'Affiliate-Promocode': model.coupon });
                    globals.mixpanel.register({ 'Affiliate-Promocode': model.coupon });
                }
            }
        };

        var sendAddAnalytics = function(label, qty, price) {
            globals.googleAnalytics.trackEvent('Carts', 'AddToCart', label, qty, true);
            globals.googleAnalytics.trackEvent('Cart', 'AddToCart', label, price, true);
        };

        var sendRemoveAnalytics = function(label, qty, price) {
            globals.googleAnalytics.trackEvent('RemoveFromCarts', 'Number of Items', label, qty, true);
            globals.googleAnalytics.trackEvent('RemoveFromCart', 'Unit Price', label, price, true);
        };

        return {
            model: model,
            updateLine: function(line, newQty, curQty, index) {
                // Analytics
                if(newQty !== undefined && newQty !== curQty){
                    var product = model.contents.data.entries[index].product.name;
                    var basePrice = model.contents.data.entries[index].basePrice.value;
                    if(newQty > curQty) {
                        sendAddAnalytics(product, newQty - curQty, basePrice);
                    } else {
                        sendRemoveAnalytics(product, curQty - newQty, basePrice);
                    }
                    service.updateLine({cartEntryNumber: line, quantity: newQty}, success);
                }
            },

            addCoupon: function(coupon) {

                if ($.trim(coupon).length) {
                    model.coupon = coupon;
                    service.addCoupon({couponCode: coupon}, success);
                }
            },

            removeCoupon: function(coupon) {
                service.removeCoupon({couponCode: coupon}, success);
            },

            addItem: function(code, qty) {
                if (code) {
                    model.localMessages.loading = true;
                    qty = (qty) ? qty : 1;
                    service.addItem({productCode: code, quantity: qty}, success);
                } else {
                    model.localMessages.itemAdd = true;
                }
            }
        };

    }])
    .factory('PostcodeAnywhereCaptureService', ['$http', function ($http) {

        var service = {

            find: function (searchTerm, lastId, success, error) {
                lastId = lastId != null ? lastId : '';

                var url = Sportif.PostcodeAnywhere.findUrl
                            .concat('?Key=' + Sportif.PostcodeAnywhere.apiKey)
                            .concat('&SearchTerm=' + searchTerm)
                            .concat('&LastId=' + lastId)
                            .concat('&Country=' + Sportif.PostcodeAnywhere.country)
                            .concat('&LanguagePreference=' + Sportif.PostcodeAnywhere.language)
                            .concat('&$Top=500'); // limit response to 500 results, to prevent UI binding performance issues

                $http.jsonp(url + "&callback=JSON_CALLBACK")
                    .success(function (response) {
                        if (success) success(response);
                    })
                    .error(function (response, errorCode, thrown) {
                        if (error) error(response);
                    });
            },

            retrieve: function(id, success, callback) {
                var url = Sportif.PostcodeAnywhere.retrieveUrl
                            .concat('?Key=' + Sportif.PostcodeAnywhere.apiKey)
                            .concat('&Id=' + id);

                $http.jsonp(url + "&callback=JSON_CALLBACK")
                    .success(function (response) {
                        if (success) success(response);
                    })
                    .error(function (response, errorCode, thrown) {
                        if (error) error(response);
                    });
            }
        }
        return service;
    }])
    .factory('MixPanelService', ['$window', function($window){
        return {
            update: function(data){
                if($window.mixpanel){
                    var eventData = {};
                    var facets = [];

                    var primary = _.where(data.results.facets.primary, {active: true});
                    var secondary = _.where(data.results.facets.secondary, {active: true});

                    var primaryValues = _.map(_.where(primary, { active: true }), function(obj) {
                        return obj.values;
                    });

                    var secondaryValues = _.map(_.where(secondary, { active: true }), function(obj) {
                        return obj.values;
                    });

                    var values = primaryValues.concat(secondaryValues);

                    facets = _.map(_.where(_.flatten(values), { active: true }), function(obj) {
                        return obj.label;
                    });

                    if(facets.length > 0){
                        eventData['facetdisplay'] = facets.toString();
                    }

                    globals.mixpanel.track('Product Grid', eventData);
                }
            }
        };
    }]);

