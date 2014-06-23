'use strict';

/* Controllers */
angular.module('controllers')
    /*
        ACCESORIES CONTROLLER
    ----------------------------------------------------------------------------
    ============================================================================ */
    .controller('AccessoriesCtrl', ['$scope', "$injector", function ($scope, $injector){

        var AccessoriesSidebarService = $injector.get("AccessoriesSidebarService"),
            ViewData                  = $injector.get("ViewData"),
            ProductsFactory           = $injector.get("ProductsFactory");

        $scope.accessories = {};

        ViewData.accessoriesMainData.then(function(accessoriesMainData){

            var promise = accessoriesMainData.data.values;

            $scope.sidebarData = promise.sidebarData;
        });

        // set the number of items per page
        localStorage.setItem("itemsPerPage", 6);
        $scope.itemsPerPage = localStorage.getItem("itemsPerPage");

        ProductsFactory.getAll.then(function(data){

            // temp array to hold all accessories
            var tempAccessories = [];

            // filter products and assign all accessories to tempAccessories
            data.forEach( function (product) {
                switch (product.category) {
                    case "Accessories":
                        tempAccessories.push(product);
                        break;
                }
            });

            // assign all products to localStorage variable
            localStorage.setItem('accessories.allAccessoriesProducts', JSON.stringify(tempAccessories));

            // temp array to hold available accessories
            var accessoriesProducts = [];

            // filter accessories and assign available accessories to $scope.accessoriesProducts
            tempAccessories.forEach( function (item) {
                switch (item.available) {
                    case true:
                        accessoriesProducts.push(item);
                        break;
                }
            });

            // assign all available products to localStorage variable
            localStorage.setItem('accessories.availableAccessoriesProducts', JSON.stringify(accessoriesProducts));
            updatePage();
        });

        // get the current page using local storage; if none exists, set it to 1
        $scope.accessories.currentPage = localStorage.getItem("accessories.pagination.page") && localStorage.getItem("accessories.pagination.page") != 'undefined' ? localStorage.getItem("accessories.pagination.page") : 1;

        // watch for the change in current page to update the products per page
        $scope.$watch("accessories.currentPage", function() {

            // set the current page using local storage
            localStorage.setItem("accessories.pagination.page", $scope.accessories.currentPage);

            updatePage();

        });

        /* default selected values for types checkboxes */
        $scope.types = AccessoriesSidebarService.typesCheckboxes;

        $scope.typeSelected = function(checkbox, currentValue) {

            // change the selected value of "this" checkbox
            // from the current value to its opposite
            $scope.types[checkbox].selected = !currentValue;

            // store the checkbox's value in localstorage
            AccessoriesSidebarService.processCheckbox(checkbox, currentValue);

            updatePage();
        };

        /* default selected values for sports checkboxes */
        $scope.sports = AccessoriesSidebarService.sportsCheckboxes;

        $scope.sportSelected = function(checkbox, currentValue) {

            // change the selected value of "this" checkbox
            // from the current value to its opposite
            $scope.sports[checkbox].selected = !currentValue;

            // store the checkbox's value in localstorage
            AccessoriesSidebarService.processCheckbox(checkbox, currentValue);

            updatePage();
        };

        /* default selected values for users checkboxes */
        $scope.users = AccessoriesSidebarService.usersCheckboxes;

        $scope.userSelected = function(checkbox, currentValue) {

            // change the selected value of "this" checkbox
            // from the current value to its opposite
            $scope.users[checkbox].selected = !currentValue;

            // store the checkbox's value in localstorage
            AccessoriesSidebarService.processCheckbox(checkbox, currentValue);

            updatePage();
        };

        $scope.size = {selected: localStorage.getItem('accessories.sidebar.size.selected') ? localStorage.getItem('accessories.sidebar.size.selected').replace(/(^\s+|\s+$)/g,'' /*remove blank spaces from size value*/) : false};

        $scope.sizeChange = function(selectedSize) {

            localStorage.setItem('accessories.sidebar.size.selected', selectedSize);

            updatePage();
        };

        $scope.selectAllSports = function() {

            $scope.sports = AccessoriesSidebarService.selectAllSports();

            updatePage();
        };

        $scope.unselectAllSports = function() {

            $scope.sports = AccessoriesSidebarService.unselectAllSports();

            updatePage();
        };

        $scope.selectAllUsers = function() {

            $scope.users = AccessoriesSidebarService.selectAllUsers();

            updatePage();
        };

        $scope.unselectAllUsers = function() {

            $scope.users = AccessoriesSidebarService.unselectAllUsers();

            updatePage();
        };

        $scope.sizeReset = function() {

            // set the size select value to false to show all sizes
            localStorage.setItem('accessories.sidebar.size.selected', false);

            // set the value to false to show the "select a size" option
            $scope.size.selected = false;

            updatePage();
        };

        function updatePage () {

            if ( localStorage.getItem('accessories.sidebar.size.selected') == null || localStorage.getItem('accessories.sidebar.size.selected') == 'false' ) {
                // set the size select value to false to show all sizes
                localStorage.setItem('accessories.sidebar.size.selected', false);

                // set the value to false to show the "select a size" option
                $scope.size.selected = false;
            }

            // get the selected size by which to filter available accessories
            var selectedSize = localStorage.getItem('accessories.sidebar.size.selected'),

                tempAccessories = JSON.parse(localStorage.getItem('accessories.allAccessoriesProducts')),

                itemsPerPage = localStorage.getItem("itemsPerPage"),

                currentPage = localStorage.getItem("accessories.pagination.page"),

                /*  Filter available accessories based on user's selections */
                accessoriesProducts = AccessoriesSidebarService.accessoriesFilter(tempAccessories, $scope.types, $scope.sports, $scope.users, selectedSize);

            localStorage.setItem('accessories.availableAccessoriesProducts', JSON.stringify(accessoriesProducts.availableAccessories));

            var availableAccessoriesProducts = JSON.parse(localStorage.getItem('accessories.availableAccessoriesProducts'));

            // assign the number of products to a variable for pagination purposes
            $scope.totalItems = availableAccessoriesProducts.length;

            // all available accessories to display on all pages
            $scope.accessoriesProducts = availableAccessoriesProducts;

            // quantities to show next to selector values
            $scope.quantities = accessoriesProducts.quantities;

            // data array to be passed into the ViewData.page() function
            var data = [currentPage, itemsPerPage, $scope.accessoriesProducts],
                // set the products segment array for the current page
                accessoriesProductsShow = ViewData.page(data);

            localStorage.setItem('accessories.accessoriesProductsShow', JSON.stringify(accessoriesProductsShow));

            $scope.accessoriesProductsShow = JSON.parse(localStorage.getItem('accessories.accessoriesProductsShow'));
        };
    }]);
