'use strict';

/* Controllers */
angular.module('controllers')
    /*
        HEADER CONTROLLER
    ----------------------------------------------------------------------------
    ============================================================================ */
    .controller('HeaderCtrl', ['$scope', 'ViewData', function ($scope, ViewData) {

        $scope.search = {};

        var returnedHeaderData = ViewData.headerData.then(function(headerData){

            $scope.topNav            = headerData.data.values.topNav;
            $scope.shopBar           = headerData.data.values.mainNav.shopBar;
            $scope.runningBar        = headerData.data.values.mainNav.runningBar;
            $scope.featuredSportsBar = headerData.data.values.mainNav.featuredSportsBar;
            $scope.mySportifBar      = headerData.data.values.mainNav.mySportifBar;

        });

        $scope.ShopBarComponent = false;
        $scope.RunningBarComponent = false;
        $scope.FeaturedSportsBarComponent = false;
        $scope.MySportifBarComponent = false;

        $scope.componentShow = function(componentName) {

            // reset the component values

            // set the show value for the clicked component to true
            switch (componentName) {
                case "ShopBar":
                    $scope.ShopBarComponent = !$scope.ShopBarComponent;
                    $scope.RunningBarComponent = false;
                    $scope.FeaturedSportsBarComponent = false;
                    $scope.MySportifBarComponent = false;
                    console.log("ShopBar lead clicked");
                    break;
                case "RunningBar":
                    $scope.RunningBarComponent = !$scope.RunningBarComponent;
                    $scope.ShopBarComponent = false;
                    $scope.FeaturedSportsBarComponent = false;
                    $scope.MySportifBarComponent = false;
                    console.log("RunningBar lead clicked");
                    break;
                case "FeaturedSportsBar":
                    $scope.FeaturedSportsBarComponent = !$scope.FeaturedSportsBarComponent;
                    $scope.ShopBarComponent = false;
                    $scope.RunningBarComponent = false;
                    $scope.MySportifBarComponent = false;
                    console.log("FeaturedSportsBar lead clicked");
                    break;
                case "MySportifBar":
                    $scope.MySportifBarComponent = !$scope.MySportifBarComponent;
                    $scope.ShopBarComponent = false;
                    $scope.RunningBarComponent = false;
                    $scope.FeaturedSportsBarComponent = false;
                    console.log("MySportifBar lead clicked");
                    break;
            }
        };

        $scope.headerSearch = function(searchQuery) {

            console.log(searchQuery.text.$modelValue);
            // clear the search query field
            $scope.search.query = '';
        };
    }]);
