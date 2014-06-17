'use strict';

/* Controllers */
angular.module('controllers')
    /*
        MAIN CONTROLLER
    ----------------------------------------------------------------------------
    ============================================================================ */
    .controller('MainCtrl', ['$scope', 'ProductsFactory', 'ViewData', function ($scope, ProductsFactory, ViewData) {

        /* Product Categories */
        $scope.shoesProducts = [];
        $scope.clothingProducts = [];
        $scope.accessoriesProducts = [];
        $scope.fanGearProducts = [];

        /* User Categories */
        $scope.mensProducts = [];
        $scope.womensProducts = [];
        $scope.kidsProducts = [];

        /* User Activities */
        $scope.soccerProducts = [];
        $scope.basketballProducts = [];
        $scope.runningProducts = [];
        $scope.martialArtsProducts = [];

        var returnedProducts = ProductsFactory.getAll.then(function(data){
            data.forEach( function (product) {
                // filter and assign the products by category to an array
                switch (product.category) {
                    case "Shoes":
                        $scope.shoesProducts.push(product);
                        break;
                    case "Clothing":
                        $scope.clothingProducts.push(product);
                        break;
                    case "Accessories":
                        $scope.accessoriesProducts.push(product);
                        break;
                    case "Fan Gear":
                        $scope.fanGearProducts.push(product);
                        break;
                    default:
                        break;
                }
                // filter and assign the products by user to an array
                switch (product.user) {
                    case "men":
                        $scope.mensProducts.push(product);
                        break;
                    case "women":
                        $scope.womensProducts.push(product);
                        break;
                    case "children":
                        $scope.kidsProducts.push(product);
                        break;
                    default:
                        break;
                }
                // filter and assign the products by activity to an array
                switch (product.activity) {
                    case "Basketball":
                        $scope.basketballProducts.push(product);
                        break;
                    case "Scoocer":
                        $scope.soccerProducts.push(product);
                        break;
                    case "Running":
                        $scope.runningProducts.push(product);
                    case "Martial Arts":
                        $scope.martialArtsProducts.push(product);
                        break;
                    default:
                        break;
                }
            });
        });

        var returnedMiscViewData = ViewData.miscViewData.then(function(miscViewData){

            var promise = miscViewData.data.values;

            $scope.company                 = promise.company.value;
            $scope.validEmailErrorMessage  = promise.emailErrorMessage.value;
            $scope.newsLetterSignupMessage = promise.newsletterSignupMessage.value;
            $scope.signUpButton            = promise.signupButtonText.value;
            $scope.signUpTitle             = promise.signupTite.value;

        });

        var returnedCorporateInfo = ViewData.corporateInfo.then(function(corporateInfo){

            var promise = corporateInfo.data;

            $scope.corporateInfo  = promise;
        });

        var returnedCustomerServices = ViewData.customerServices.then(function(customerServices){

            var promise = customerServices.data;

            $scope.customerServices  = promise;
        });

        var returnedPopularProducts = ViewData.popularProducts.then(function(popularProducts){

            var promise = popularProducts.data;

            $scope.popularProducts  = promise;
        });
    }]);
