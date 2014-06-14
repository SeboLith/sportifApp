'use strict';

/* Controllers */
angular.module('controllers')
    /*
        HOME CONTROLLER
    ----------------------------------------------------------------------------
    ============================================================================ */
    .controller('HomeCtrl', ['$scope', 'ViewData', function ($scope, ViewData){


        var returnedViewData = ViewData.homeMainData.then(function(homeMainData){

        var promise = homeMainData.data.values;

        $scope.quadrantOneData = promise.quadrantOneData;
        $scope.quadrantTwoData = promise.quadrantTwoData;
        $scope.quadrantThreeData = promise.quadrantThreeData;
        $scope.quadrantFourData = promise.quadrantFourData;
        });
    }]);







