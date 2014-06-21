'use strict';

/* Controllers */
angular.module('controllers')
    /*
        SHOES CONTROLLER
    ----------------------------------------------------------------------------
    ============================================================================ */
    .controller('ShoesCtrl', ['$scope', "$injector", function ($scope, $injector){

        var ShoesSidebarService = $injector.get("ShoesSidebarService"),
            ViewData            = $injector.get("ViewData"),
            ProductsFactory     = $injector.get("ProductsFactory");

        if (!$scope.shoes) {

            var returnedViewData = ViewData.shoesMainData.then(function(shoesMainData){

                var promise = shoesMainData.data.values;

                $scope.sidebarData = promise.sidebarData;
            });

            // temp array to hold all shoes
            var tempShoes = [];

            // scope array to hold available shoes
            $scope.shoesProducts = localStorage.getItem('shoes.shoesProducts') ? JSON.parse(localStorage.getItem('shoes.shoesProducts')) : [];

            // set the number of items per page
            $scope.itemsPerPage = localStorage.getItem("itemsPerPage") ? localStorage.getItem("itemsPerPage") : 18;

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
            });
        }

        // watch for the change in current page to update the members per page
        $scope.$watch("shoes.currentPage", function() {
            // set the current page using local storage
            localStorage.setItem("shoes.pagination.page", $scope.shoes.currentPage);

            // set the size select value to false to show all sizes
            localStorage.setItem('shoes.sidebar.size.selected', false);

            updatePage();

        });

        /* default selected values for sports checkboxes */
        $scope.sports = ShoesSidebarService.sportsCheckboxes;

        $scope.sportSelected = function(checkbox, currentValue) {

            // change the selected value of "this" checkbox
            // from the current value to its opposite
            $scope.sports[checkbox].selected = !currentValue;

            // store the checkbox's value in localstorage
            ShoesSidebarService.processCheckbox(checkbox, currentValue);

            updatePage();
        };

        /* default selected values for users checkboxes */
        $scope.users = ShoesSidebarService.usersCheckboxes;

        $scope.userSelected = function(checkbox, currentValue) {

            // change the selected value of "this" checkbox
            // from the current value to its opposite
            $scope.users[checkbox].selected = !currentValue;

            // store the checkbox's value in localstorage
            ShoesSidebarService.processCheckbox(checkbox, currentValue);

            updatePage();
        };

        $scope.size = {selected: localStorage.getItem('shoes.sidebar.size.selected') ? localStorage.getItem('shoes.sidebar.size.selected') : false};

        $scope.sizeChange = function(selectedSize) {

            localStorage.setItem('shoes.sidebar.size.selected', selectedSize);

            updatePage();
        };

        $scope.sizeReset = function() {

            // set the size select value to false to show all sizes
            localStorage.setItem('shoes.sidebar.size.selected', false);

            // set the value to false to show the select a size option
            $scope.size.selected = false;

            updatePage();
        };

        function updatePage () {

            // get the selected size by which to filter available shoes
            var selectedSize = localStorage.getItem('shoes.sidebar.size.selected');

            /*  Filter available shoes based on user's selections */
            var shoesProducts = ShoesSidebarService.shoeFilter(tempShoes, $scope.sports, $scope.users, selectedSize);

            localStorage.setItem('shoes.shoesProducts', JSON.stringify(shoesProducts.availableShoes));

            // quantities to show next to selector values
            $scope.quantities = shoesProducts.quantities;

            // all available shoes to display on all pages
            $scope.shoesProducts = JSON.parse(localStorage.getItem('shoes.shoesProducts'));

            // data array to be passed into the ViewData.page() function
            var data = [$scope.shoes.currentPage, $scope.itemsPerPage, $scope.shoesProducts];

            // set the members segment array for the current page
            var shoesProductsShow = ViewData.page(data);

            localStorage.setItem('shoes.shoesProductsShow', JSON.stringify(shoesProductsShow));

            $scope.shoesProductsShow = JSON.parse(localStorage.getItem('shoes.shoesProductsShow'));

            // assign the number of members to a variable for pagination purposes
            $scope.totalItems = $scope.shoesProducts.length;
        };
    }]);
