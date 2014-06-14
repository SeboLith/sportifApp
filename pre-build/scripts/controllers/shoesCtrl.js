'use strict';

/* Controllers */
angular.module('controllers')
    /*
        SHOES CONTROLLER
    ----------------------------------------------------------------------------
    ============================================================================ */
    .controller('ShoesCtrl', ['$scope', 'ViewData', 'SidebarService', 'ProductsFactory', function ($scope, ViewData, SidebarService, ProductsFactory){

        var returnedViewData = ViewData.shoesMainData.then(function(shoesMainData){

            var promise = shoesMainData.data.values;

            $scope.sidebarData = promise.sidebarData;
        });

        // temp array to hold all shoes
        var tempShoes = [];

        // scope array to hold available shoes
        $scope.shoesProducts = [];

        // set the number of items per page
        $scope.itemsPerPage = localStorage.getItem("itemsPerPage") ? localStorage.getItem("itemsPerPage") : 9;
        $scope.shoes = {};

        var returnedProducts = ProductsFactory.getAll.then(function(data){
            // filter products and assign all shoes to tempShoes
            data.forEach( function (product) {
                switch (product.category) {
                    case "Shoes":
                        tempShoes.push(product);
                        break;
                }
            });

            // filter shoes and assign available shoes to $scope.shoesProducts
            tempShoes.forEach( function (shoe) {
                switch (shoe.available) {
                    case true:
                        $scope.shoesProducts.push(shoe);
                        break;
                }
            });

            // assign the number of members to a variable for pagination purposes
            $scope.totalItems = $scope.shoesProducts.length;

            // get the current page using local storage; if none exists, set it to 1
            $scope.shoes.currentPage = localStorage.getItem("shoes.pagination.page") ? localStorage.getItem("shoes.pagination.page") : 1;

            // watch for the change in current page to update the members per page
            $scope.$watch("shoes.currentPage", function() {
              // set the current page using local storage
              localStorage.setItem("shoes.pagination.page", $scope.shoes.currentPage);

              // data array to be passed into the ViewData.page() function
              var data =[$scope.shoes.currentPage, $scope.itemsPerPage, $scope.shoesProducts];

              // set the members segment array for the current page
              $scope.shoesProductsShow = ViewData.page(data);
            });
        });

        /* default selected values for sports checkboxes */
        // check for the string "true" value of the selected item in localStorage
        // if it doesn't exist, set it to true
        $scope.sports = ViewData.sportsCheckboxes;

        $scope.sportSelected = function(checkbox, currentValue) {

            // change the selected value of the "this" checkbox
            // from the current value to its opposite
            $scope.sports[checkbox].selected = !currentValue;

            // store the checkbox's value in localstorage
            ViewData.processCheckbox(checkbox, currentValue);

            // get the selected size by which to filter available shoes
            var selectedSize = localStorage.getItem('shoes.sidebar.size.selected');

            /*  @TODO: Filter available shoes based on user's selections
             *
             */
             $scope.shoesProducts = SidebarService.shoeFilter(tempShoes, $scope.sports, $scope.users, selectedSize);
        };

        /* default selected values for users checkboxes */
        // check for the string "true" value of the selected item in localStorage
        // if it doesn't exist, set it to true
        $scope.users = ViewData.usersCheckboxes;

        /* default selected values for users checkboxes */
        // check for the string "true" value of the selected item in localStorage
        // if it doesn't exist, set it to false
        $scope.size = {selected: localStorage.getItem('shoes.sidebar.size.selected') ? localStorage.getItem('shoes.sidebar.size.selected') : ""};

        $scope.userSelected = function(checkbox, currentValue) {

            // change the selected value of the "this" checkbox
            // from the current value to its opposite
            $scope.users[checkbox].selected = !currentValue;

            // store the checkbox's value in localstorage
            ViewData.processCheckbox(checkbox, currentValue);
        };

        $scope.sizeChange = function(selectedSize) {

            localStorage.setItem('shoes.sidebar.size.selected', selectedSize);
        };
    }]);
