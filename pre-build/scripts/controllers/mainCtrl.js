'use strict';

/* Controllers */
angular.module('controllers')
    /*
        MAIN CONTROLLER
    ----------------------------------------------------------------------------
    ============================================================================ */
    .controller('MainCtrl', ['$scope', 'ProductsFactory', 'ViewData', function ($scope, ProductsFactory, ViewData) {

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
