'use strict';

/* Directives */
angular.module('directives')
    /*
        ARTICLE-LOAD DIRECTIVE
    ----------------------------------------------------------------------------
    ============================================================================ */
    .directive('articleLoadAnimate', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                // listen for the "last_article_on_page_loaded" event
                // prior to applying transition effects
                scope.$on('last_article_on_page_loaded', function( domainElement ) {
                    // assign the articles to a variable
                    var articles = element.children();

                    // animate the loading of articles on pagination
                    articles.css("opacity", 0).velocity("transition.slideUpBigIn", { stagger: 60, duration: 350 });
                });
            }
        };
    })
    /*
        ON-REPEAT-DONE DIRECTIVE
    ----------------------------------------------------------------------------
    ============================================================================ */
    .directive("onRepeatDone", function() {
        return {
            restriction: 'A',
            link: function(scope, element, attributes ) {
                // emit the event named in the "on-repeat-done" directive
                scope.$emit(attributes["onRepeatDone"], element);
            }
        }
    });
