'use strict';

/* DATA PULLED IN FROM CUSTOM.JS.GLOBALS */

/* Directives */
angular.module('directives')
    /*
        AUTOPLAY DIRECTIVE
    ----------------------------------------------------------------------------
    ============================================================================ */
    .directive('autoplay', ["$injector", function($injector) {
        return {
            restrict: 'A',
            scope: true,
            link: function(scope, element, attrs) {

                var rScope = $injector.get('$rootScope');

                function loop() {
                    globals.timer = setTimeout(function(){
                        var rScope = $injector.get('$rootScope');
                        rScope.$broadcast('autoplay');
                        loop();
                    }, 3000);
                }
                if (!globals.timer) loop();
            }
        };
    }])
    /*
        CAROUSEL DIRECTIVE
    ----------------------------------------------------------------------------
    ============================================================================ */
    .directive('carousel', ["$injector", function($injector) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                var rScope = $injector.get('$rootScope');

                // listen for the "last_slide_loaded" event
                // prior to applying carousel effects
                rScope.$on('last_slide_loaded', function( domainElement ) {

                    var data,
                        carousel  = element,
                        container = carousel.hasClass('.item') ? carousel : carousel.closest('div.item'),
                        dynamic   = carousel.hasClass('dynamic'),
                        viewport  = carousel.find(".viewport"),
                        slides    = carousel.find(".slides"),
                        controls,
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
                            // Product (Multi)
                            scope.$on('updated', function(event) {
                                changePage();
                                Asics.Common.widthMatch('div.actions.join');
                            });
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
                        var li = ''; for (var i = 0; i < pageTotal; i++) li += '<li><span>' + (i + 1) + '</span></li>';
                        $('<ol class="controls">' + li + '</ol>').appendTo(carousel);
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
                        carousel.on('load', function() {
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
                            slides.stop().animate({'left': - (pageWidth * pageTarget)}, 400);
                            controls.eq(pageTarget).addClass('active').siblings().removeClass('active');
                            pageCurrent = pageTarget;
                        }
                    }
                });
            }
        };
    }]);
