'use strict';

/* Controllers */
angular.module('controllers')
    /*
        HOME CONTROLLER
    ----------------------------------------------------------------------------
    ============================================================================ */
    .controller('HomeCtrl', ['$scope', '$injector', function ($scope, $injector){

        var ViewData = $injector.get("ViewData");

        ViewData.homeMainData.then(function(homeMainData){

            var promise = homeMainData.data.values;

            $scope.quadrantOneData = promise.quadrantOneData;
            $scope.quadrantTwoData = promise.quadrantTwoData;
            $scope.quadrantThreeData = promise.quadrantThreeData;
            $scope.quadrantFourData = promise.quadrantFourData;
        });
    }]);







