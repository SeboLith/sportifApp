'use strict';

/* Controllers */
angular.module('controllers')
    /*
        HEADER CONTROLLER
    ----------------------------------------------------------------------------
    ============================================================================ */
    .controller('HeaderCtrl', ['$scope', '$injector', function ($scope, $injector) {

        var ViewData = $injector.get("ViewData");

        $scope.search = {};

        $scope.ShopBarComponent = false;
        $scope.RunningBarComponent = false;
        $scope.FeaturedSportsBarComponent = false;
        $scope.MySportifBarComponent = false;

        ViewData.headerData.then(function(headerData){

            $scope.topNav            = headerData.data.values.topNav;
            $scope.shopBar           = headerData.data.values.mainNav.shopBar;
            $scope.runningBar        = headerData.data.values.mainNav.runningBar;
            $scope.featuredSportsBar = headerData.data.values.mainNav.featuredSportsBar;
            $scope.mySportifBar      = headerData.data.values.mainNav.mySportifBar;

        });

        $scope.componentShow = function(componentName) {

            // reset the component values

            // set the show value for the clicked component to true
            switch (componentName) {
                case "ShopBar":
                    $scope.ShopBarComponent = !$scope.ShopBarComponent;
                    $scope.RunningBarComponent = false;
                    $scope.FeaturedSportsBarComponent = false;
                    $scope.MySportifBarComponent = false;
                    break;
                case "RunningBar":
                    $scope.RunningBarComponent = !$scope.RunningBarComponent;
                    $scope.ShopBarComponent = false;
                    $scope.FeaturedSportsBarComponent = false;
                    $scope.MySportifBarComponent = false;
                    break;
                case "FeaturedSportsBar":
                    $scope.FeaturedSportsBarComponent = !$scope.FeaturedSportsBarComponent;
                    $scope.ShopBarComponent = false;
                    $scope.RunningBarComponent = false;
                    $scope.MySportifBarComponent = false;
                    break;
                case "MySportifBar":
                    $scope.MySportifBarComponent = !$scope.MySportifBarComponent;
                    $scope.ShopBarComponent = false;
                    $scope.RunningBarComponent = false;
                    $scope.FeaturedSportsBarComponent = false;
                    break;
            }
        };

        $scope.headerSearch = function(searchQuery) {

            console.log(searchQuery.text.$modelValue);
            // clear the search query field
            $scope.search.query = '';
        };
    }]);
