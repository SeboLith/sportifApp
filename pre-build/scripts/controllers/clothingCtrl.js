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

        $scope.clothing = {};

        ViewData.clothingMainData.then(function(clothingMainData){

            var promise = clothingMainData.data.values;

            $scope.sidebarData = promise.sidebarData;
        });

        // set the number of items per page
        localStorage.setItem("itemsPerPage", 12);
        $scope.itemsPerPage = localStorage.getItem("itemsPerPage");

        ProductsFactory.getAll.then(function(data){

            // temp array to hold all clothing
            var tempClothing = [];

            // filter products and assign all clothing to tempClothing
            data.forEach( function (product) {
                switch (product.category) {
                    case "Clothing":
                        tempClothing.push(product);
                        break;
                }
            });

            // assign all products to localStorage variable
            localStorage.setItem('clothing.allClothingProducts', JSON.stringify(tempClothing));

            // temp array to hold available clothing
            var clothingProducts = [];

            // filter clothing and assign available clothing to $scope.clothingProducts
            tempClothing.forEach( function (item) {
                switch (item.available) {
                    case true:
                        clothingProducts.push(item);
                        break;
                }
            });

            // assign all available products to localStorage variable
            localStorage.setItem('clothing.availableClothingProducts', JSON.stringify(clothingProducts));
            updatePage();
        });

        // get the current page using local storage; if none exists, set it to 1
        $scope.clothing.currentPage = localStorage.getItem("clothing.pagination.page") && localStorage.getItem("clothing.pagination.page") != 'undefined' ? localStorage.getItem("clothing.pagination.page") : 1;

        // watch for the change in current page to update the products per page
        $scope.$watch("clothing.currentPage", function() {

            // set the current page using local storage
            localStorage.setItem("clothing.pagination.page", $scope.clothing.currentPage);

            updatePage();

        });

        /* default selected values for types checkboxes */
        $scope.types = ClothingSidebarService.typesCheckboxes;

        $scope.typeSelected = function(checkbox, currentValue) {

            // change the selected value of "this" checkbox
            // from the current value to its opposite
            $scope.types[checkbox].selected = !currentValue;

            // store the checkbox's value in localstorage
            ClothingSidebarService.processCheckbox(checkbox, currentValue);

            updatePage();
        };

        $scope.selectAllTypes = function() {

            $scope.types = ClothingSidebarService.selectAllTypes();

            updatePage();
        };

        $scope.unselectAllTypes = function() {

            $scope.types = ClothingSidebarService.unselectAllTypes();

            updatePage();
        };

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

        $scope.selectAllSports = function() {

            $scope.sports = ClothingSidebarService.selectAllSports();

            updatePage();
        };

        $scope.unselectAllSports = function() {

            $scope.sports = ClothingSidebarService.unselectAllSports();

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

        $scope.selectAllUsers = function() {

            $scope.users = ClothingSidebarService.selectAllUsers();

            updatePage();
        };

        $scope.unselectAllUsers = function() {

            $scope.users = ClothingSidebarService.unselectAllUsers();

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

            // set the value to false to show the "select a size" option
            $scope.size.selected = false;

            updatePage();
        };

        function updatePage () {

            if ( localStorage.getItem('clothing.sidebar.size.selected') == null || localStorage.getItem('clothing.sidebar.size.selected') == 'false' ) {
                // set the size select value to false to show all sizes
                localStorage.setItem('clothing.sidebar.size.selected', false);

                // set the value to false to show the "select a size" option
                $scope.size.selected = false;
            }

            // get the selected size by which to filter available clothing
            var selectedSize = localStorage.getItem('clothing.sidebar.size.selected'),

                tempClothing = JSON.parse(localStorage.getItem('clothing.allClothingProducts')),

                itemsPerPage = localStorage.getItem("itemsPerPage"),

                currentPage = localStorage.getItem("clothing.pagination.page"),

                /*  Filter available clothing based on user's selections */
                clothingProducts = ClothingSidebarService.clothingFilter(tempClothing, $scope.types, $scope.sports, $scope.users, selectedSize);

            localStorage.setItem('clothing.availableClothingProducts', JSON.stringify(clothingProducts.availableClothing));

            var availableClothingProducts = JSON.parse(localStorage.getItem('clothing.availableClothingProducts'));

            // assign the number of products to a variable for pagination purposes
            $scope.totalItems = availableClothingProducts.length;

            // all available clothing to display on all pages
            $scope.clothingProducts = availableClothingProducts;

            // quantities to show next to selector values
            $scope.quantities = clothingProducts.quantities;

            // data array to be passed into the ViewData.page() function
            var data = [currentPage, itemsPerPage, $scope.clothingProducts],
                // set the products segment array for the current page
                clothingProductsShow = ViewData.page(data);

            localStorage.setItem('clothing.clothingProductsShow', JSON.stringify(clothingProductsShow));

            $scope.clothingProductsShow = JSON.parse(localStorage.getItem('clothing.clothingProductsShow'));
        };
    }]);
