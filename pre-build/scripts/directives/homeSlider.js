'use strict';
/*globals angular, _ */

angular.module('directives')
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
    .directive('sfLoader', ['$timeout', '$window', function($timeout, $window) {
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
    }])
    .directive('ajax', function() { // [data-ajax]
        return {
            link: function(scope, element, attrs) {
                element.on('click', function(e) {
                    e.preventDefault();
                });
            }
        };
    })
    .directive('ajaxLoadCover', ['TransitionEndService', function(TransitionEndService) { // [data-ajax-load-cover]
        return {
            link: function(scope, element, attrs) {
                if (TransitionEndService) {
                    element.on(TransitionEndService, function() {
                        if (!scope.$$phase){
                            scope.$apply(function() {
                                scope.$emit('coverTransitionEnded');
                            });
                        }
                    });
                } else {
                    element.css({opacity: 0.8}); // IE
                }
            }
        };
    }])
    .directive('facetOptions', ['$compile', function($compile) { // [data-facet-options]
        var count = '<span class="facet_count" ng-show="(!value.disconnected || facet.current || value.active) && facet.displayCount && value.count > 0">({{value.count}})</span>',
            text = '{{value.label}} ' + count,
            label = '<label for="facet_{{facet.name + \'_\' + $index}}">' + text + '</label>',
            part = {
                header: '<div class="facet_header"><h3 ng-class="{first: $first && primary}">{{facet.label}}</h3>',
                headerToggle: '<div class="facet_header" ng-class="{active: listingView.facetCollapse[facet.name]}" ng-click="listingView.facetCollapse[facet.name] = !listingView.facetCollapse[facet.name]"><h3 ng-class="{first: $first && primary}">{{facet.label}}</h3>',
                clearFacet: '<a href class="clear_facet facet_reset" ng-show="facet.clear.url" ng-click="update(facet.clear.url)">{{facet.clear.label}}</a>',
                listStart: '</div><ol>',
                listStartToggle: '</div><ol ng-show="listingView.facetCollapse[facet.name]">',
                listEnd: '</ol>',
                toggleAll: '<a class="facet_limit_toggle" href ng-show="facet.values.length > listing.results.facets.limit" ng-click="listingView.facetShowAll[facet.name] = !listingView.facetShowAll[facet.name]">{{listingView.facetShowAll[facet.name] && \"' + $("#showLess").text() + '\" || \"' + $("#showAll").text() + '\"}}</a>',
                // replaced with above because of IE issue
                // toggleAll: '<a class="facet_limit_toggle" href ng-show="facet.values.length > listing.results.facets.limit" ng-click="listingView.facetShowAll[facet.name] = !listingView.facetShowAll[facet.name]" data-facet-toggle-all />',
                checkbox: '<li class="checkbox_holder" ng-repeat="value in facet.values | limitToIf:listing.results.facets.limit:!listingView.facetShowAll[facet.name]" ng-class="{disconnected: value.disconnected && !facet.current && !value.active}">'
                        + '<input id="facet_{{facet.name + \'_\' + $index}}" type="checkbox" ng-checked="value.active" value="{{$index}}" data-change="update(value.url)" ng-disabled="loading || (value.disconnected && !facet.current && !value.active)" />'
                        + label
                    + '</li>',
                radio: '<li class="radio_button" ng-repeat="value in facet.values | limitToIf:listing.results.facets.limit:!listingView.facetShowAll[facet.name]" ng-class="{disconnected: value.disconnected && !facet.current && !value.active}">'
                    + '<input id="facet_{{facet.name + \'_\' + $index}}" name="{{facet.name}}" type="radio" ng-checked="value.active" value="{{$index}}" data-change="update(value.url)" ng-disabled="loading || (value.disconnected && !facet.current && !value.active)" />'
                    + label
                + '</li>',
                select: '<li class="select" ng-class="{disconnected: value.disconnected && !facet.current && !value.active}">'
                        + '<div class="select_wrap">'
                            + '<div class="select_ui"><span class="label" ng-init="selected = (facet.values | filter:{active:true})">{{facet.active && selected[0].label || facet.placeholder}} {{facet.active && \'(\' + selected[0].count + \')\' || \'\'}}</span><span class="icon"></span></div>'
                            + '<select id="facet_{{facet.name}}" data-select data-change-listing ng-disabled="loading || value.disconnected && !facet.current && !value.active">'
                                + '<option value="" ng-selected="!facet.active" disabled="disabled">{{facet.placeholder}}</option>'
                                + '<option value="{{value.url}}" ng-repeat="value in facet.values" ng-selected="value.active" ng-disabled="value.disconnected && !facet.current && !value.active">{{value.label}} {{(!value.disconnected || facet.current || value.active) && facet.displayCount && value.count > 0 && (\'(\' + value.count + \')\') || \'\'}}</option>'
                            + '</select>'
                        + '</div>'
                    + '</li>',
                multiselect: '<li class="select" ng-class="{disconnected: value.disconnected && !facet.current && !value.active}">'
                        + '<div class="select_wrap ng-cloak">'
                            + '<div class="select_ui"><span class="label" ng-show="!facet.active">{{facet.placeholder}}</span><span class="label" ng-show="facet.active">{{facet.placeholderAdd}}</span><span class="icon"></span></div>'
                            + '<select class="multi" id="facet_{{facet.name}}" data-select data-change-listing ng-disabled="loading || value.disconnected && !facet.current && !value.active">'
                                + '<option value="" disabled="disabled" selected>{{facet.placeholder}}</option>'
                                + '<option value="{{value.url}}" ng-repeat="value in facet.values" ng-disabled="value.disconnected && !facet.current && !value.active">{{value.label}} {{(!value.disconnected || facet.current || value.active) && facet.displayCount && value.count > 0 && (\'(\' + value.count + \')\') || \'\'}}</option>'
                            + '</select>'
                        + '</div>'
                    + '</li>'
                    + '<li ng-show="facet.active">'
                        + '<ul class="multiselect">'
                            +'<li ng-repeat="value in facet.values | filter:{active:true}" >'
                                + '<a href ng-click="update(value.url)" class="facet_reset">'
                                    +'<span class="type">{{facet.label}} </span>'
                                    + label
                                +'</a>'
                            +'</li>'
                        + '</ul>'
                    + '</li>',
                colour: '<li class="colour_holder" ng-repeat="value in facet.values | limitToIf:listing.results.facets.limit:!listingView.facetShowAll[facet.name]" ng-class="{disconnected: value.disconnected && !facet.current && !value.active}" ng-class-odd="\'odd\'">'
                        + '<a class="colour_value {{value.styleClass}}" ng-class="{active: value.active}" href ng-hide="value.disconnected && !facet.current && !value.active" ng-click="update(value.url)">' + text + '</a>'
                        + '<span class="colour_value disconnected {{value.styleClass}}" ng-show="value.disconnected && !facet.current && !value.active">' + text + '</span>'
                    + '</li>'
            },
            template,
            facet,
            selected;
        return {
            scope: true,
            compile: function(element, attrs) {
                return function(scope, element, attrs) {
                    facet = scope.facet;
                    template = scope.toggleFacet ? part.headerToggle : part.header;
                    if (facet.clear.url) {
                        template += part.clearFacet;
                    }
                    template += scope.toggleFacet ? part.listStartToggle : part.listStart;
                    template += part[facet.type];
                    template += (facet.type == 'checkbox' || facet.type == 'radio') ? part.toggleAll : '';
                    template += part.listEnd;
                    element.html(template);
                    $compile(element.contents())(scope);
                };
            }
        };
    }])
    .directive('facetReset', ['$templateCache', function($templateCache) { // [data-facet-reset]
        return {
            templateUrl: "listing-facet-reset-html"
        };
    }])
    .directive('facetToggleAll', ['$templateCache', function($templateCache) { // [data-facet-toggle-all]
        return {
            templateUrl: "listing-facet-toggle-html"
        };
    }])
    .directive('changeRedirect', function() { // [data-change-redirect]
        return {
            link: function(scope, element, attrs) {
                element.bind('change', function(e) {
                    window.location.href = element.val();
                });
            }
        };
    })
    .directive('change', function() { // [data-change] like ng-change without need for ng-model
        return {
            link: function(scope, element, attrs) {
                element.bind('change', function() {
                    if( !scope.$$phase ) {
                        scope.$apply( function() {
                            scope.$eval(attrs.change);
                        });
                    }
                });
            }
        };
    })
    .directive('changeListing', function() { // [data-change-listing]
        return {
            link: function(scope, element, attrs) {

                element.bind('change', function() {
                    if (!scope.$$phase) {
                        scope.$apply(function() {
                            scope.update(element.val(), (attrs.model && attrs.model == 'show')); // Prevent scrollToSearchTop event if page size change
                        });
                    }
                });

            }
        };
    })
    .directive('viewControls', ['$templateCache', function($templateCache) { // [data-view-controls]
        return {
            templateUrl: 'listing-view-controls-html'
        };
    }])
    .directive('listingProducts', ['$templateCache', function($templateCache) { // [data-listing-products]
        return {
            templateUrl: 'listing-product-html',
            link: function (scope, element) {

                var listing = $('.product_listing_holder');
                scope.$on('scrollToSearchTop', function() {
                    if ($(document).scrollTop() > listing.offset().top) { // If scrolled further down
                        setTimeout(function() { // Not required, but good to spread the load
                            $('html, body').animate({scrollTop: listing.offset().top}, 1000);
                        }, 50);
                    }
                });

            }
        };
    }])
    .directive('select', ['$timeout', function($timeout) { // [data-select]
        return {
            link: function(scope, element, attrs) {

                element.css('opacity', 0);

            }
        };
    }])
    .directive('selectUpdate', ['$timeout', function($timeout) { // [data-select-update]
        return {
            link: function(scope, element, attrs) {

                // Note: Can be used for prefilled selects but has downsides when combined with Angular expressions
                element.on('change', function() {
                    element.siblings('.select_ui').find('span.label').text(element.find('option:selected').text());
                });

            }
        };
    }])
    .directive('quickShopLoad', function() { // [data-quick-shop-load]
        // bespoke directive to workaround IE8 bug - ACE-569
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                element.on('load', function(){
                    scope.$emit('quickShopImageLoaded');
                });
            }
        };
    })
    .directive('quickShopPanel', ['$document', '$q', '$rootScope', '$timeout', 'QuickShopPanelService', function($document, $q, $rootScope, $timeout, QuickShopPanelService) { // [data-quick-shop-panel]
        return {
            restrict: 'A',
            link: function(scope, element, attr) {

                var quickShopInner = element.find('.inner'),
                    quickShopOverlay = $('.quick_shop_overlay'),
                    viewCart = element.find('.panel_link'),
                    closeButton = element.find('.modal_close'),
                    imageLoadDeffered = $q.defer(),
                positionPanel = function(){
                    element.css({'top': QuickShopPanelService.panel.top, 'left': QuickShopPanelService.panel.left});
                    element.height( quickShopInner.outerHeight() );
                    openPanel();
                },
                closePanel = function(){
                    scope.$emit('panelClosing');
                    element.height( 0 );
                    quickShopOverlay.removeClass( 'animate' );
                    element.removeClass( 'animate' );
                },
                openPanel = function(){
                    element.addClass( 'animate' );
                    scope.$emit('panelOpening', {panelHeight: quickShopInner.outerHeight()});

                    if ( quickShopInner.outerHeight()  >  window.innerHeight  ) {
                        $('html, body').animate( { scrollTop: element.offset().top }, 400 );
                    }
                    else {
                        var scrollTo = element.offset().top - ( (window.innerHeight || document.documentElement.clientHeight) - quickShopInner.outerHeight() ) / 2;
                        $('html, body').animate( { scrollTop: scrollTo }, 400 );
                    }
                }

                var listener = $rootScope.$on('quickShopImageLoaded', function(){
                    imageLoadDeffered.resolve();
                    listener();
                });


                closeButton.on('click', function () {
                    closePanel();
                });

                scope.$on('quickShopLoading', function(){
                    quickShopOverlay.addClass('animate');
                });

                scope.$on('quickShopDataLoaded', function(event, promise){
                    $timeout( function () {
                        var heroImageSrc = quickShopInner.find('.hero_image').attr('src');
                        if(heroImageSrc === "" || heroImageSrc === undefined){
                            imageLoadDeffered.resolve();
                        }
                    },500);

                    $q.all([promise, imageLoadDeffered.promise]).then(function(){
                        $timeout(function(){
                            positionPanel();
                        });
                    });
                });

                viewCart.on( 'click', function ( event ) {
                    event.stopImmediatePropagation();
                    closePanel();
                    Sportif.Nav.animateScrollTop( event );
                });

                quickShopOverlay.on( 'click', function ( event ) {
                    closePanel();
                });

                $document.keyup( function ( event ) {
                    if ( event.keyCode == 27 ) {
                        closePanel();
                    }
                });
            }
        };
    }])
    .directive( 'quickShop', [ 'QuickShopService','$timeout', '$rootScope', 'QuickShopPanelService', function ( QuickShopService, $timeout, $rootScope, QuickShopPanelService ) { // [data-quick-shop]
        return {
            restrict: 'A',
            link: function ( scope, element, attrs ) {

                var product = element.closest('article.product'),

                    positionPanel = function () {
                        var previous = product.prev(),
                            next = product.next(),
                            top = product.offset().top + product.height() + +product.css('margin-bottom').split('px')[0],
                            left = product.offset().left,
                            nextLeft = product.offset().left;

                        while(  previous.length > 0 ) {
                            if( left > previous.offset().left ) {
                                left = previous.offset().left;
                                if( previous.offset().top + previous.height() + +previous.css('margin-bottom').split('px')[0] > top ){
                                    top = previous.offset().top + previous.height() + +previous.css('margin-bottom').split('px')[0];
                                }
                                previous = previous.prev();
                            }
                            else {
                                break;
                            }
                        }
                        while(  next.length > 0 ) {
                            if( nextLeft < next.offset().left ) {
                                if( next.offset().top + next.height() + +next.css('margin-bottom').split('px')[0] > top ){
                                    top = next.offset().top + next.height() + +next.css('margin-bottom').split('px')[0];
                                }
                                next = next.next();
                            }
                            else {
                                break;
                            }
                        }
                        QuickShopPanelService.panel.setLeft(left);
                        QuickShopPanelService.panel.setTop(top);
                        QuickShopPanelService.panel.setWidth(3 * product.width());
                    },

                    close = function () {
                        product.removeAttr( 'style' );
                    },

                    respondToPanel = function () {
                        var panelOpening = $rootScope.$on('panelOpening', function(event, data){
                            open(data.panelHeight);
                            panelOpening();
                        });

                        var panelClosing = $rootScope.$on('panelClosing', function(event, data){
                            close();
                            panelClosing();
                        });

                        function open(panelHeight){
                            product.css( 'margin-bottom', panelHeight + +product.css('margin-bottom').split('px')[0]*2 );
                            product.addClass( 'animate' );
                        }

                        function close(){
                            product.removeAttr( 'style' );
                        }
                    };

                element.on( 'click', function ( event ) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    positionPanel();
                    respondToPanel();
                    var promise = QuickShopPanelService.panel.getProductData( attrs.productCode ).success(
                        function(){
                            $rootScope.$broadcast('quickShopDataLoaded', promise);
                        }
                    );
                });
            }
        };
    }])
    .directive('quickBuy', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                var quickBuyButton = element;
                var product = quickBuyButton.closest('article.product');

                quickBuyButton.bind('click', function(e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    scope.quickBuyData.productItem = product;
                    scope.quickBuyData.productCode = attrs.productCode;
                    scope.quickBuyBroadcast();
                });

            }
        };
    })
    .directive('quickBuyPanel', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                var quickBuyPanel = element;
                var overlay_fill = $('<div id="overlay_fill" />').appendTo('#page').hide();
                var width = quickBuyPanel.width();
                var productItem,
                    productItemInner,
                    productItemOffset,
                    productItemHeightAdjust;

                scope.$on('quick_buy', function() {
                    overlay_fill.show().fadeOut(0).fadeTo(300, 0.8);
                    scope.clearProductAddData();
                    scope.productGetSizeData(scope.quickBuyData.productCode);
                });

                scope.$on('updated_size_selector', function() {
                    productItem = scope.quickBuyData.productItem;
                    productItemOffset = productItem.offset();
                    productItemInner = productItem.children('div.inner');
                    if (!productItemInner.length) productItemInner = productItem.wrapInner('<div class="inner" />').children();
                    productItemHeightAdjust = quickBuyPanel.height() - productItemInner.height();
                    if (productItemHeightAdjust > 0) {
                        productItemInner.stop().animate({'margin-bottom': productItemHeightAdjust + 'px'}, 300, function(){ slideIn(); });
                    } else {
                        slideIn();
                    }
                });

                var slideIn = function() {
                    // if Selectivizr being used (ie8), refresh the DOM
                    if(typeof Selectivizr == 'object'){
                        Selectivizr.init();
                    }
                    productItemInner.stop().animate({
                        'margin-left': - width + 'px'
                    }, 300);
                    quickBuyPanel.css({
                        'left': productItemOffset.left + 'px',
                        'top': productItemOffset.top + 'px'
                    }).show().children().css({'margin-left': width + 'px'}).stop().animate({'margin-left':'0'}, 300);


                };

                quickBuyPanel.find('a.close, a.panel_link_open').on('click', function(e) {
                    e.preventDefault();
                    overlay_fill.fadeOut(300, function(){ overlay_fill.hide(); quickBuyPanel.hide(); });
                    productItemInner.stop().animate({'margin-bottom': 0 + 'px','margin-left': 0 + 'px'}, 300);
                    quickBuyPanel.children().stop().animate({'margin-left': width + 'px'}, 300);
                    if (e.currentTarget.id == 'cart_panel_id') {
                        // sportif.js
                        Sportif.Nav.animateScrollTop(e);
                    }
                });

            }
        };
    })
    .directive('autoOpenCart', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                $(element).on('click', function(event) {
                    // sportif.js
                    Sportif.Nav.animateScrollTop();
                });
            }
        };
    })
    .directive('autoplay', ['$injector', function($injector) {
        return {
            restrict: 'A',
            scope: true,
            link: function(scope, element, attrs) {

                function loop() {
                    globals.timer = setTimeout(function(){
                        var rScope = $injector.get('$rootScope');
                        rScope.$broadcast('autoplay');
                        loop();
                    }, globals.autoplayInterval);
                }
                if (!globals.timer) loop();
            }
        };
    }])
    .directive('ngRepeated', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                if (scope.$last) {
                    var msg = 'updated';
                    if (attrs.ngRepeated.length) msg += '_' + attrs.ngRepeated;
                    if (attrs.ngRepeated == 'size_selector')
                        if (element.closest('div.size_selector').next('div.size_selector').length)
                            msg = 'updated';
                    scope.$emit(msg);
                }

            }
        };
    })
    .directive('carousel', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                var data,
                    carousel  = element,
                    container = carousel.hasClass('.item') ? carousel : carousel.closest('div.item'),
                    dynamic   = carousel.hasClass('dynamic'),
                    viewport  = carousel.children('div.viewport'),
                    slides    = viewport.children('div.slides'),
                    controls,
                    transition  = 400,
                    pageWidth   = attrs.carouselPageWidth || viewport.width(),
                    pageCurrent = 0,
                    pageTarget,
                    pageTotal,
                    timer;

                //Verify pageWidth is divisble by 10, otherwise add 1 pixel to pageWidth as it was rounded down by browser
                //during page zoom out. This is based on hardcoded css widths which are all multiples of 10.
                //(See: http://tylertate.com/blog/2012/01/05/subpixel-rounding.html for details on problem.)
                if (pageWidth % 10 != 0) {
                    pageWidth += 1;
                }
                if (dynamic) {
                    if (attrs.feedUsername) {
                        // Social (Full)
                        data = scope.socialFeeds;
                        data.pageItems = parseInt(attrs.carouselPageItems) || 1;
                        scope.$on('updated', function(event) {
                            init();
                            Sportif.Common.heightMatch('div.editorial_social div.social div.viewport');
                            Sportif.Common.widthMatch('div.actions.join');
                        });
                    } else {
                        // Product (Multi)
                        data = scope.productsData;
                        if (attrs.productCodes) data.productCodes = $.trim(attrs.productCodes.replace(/\[|\]|\ /g, ''));
                        else if (attrs.categoryCodes) data.categoryCodes = $.trim(attrs.categoryCodes.replace(/\[|\]|\ /g, ''));
                        data.pageItems = parseInt(attrs.carouselPageItems) || 1;
                        scope.getProducts(data.pageItems - 1);
                        scope.$on('updated', function(event) {
                            if (globals.ieLt9 && data.pageItems > 1) slides.children(':nth-child(3n+1)').addClass('first_of_page');
                            if (data.pageTotalRendered == 1) init();
                            else changePage();
                            Sportif.Common.widthMatch('div.actions.join');
                        });
                    }
                } else {
                    data = {
                        itemsTotal: slides.children().length,
                        pageItems: parseInt(attrs.carouselPageItems) || 1
                    }
                    if (globals.ieLt9 && data.pageItems > 1) slides.children(':nth-child(3n+1)').addClass('first_of_page');
                    init();
                }

                function init() {
                    if (data.itemsTotal > 1) {
                        carousel.addClass('active');
                        pageTotal = Math.ceil(data.itemsTotal / data.pageItems);
              slides.css({ 'width': pageTotal * pageWidth });
                    }
                    if (data.itemsTotal > data.pageItems) {
                        interaction();
                        autoplay();
                    }
                }

                function interaction() {
                    if (dynamic) {
                        var li = ''; for (var i = 0; i < pageTotal; i++) li += '<li><span>' + (i + 1) + '</span></li>';
                        $('<ol class="controls">' + li + '</ol>').appendTo(carousel);
                    }
                    controls = carousel.children('ol.controls').children();
                    controls.each(function(i, e) {
                        var control = $(this).on('click', function() {
                            if (!carousel.hasClass('paused')) {
                                pageTarget = i;
                                if (dynamic && i > data.pageTotalRendered - 1) {
                                    scope.getProducts(i * data.pageItems + data.pageItems -1);
                                    carousel.addClass('paused');
                                } else {
                                    changePage();
                                }
                            }
                        });
                    }).first().addClass('active');
                }

                function autoplay() {
                    carousel.on('mouseenter', function() {
                        if (timer) clearTimeout(timer);
                        container.addClass('hover');
                    }).on('mouseleave', function() {
                        if (timer) clearTimeout(timer);
                        timer = setTimeout(function(){ container.removeClass('hover'); }, 1000);
                    })
                    if (attrs.autoplay !== undefined && attrs.autoplay !== false) {
                        scope.$on('autoplay', function() {
                            if (!container.hasClass('hover')) {
                                pageTarget = pageCurrent + 1;
                                if (pageTarget > pageTotal - 1) pageTarget = 0;
                                changePage();
                            }
                        });
                    }
                }

                function changePage() {
                    carousel.removeClass('paused');
                    if (pageCurrent !== pageTarget) {
                        slides.stop().animate({'left': - (pageWidth * pageTarget)}, transition);
                        controls.eq(pageTarget).addClass('active').siblings().removeClass('active');
                        pageCurrent = pageTarget;
                    }
                }

            }

        };
    })
    .directive('accordion', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                var data,
                    accordion = element,
                    dynamic  = accordion.hasClass('dynamic'),
                    transition = 350,
                    transitionFade = 150,
                    transitionDownDelay = 80;

                if (dynamic) {
                    data = scope.productsData;
                    data.pageItems = 99;
                    if (attrs.productCodes) data.productCodes = attrs.productCodes.replace(/\[|\]|\ /g, '').trim();
                    scope.getProducts();
                    scope.$on('updated', function(event) {
                        if (data.pageTotalRendered == 1) init();
                        else changePage();
                    });
                } else {
                    init();
                }

                function init() {
                    accordion.addClass('active');
                    var panels = accordion.find('div.accordion_panel');
                    // panels.children('div').hide().wrapInner('<div />').find('div.accordion_content').hide(); // Animate open version
                    panels.children('div').wrapInner('<div />'); // Pre-opened
                    panels.first().addClass('active').siblings().find('div.accordion_content').hide(); // Pre-opened
                    accordion.find('h3.accordion_header').click(function() {
                        var header = $(this);
                        var panel = header.closest('div.accordion_panel');
                        var content = header.next();
                        if (!panel.hasClass('active')) {
                            content.slideDown(transition).children('div').delay(transitionDownDelay).animate({'opacity': 1}, transitionFade);
                            panel.addClass('active').siblings().removeClass('active').children('div').slideUp(transition).children('div').delay(transitionDownDelay).animate({'opacity':0}, transitionFade);
                        } else {
                            content.slideUp(transition).children('div').animate({'opacity': 0}, transitionFade);
                            panel.removeClass('active');
                        }
                    });
                    // }).first().click(); // Animate open version
                }

            }
        }
    })
    .directive('accordionLinks', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                element.children('li').on('click',  function(e) {
                    e.preventDefault();
                    var link = $(this);
                    link.closest('div.editorial_lookbook').find('div.accordion_panel').eq(link.index()).not('.active').children('h3').click();
                });

            }
        }
    })
    .directive('social', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                if (element.hasClass('twitter')) scope.getSocialFeed('twitter', element.find('div.carousel').attr('data-feed-username'));
                // else scope.getSocialFeed('facebook', element.find('div.carousel').attr('data-feed-username'));

            }
        }
    })
    .directive('tooltip', function() {
        return {
            isolateScope: {},
            restrict: 'A',
            scope: {
                tooltip: '@'
            },
            template: '<div class="tooltip"><p ng-bind-html="tooltipValue"></p><span></span></div>',

            link: function(scope, element, attrs) {

                scope.tooltipValue = attrs.tooltip;
                var tooltip = element.find('.tooltip');

                element.hover(
                    function () {
                        $('body').append(tooltip).find(tooltip).css({display: 'block', left: element.offset().left - (tooltip.width() - 15), top: element.offset().top - tooltip.height()});
                    },
                    function () {
                        tooltip.remove();
                    }
                );
            }
         }
    })
    .directive('selectChanged', ['$rootScope', function($rootScope) {

        return {

            link: function(scope, element, attrs) {

                // called when user makes a change in a select box
                $rootScope.$on('selectChanged', function(event, data) {

                    // loop each select box
                    element.find('select').each(function(index, el) {

                        // we need to work on the sibling select box
                        if(index != data.index) {

                            // get the variants associated with the sibling box
                            var variants = scope.productData.variants[index].sizes;

                            // loop through the options to determine if they are available in selected size
                            $('option[value!=""]', el).each(function(i) {

                                // angularjs zero indexes options, lets add the correct variant to each one
                                var option = $(this);
                                option.attr('disabled', 'disabled');
                                option.attr('variant', variants[i].value);

                                // check each subVariant and cross reference to see if it should be disabled
                                // for this size
                                _.each(data.item.subVariants, function(element, id) {
                                    // check for a subVariant option match
                                    if(element.value == option.attr('variant')){
                                        // size and subVariant must be in stock
                                        if(data.item.stock && element.stock){
                                            option.removeAttr('disabled');
                                        }
                                    }
                                })

                            })
                        }else{
                            var select = $(this);
                            select.siblings('.select_ui').find('span.label').text(select.find('option:selected').text());
                        }
                    })

                });
            }
        };
    }])
    .directive('ngSelectRepeated', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                var productData = scope.productData;
                var apparelSizeCode = 'apparelSizeCode';
                var shoeSizeCode = 'shoeSizeCode';
                var shoeWidthCode = 'shoeWidthCode';

                $timeout(function(){
                    var select = element.find('select');
                    var id = select.attr('id');
                    var index = select.attr('index');

                    $('select', element).each(function(index, el){

                        var select = $(this);

                        _.each(productData.variants, function(element, index){

                            var variants = scope.productData.variants[index].sizes;

                            if(select.attr('id') == element.value){

                                $('option[value!=""]', select).each(function(i) {

                                    // angularjs zero indexes options, lets add the correct variant to each one
                                    var option = $(this);
                                    var variant = variants[i];
                                    option.attr('variant', variant.value);

                                    // set shoeWidthCode values to uppercase
                                    if(element.value == shoeWidthCode){
                                        var text = option.text();
                                        option.text(text.toUpperCase());
                                    }

                                    // check if this item is in stock, disable if necessary
                                    if(!variant.stock){
                                        option.attr('disabled', 'disabled');
                                    }

                                })

                            }
                        })
                    });

                    // select default 'standard' or 'All'(defaultOneSizeCode)
                    if(id == shoeWidthCode || id == apparelSizeCode){
                        var defaultSelector = (id == shoeWidthCode) ? 'standard' : scope.defaultOneSizeCode;

                        scope.selectedItem =  _.where(scope.variantSelector.sizes, {value: defaultSelector})[0];
                        if(scope.selectedItem != undefined){
                            scope.sizeSelectorUpdate(index);
                            setDefault(defaultSelector);
                        }
                    }

                    function setDefault(selector){
                        var val = $("option[variant='" + selector + "']").val();
                        $(select).val(val.toString());
                        select.siblings('.select_ui').find('span.label').text(select.find('option:selected').text());
                    }
                }, 0);

            }
        }
    }])
    .directive('productSelect', ['$timeout', function($timeout) {
        // Multiple carousels can appear on a single page so this formats
        // the label property to include the index of the carousel the
        // selected product appears in eg. 1:2 = 2nd item in the 1st carousel
        function format($a, label) {
            var title = '';
            angular.element('.editorial_carousel').each(function(index/*, value*/) {
                var $this = $(this);
                if ($this.has($a).length) {
                    title = $this.find('.header h2').text();
                    label = (index + 1) + ':' + label;
                }
            });
            return {title: title, label: label};
        }
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                $timeout(function() {

                    element.find('a').on('click', function(e) {
                        e.preventDefault();

                        var anchor = $(this);
                        var formatter = format(anchor, attrs.gaLabel);

                        // first track non quick buy, then quick buy
                        if(anchor.attr('data-quick-shop') == undefined) {
                            if(angular.element('.editorial_carousel').length) {
                                sendAnalytics('In Page Navigation', formatter.title, attrs.gaAction, null, true);
                            }else{
                                sendAnalytics('In Page Navigation', attrs.gaAction, null, null, true);
                            }
                            sendAnalytics(attrs.gaCategory, attrs.gaAction, formatter.label, null, null, this.href);
                        }else{
                            sendAnalytics('In Page Navigation', 'Quick Buy', attrs.gaAction, null, true);
                        }

                        function sendAnalytics(category, action, label, value, noninteraction, href) {
                            globals.googleAnalytics.trackEvent(category, action, label, value, noninteraction, href);
                        }

                    });
                }, 10);

            }
        };
    }])
    .directive('modal', function() { // [data-modal]
        return {
            scope: {
                show: '=',
            },
            replace: true, // Replace with the template below
            transclude: true, // we want to insert custom content inside the directive
            template: '<div class="modal">'+
                        '<div class="modal_overlay" ng-class="{animate: show}" ng-click="hideModal()"></div>'+
                        '<div class="modal_dialog" ng-class="{animate: show}" ng-style="dialogStyle">'+
                            '<div class="modal_close" ng-click="hideModal()">close</div>'+
                            '<div class="modal_dialog_content" ng-transclude></div>'+
                        '</div>'+
                    '</div>',
            link: function ( scope, element, attrs ) {
                scope.dialogStyle = {};
                if ( attrs.width )
                    scope.dialogStyle.width = attrs.width;
                if ( attrs.height )
                    scope.dialogStyle.height = attrs.height;

                scope.hideModal = function () {
                    scope.show = false;
                };

                $( document ).keyup( function ( e ) {
                    if ( e.keyCode == 27 ) {
                        if( !scope.$$phase ){
                            scope.$apply( scope.hideModal );
                        }
                    }
                });
            }
        };
    })
    .directive('gtm', ['GTMService', function ( GTMService ) { // [data-gtm];
        return {
            link: function ( scope, element, attrs ) {
                var data = scope.$eval( attrs.gtm );
                _.isArray( data ) ? _.each( data, GTMService.updateDataLayer ) : GTMService.updateDataLayer( data );
            }
        }
    }])
    .directive('slider', ['$window', '$timeout', function ( $window, $timeout ) { // [data-slider];
        return {
            link: function ( scope, element ) {
                var width = element.width(),
                    viewport = element.find('.viewport'),
                    elements = element.find('li');

                scope.slideTotal = elements.length;
                scope.active = 0;
                scope.loadedImages = [true];

                scope.slideTo = function ( index ) {
                    viewport.css('left', index * -width);
                    scope.active = index;
                    scope.loadedImages[ index ] = true;
                };

                scope.slideOne = function ( direction ) {
                    if ( direction ) {
                        scope.active === elements.length - 1  ? scope.active = 0 : scope.active++;
                    }
                    else {
                        scope.active === 0 ? scope.active = elements.length - 1 : scope.active--;
                    }
                    viewport.css('left',  scope.active * -width);
                    scope.loadedImages[ scope.active ] = true;
                };

                elements.each( function() { $(this).width( width ) } );

                $window.onresize = function () {
                    width = element.width();
                    elements.each( function() { $(this).width( width ) } );
                    viewport.removeClass('animate');
                    viewport.css('left', scope.active * -width);
                    $timeout( function(){ viewport.addClass('animate') } );
                };
            }
        }
    }])
    .directive('postcodeAnywhereCapture', ['$compile', function($compile) { // [data-postcode-anywhere-capture]

        var template = '<input type="text" id="searchTerm" class="text" type="text" ng-model="searchTerm" ng-change="find(searchTerm)" ng-focus="pacActive=true" ng-keydown="pacKeydown($event)" autocomplete="off" maxlength="100"/>' +
                        '<div class="panel" ng-class="{active: (pacActive && results)}">' +
                        '   <p class="no_results" ng-show="results && !addresses.length" data-postcode-anywhere-noresults></p>' +
                        '   <ul class="addresses" ng-show="addresses.length">' +
                        '       <li class="keyword" ng-class="{active: ($index == activeIndex), visible: ($index < 9)}" ng-repeat="entry in addresses" ng-click="select(entry); $event.stopPropagation();">{{entry.Text}}</li>' +
                        '   </ul>' +
                        '</div>' +
                        '<p ng-show="address">{{address.Label}}</p>' +
                        '<p class="message field_error" ng-show="address && address.noShippingArea">' +
                            '<span class="icon error">!</span>' +
                            '<span data-postcode-anywhere-noshipping></span>' +
                        '</p>';


        return {
            controller: 'PostcodeAnywhereCapture',
            scope: true,

            link: function(scope, element, attrs) {

                if (!Sportif.PostcodeAnywhere) {
                    return;
                }

                var e = angular.element($compile(template)(scope));
                element.replaceWith(e);
                var list = element.parent().find('ul');
                var activeItem, newActiveItem;

                scope.pacKeydown = function(event) {

                    if (event.which != 38 && event.which != 40 && event.which != 13) {
                        return;
                    }
                    event.preventDefault();

                    switch (event.which) {
                        case 38: // up
                            scope.activeIndex = (scope.activeIndex == -1) ? scope.results : (scope.activeIndex == 0) ? scope.results - 1 : scope.activeIndex - 1;

                            var itemHeight = list.children().first().outerHeight();
                            var items = list.children();
                            var activeItem = items.eq(scope.activeIndex);
                            if (!activeItem.hasClass('visible')) {
                                activeItem.addClass('visible');
                                items.eq(scope.activeIndex + 9).removeClass('visible');
                                list.scrollTop(list.scrollTop() - itemHeight);
                            }
                            break;
                        case 40: // down
                            scope.activeIndex = (scope.activeIndex == -1) ? 0 : (scope.activeIndex == scope.results - 1) ? 0 : scope.activeIndex + 1;

                            var itemHeight = list.children().first().outerHeight();
                            var items = list.children();
                            var activeItem = items.eq(scope.activeIndex);
                            if (!activeItem.hasClass('visible')) {
                                activeItem.addClass('visible');
                                items.eq(scope.activeIndex - 9).removeClass('visible');
                                list.scrollTop(list.scrollTop() + itemHeight);
                            }
                            break;
                        case 13: // enter
                            scope.select(scope.addresses[scope.activeIndex]);
                            break;
                    }
                    var item = list.children().eq(scope.activeIndex);
                    element.val(item.text());
                };

                element.on('click', function(event) {
                    event.stopPropagation();
                });

                $('body').on('click', function() {
                    scope.$apply(function() {
                        scope.pacActive = false;
                    });
                });

                scope.updateAddressForm = function () {
                    var form = $('form ol.address');
                    form.find('input[name=\'line1\']').val(scope.address.Company || scope.address.Line1);
                    form.find('input[name=\'line2\']').val((scope.address.Line2 || (scope.address.Company ? scope.address.Line1 : '')).concat(' ').concat(scope.address.Line3));
                    form.find('input[name=\'townCity\']').val(scope.address.City);
                    form.find('input[name=\'postcode\']').val(scope.address.PostalCode);
                };

                scope.resetFind = function () {
                    scope.searchTerm = '';
                    scope.addresses = [];
                };
            }
        }
    }])
    .directive('postcodeAnywhereNoresults', ['$templateCache', function($templateCache) { // [data-postcode-anywhere-noresults]
        return {
            templateUrl: "postcode-anywhere-noresults-html"
        };
    }])
    .directive('postcodeAnywhereNoshipping', ['$templateCache', function($templateCache) { // [data-postcode-anywhere-noshipping]
        return {
            templateUrl: "postcode-anywhere-noshipping-html"
        };
    }])
    .directive("lazySrc", ['$window', '$document', function($window, $document) { // [data-lazy-src];
        var lazyLoader = (function() {
            var images = [];
            var renderTimer = null;
            var renderDelay = 100;
            var win = $($window);
            var doc = $document;
            var documentHeight = doc.height();
            var documentTimer = null;
            var documentDelay = 2000;
            var isWatchingWindow = false;

            function addImage(image) {
                images.push(image);
                if (!renderTimer) {
                    startRenderTimer();
                }
                if (!isWatchingWindow) {
                    startWatchingWindow();
                }
            }

            function removeImage(image) {
                for (var i = 0 ; i < images.length ; i++) {
                    if (images[i] === image) {
                        images.splice(i, 1);
                        break;
                    }
                }

                if (!images.length) {
                    clearRenderTimer();
                    stopWatchingWindow();
                }
            }

            function checkDocumentHeight() {
                if (renderTimer) {
                    return;
                }
                var currentDocumentHeight = doc.height();
                if (currentDocumentHeight === documentHeight) {
                    return;
                }
                documentHeight = currentDocumentHeight;
                startRenderTimer();
            }

            function checkImages() {

                var visible = [];
                var hidden = [];
                var windowHeight = win.height();
                var scrollTop = win.scrollTop();
                var topFoldOffset = scrollTop;
                var bottomFoldOffset = (topFoldOffset + windowHeight);

                _.each(images, function (image) {
                    if (image.isVisible(topFoldOffset, bottomFoldOffset)) {
                        visible.push(image);
                    }
                    else {
                        hidden.push(image);
                    }
                });

                _.each(visible, function (image) {
                    image.render();
                });

                images = hidden;
                clearRenderTimer();

                if (!images.length) {
                    stopWatchingWindow();
                }
            }

            function clearRenderTimer() {
                clearTimeout(renderTimer);
                renderTimer = null;
            }

            function startRenderTimer() {
                renderTimer = setTimeout(checkImages, renderDelay);
            }

            function startWatchingWindow() {
                isWatchingWindow = true;
                win.on("resize.lazySrc", windowChanged);
                win.on("scroll.lazySrc", windowChanged);
                documentTimer = setInterval(checkDocumentHeight, documentDelay);
            }

            function stopWatchingWindow() {
                isWatchingWindow = false;
                win.off("resize.lazySrc");
                win.off("scroll.lazySrc");
                clearInterval(documentTimer);
            }

            function windowChanged() {
                if (!renderTimer) {
                    startRenderTimer();
                }
            }

            return({
                addImage: addImage,
                removeImage: removeImage
            });
        })();

        function LazyImage( element ) {
            var source = null;
            var isRendered = false;
            var height = null;

            function isVisible(topFoldOffset, bottomFoldOffset) {
                if (!element.is(":visible")) {
                    return false;
                }

                if (height === null) {
                    height = element.height();
                }

                var top = element.offset().top;
                var bottom = ( top + height );

                // Return true if the element is:
                // 1. The top offset is in view.
                // 2. The bottom offset is in view.
                // 3. The element is overlapping the viewport.
                return  ((top <= bottomFoldOffset) && (top >= topFoldOffset)) ||
                        ((bottom <= bottomFoldOffset) && (bottom >= topFoldOffset)) ||
                        ((top <= topFoldOffset) && (bottom >= bottomFoldOffset));
            }

            function render() {
                isRendered = true;
                renderSource();
            }

            function setSource(newSource) {
                source = newSource;
                if (isRendered) {
                    renderSource();
                }
            }

            function renderSource() {
                $(element[0]).fadeOut(100, function() {
                    $(element[0]).addClass('loaded');
                    $(element[0]).attr("src", source);
                    $(element[0]).fadeIn(250);
                });
            }

            return({
                isVisible: isVisible,
                render: render,
                setSource: setSource
            });
        }

        return {
            restrict: 'A',
            link: function ($scope, element, attributes) {
                var lazyImage = new LazyImage(element);
                lazyLoader.addImage(lazyImage);

                attributes.$observe("lazySrc", function(newSource) {
                    lazyImage.setSource(newSource);
                });

                $scope.$on("$destroy", function() {
                    lazyLoader.removeImage(lazyImage);
                });
            }
        };
    }])
    .directive( "storesMenu", ['$timeout', function ($timeout){
        return{
            restrict: 'A',
            link: function ( $scope, element, attributes ) {
                var open = element.find( 'a.expand_stores' ),
                    close = element.find( 'a.close_stores' ),
                    storesList = element.find( 'ul.stores' ),
                    storeListHeader = element.find( 'div.store_list_header' );

                open.on( 'click', function () {
                    sideOpen = true;
                    open.css( 'left', '-50px' );
                    element.css('width','240px');
                    element.css('height','500px');
                    $timeout( function () {
                        storesList.css( 'left', '0' );
                        storeListHeader.css( 'left', '0' );
                    },500);
                });

                close.on( 'click', function () {
                    sideOpen = false;
                    storesList.css( 'left', '-240px' );
                    storeListHeader.css( 'left', '-240px');
                    $timeout( function () {
                        element.css('width','50px');
                        element.css('height','50px');
                        open.css( 'left', '0px' );
                    },500);
                });
            }
        }
    }])
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
