'use strict';

/* Controllers */
angular.module('controllers')
    /*
        FOOTER CONTROLLER
    ----------------------------------------------------------------------------
    ============================================================================ */
    .controller('FooterCtrl', ['$scope', 'ViewData', function ($scope, ViewData) {

        // // set the current date
        var currentDate = new Date();
        $scope.year = currentDate.getFullYear();

        $scope.newsletter = {};

        $scope.emailRegexValidation = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

        $scope.newsletterSignup = function(newsletterSignupForm) {

            if(newsletterSignupForm.$valid) {

                console.log(newsletterSignupForm.email.$modelValue);
                ViewData.newsletterSignup(newsletterSignupForm.email.$modelValue);
                // clear the email signup field
                $scope.newsletter.email = '';
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
    }]);
