'use strict';
/*global angular, globals*/

/* Controllers */
angular.module('controllers')
	// Define the Returns controller
	.controller('ReturnsCtrl', function ReturnsCtrl($scope, $http, returnData) {

	    $scope.returnForm = returnData;
	    $scope.errors = false;

	    $scope.validateCurrentStep = function() {
	        var isDataValid = false;
	        switch ($scope.currentStep) {
	            case 1:
	                isDataValid = _.some($scope.returnForm.items, function(item) {
	                    return item.quantity > 0;
	                });
	                break;
	            case 2:
	                isDataValid = _.every($scope.returnForm.items, function(item) {
	                    if (item.quantity > 0)
	                        return (item.reason && item.reason != 'null');
	                    else return true;
	                });
	                break;
	        }
	        if ($scope.moveStepAttempt) {
	            if (isDataValid) $scope.errors = false;
	            else $scope.errors = true;
	        }
	        return isDataValid;
	    }

        $scope.test = function() {
           $scope.returnForm.orderAddress=false;
        }

	    $scope.nextStep = function() {
	        $scope.moveStepAttempt = true;
	        var isDataValid = $scope.validateCurrentStep();
	        if (isDataValid) {
	            $scope.currentStep++;
	            $scope.moveStepAttempt = false;
	        }
	    }

	});
