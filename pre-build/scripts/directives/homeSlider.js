'use strict';

angular.module('directives')

    .directive('homeSlider', ['$document', '$q', '$rootScope', '$timeout', 'SliderPanelService', function($document, $q, $rootScope, $timeout, SliderPanelService) { // [data-quick-shop-panel]
        return {

            restrict: 'A',

            link: function(scope, element, attr) {

                var imageContainer = element.find('.slider_image_container'),
                    imageLoadDeffered = $q.defer(),

                positionPanel = function(){
                    element.css({'top': SliderPanelService.panel.top, 'left': SliderPanelService.panel.left});
                    element.height( imageContainer.outerHeight() );
                    openPanel();
                },

                listener = $rootScope.$on('quickShopImageLoaded', function(){
                    imageLoadDeffered.resolve();
                    listener();
                });

                scope.$on('quickShopDataLoaded', function(event, promise){
                    $timeout( function () {
                        var sliderImageSrc = imageContainer.find('.slider_image').attr('src');
                        if(sliderImageSrc === "" || sliderImageSrc === undefined){
                            imageLoadDeffered.resolve();
                        }
                    },500);

                    $q.all([promise, imageLoadDeffered.promise]).then(function(){
                        $timeout(function(){
                            positionPanel();
                        });
                    });
                });

                $document.keyup( function ( event ) {
                    if ( event.keyCode == 27 ) {
                        closePanel();
                    }
                });
            }
        };
    }]);
