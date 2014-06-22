'use strict';

/* Controllers */
angular.module('controllers')
    /*
        MAIN CONTROLLER
    ----------------------------------------------------------------------------
    ============================================================================ */
    .controller('MainCtrl', ['$scope', '$injector', function ($scope, $injector) {

        var ViewData        = $injector.get("ViewData"),
            ProductsFactory = $injector.get("ProductsFactory");

        ViewData.miscViewData.then(function(miscViewData){

            var promise = miscViewData.data.values;

            $scope.company                 = promise.company.value;
            $scope.validEmailErrorMessage  = promise.emailErrorMessage.value;
            $scope.newsLetterSignupMessage = promise.newsletterSignupMessage.value;
            $scope.signUpButton            = promise.signupButtonText.value;
            $scope.signUpTitle             = promise.signupTite.value;

        });

        ViewData.corporateInfo.then(function(corporateInfo){

            var promise = corporateInfo.data;

            $scope.corporateInfo  = promise;
        });

        ViewData.customerServices.then(function(customerServices){

            var promise = customerServices.data;

            $scope.customerServices  = promise;
        });

        ViewData.popularProducts.then(function(popularProducts){

            var promise = popularProducts.data;

            $scope.popularProducts  = promise;
        });
    }]);
