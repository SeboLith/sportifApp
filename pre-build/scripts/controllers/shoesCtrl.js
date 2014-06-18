'use strict';

/* Controllers */
angular.module('controllers')
    /*
        SHOES CONTROLLER
    ----------------------------------------------------------------------------
    ============================================================================ */
    .controller('ShoesCtrl', ['$scope', 'ViewData', 'SidebarService', 'ProductsFactory', function ($scope, ViewData, SidebarService, ProductsFactory){

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
            $scope.itemsPerPage = localStorage.getItem("itemsPerPage") ? localStorage.getItem("itemsPerPage") : 6;

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

            // get the selected size by which to filter available shoes
            var selectedSize = localStorage.getItem('shoes.sidebar.size.selected');

            /*  Filter available shoes based on user's selections */
            var shoesProducts = SidebarService.shoeFilter(tempShoes, $scope.sports, $scope.users, selectedSize);

            localStorage.setItem('shoes.shoesProducts', JSON.stringify(shoesProducts.availableShoes));

            updatePage(shoesProducts.quantities);

        });

        /* default selected values for sports checkboxes */
        $scope.sports = SidebarService.sportsCheckboxes;

        $scope.sportSelected = function(checkbox, currentValue) {

            // change the selected value of "this" checkbox
            // from the current value to its opposite
            $scope.sports[checkbox].selected = !currentValue;

            // store the checkbox's value in localstorage
            SidebarService.processCheckbox(checkbox, currentValue);

            // get the selected size by which to filter available shoes
            var selectedSize = localStorage.getItem('shoes.sidebar.size.selected');

            /*  Filter available shoes based on user's selections */
            var shoesProducts = SidebarService.shoeFilter(tempShoes, $scope.sports, $scope.users, selectedSize);

            localStorage.setItem('shoes.shoesProducts', JSON.stringify(shoesProducts.availableShoes));

            updatePage(shoesProducts.quantities);
        };

        /* default selected values for users checkboxes */
        $scope.users = SidebarService.usersCheckboxes;

        $scope.userSelected = function(checkbox, currentValue) {

            // change the selected value of "this" checkbox
            // from the current value to its opposite
            $scope.users[checkbox].selected = !currentValue;

            // store the checkbox's value in localstorage
            SidebarService.processCheckbox(checkbox, currentValue);

            // get the selected size by which to filter available shoes
            var selectedSize = localStorage.getItem('shoes.sidebar.size.selected');

            /*  Filter available shoes based on user's selections */
            var shoesProducts = SidebarService.shoeFilter(tempShoes, $scope.sports, $scope.users, selectedSize);

            localStorage.setItem('shoes.shoesProducts', JSON.stringify(shoesProducts.availableShoes));

            updatePage(shoesProducts.quantities);
        };

        $scope.size = {selected: localStorage.getItem('shoes.sidebar.size.selected') ? localStorage.getItem('shoes.sidebar.size.selected') : ""};

        $scope.sizeChange = function(selectedSize) {

            localStorage.setItem('shoes.sidebar.size.selected', selectedSize);
        };

        function updatePage (quantities) {

            // quantities to show next to selector values
            $scope.quantities = quantities;

            // available shoes
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
