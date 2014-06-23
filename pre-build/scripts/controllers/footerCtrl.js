'use strict';

/* Controllers */
angular.module('controllers')
    /*
        FOOTER CONTROLLER
    ----------------------------------------------------------------------------
    ============================================================================ */
    .controller('FooterCtrl', ['$scope', '$injector', function ($scope, $injector) {

        var ViewData = $injector.get("ViewData"),
            // set the current date
            currentDate = new Date();

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
    }]);
