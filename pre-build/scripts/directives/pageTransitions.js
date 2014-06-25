'use strict';

/* Directives */
angular.module('directives')
    /*
        PAGE-LOAD DIRECTIVE
    ----------------------------------------------------------------------------
    ============================================================================ */
    .directive('pageLoadAnimate', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                    // animate the loading of articles on pagination
                    element.css("opacity", 0).velocity("fadeIn", { duration: 650 });
            }
        };
    });
