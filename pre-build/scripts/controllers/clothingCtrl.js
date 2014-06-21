'use strict';

/* Controllers */
angular.module('controllers')
    /*
        CLOTHING CONTROLLER
    ----------------------------------------------------------------------------
    ============================================================================ */
    .controller('ClothingCtrl', ['$scope', "$injector", function ($scope, $injector){

        var ClothingSidebarService = $injector.get("ClothingSidebarService"),
            ViewData               = $injector.get("ViewData"),
            ProductsFactory        = $injector.get("ProductsFactory");

        if (!$scope.clothing) {

            var returnedViewData = ViewData.clothingMainData.then(function(clothingMainData){

                var promise = clothingMainData.data.values;

                $scope.sidebarData = promise.sidebarData;
            });

            // temp array to hold all clothing
            var tempClothing = [];

            // scope array to hold available clothing
            $scope.clothingProducts = localStorage.getItem('clothing.clothingProducts') ? JSON.parse(localStorage.getItem('clothing.clothingProducts')) : [];

            // set the number of items per page
            $scope.itemsPerPage = localStorage.getItem("itemsPerPage") ? localStorage.getItem("itemsPerPage") : 18;

            $scope.clothing = {};

            var returnedProducts = ProductsFactory.getAll.then(function(data){
                // filter products and assign all clothing to tempClothing
                data.forEach( function (product) {
                    switch (product.category) {
                        case "Clothing":
                            tempClothing.push(product);
                            break;
                    }
                });

                // filter clothing and assign available clothing to $scope.clothingProducts
                tempClothing.forEach( function (item) {
                    switch (item.available) {
                        case true:
                            $scope.clothingProducts.push(item);
                            break;
                    }
                });

                // assign the number of members to a variable for pagination purposes
                $scope.totalItems = $scope.clothingProducts.length;

                // get the current page using local storage; if none exists, set it to 1
                $scope.clothing.currentPage = localStorage.getItem("clothing.pagination.page") ? localStorage.getItem("clothing.pagination.page") : 1;
            });
        }

        // watch for the change in current page to update the members per page
        $scope.$watch("clothing.currentPage", function() {
            // set the current page using local storage
            localStorage.setItem("clothing.pagination.page", $scope.clothing.currentPage);

            // set the size select value to false to show all sizes
            localStorage.setItem('clothing.sidebar.size.selected', false);

            updatePage();

        });

        /* default selected values for sports checkboxes */
        $scope.sports = ClothingSidebarService.sportsCheckboxes;

        $scope.sportSelected = function(checkbox, currentValue) {

            // change the selected value of "this" checkbox
            // from the current value to its opposite
            $scope.sports[checkbox].selected = !currentValue;

            // store the checkbox's value in localstorage
            ClothingSidebarService.processCheckbox(checkbox, currentValue);

            updatePage();
        };

        /* default selected values for users checkboxes */
        $scope.users = ClothingSidebarService.usersCheckboxes;

        $scope.userSelected = function(checkbox, currentValue) {

            // change the selected value of "this" checkbox
            // from the current value to its opposite
            $scope.users[checkbox].selected = !currentValue;

            // store the checkbox's value in localstorage
            ClothingSidebarService.processCheckbox(checkbox, currentValue);

            updatePage();
        };

        $scope.size = {selected: localStorage.getItem('clothing.sidebar.size.selected') ? localStorage.getItem('clothing.sidebar.size.selected').replace(/(^\s+|\s+$)/g,'' /*remove blank spaces from size value*/) : false};

        $scope.sizeChange = function(selectedSize) {

            localStorage.setItem('clothing.sidebar.size.selected', selectedSize);

            updatePage();
        };

        $scope.sizeReset = function() {

            // set the size select value to false to show all sizes
            localStorage.setItem('clothing.sidebar.size.selected', false);

            // set the value to false to show the select a size option
            $scope.size.selected = false;

            updatePage();
        };

        function updatePage () {

            // get the selected size by which to filter available clothing
            var selectedSize = localStorage.getItem('clothing.sidebar.size.selected');

            /*  Filter available clothing based on user's selections */
            var clothingProducts = ClothingSidebarService.clothingFilter(tempClothing, $scope.sports, $scope.users, selectedSize);

            localStorage.setItem('clothing.clothingProducts', JSON.stringify(clothingProducts.availableClothing));

            // quantities to show next to selector values
            $scope.quantities = clothingProducts.quantities;

            // all available clothing to display on all pages
            $scope.clothingProducts = JSON.parse(localStorage.getItem('clothing.clothingProducts'));

            // data array to be passed into the ViewData.page() function
            var data = [$scope.clothing.currentPage, $scope.itemsPerPage, $scope.clothingProducts];

            // set the members segment array for the current page
            var clothingProductsShow = ViewData.page(data);

            localStorage.setItem('clothing.clothingProductsShow', JSON.stringify(clothingProductsShow));

            $scope.clothingProductsShow = JSON.parse(localStorage.getItem('clothing.clothingProductsShow'));

            // assign the number of members to a variable for pagination purposes
            $scope.totalItems = $scope.clothingProducts.length;
        };
    }]);
