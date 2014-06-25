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

        $scope.shoes = {};

        ViewData.shoesMainData.then(function(shoesMainData){

            var promise = shoesMainData.data.values;

            $scope.sidebarData = promise.sidebarData;
        });

        // set the number of items per page
        localStorage.setItem("itemsPerPage", 12);
        $scope.itemsPerPage = localStorage.getItem("itemsPerPage");

        ProductsFactory.getAll.then(function(data){

            // temp array to hold all shoes
            var tempShoes = [];

            // filter products and assign all shoes to tempShoes
            data.forEach( function (product) {
                switch (product.category) {
                    case "Shoes":
                        tempShoes.push(product);
                        break;
                }
            });

            // assign all products to localStorage variable
            localStorage.setItem('shoes.allShoesProducts', JSON.stringify(tempShoes));

            // temp array to hold available shoes
            var shoesProducts = [];

            // filter shoes and assign available shoes to $scope.shoesProducts
            tempShoes.forEach( function (shoe) {
                switch (shoe.available) {
                    case true:
                        shoesProducts.push(shoe);
                        break;
                }
            });

            // assign all available products to localStorage variable
            localStorage.setItem('shoes.availableShoesProducts', JSON.stringify(shoesProducts));
            updatePage();
        });

        // get the current page using local storage; if none exists, set it to 1
        $scope.shoes.currentPage = localStorage.getItem("shoes.pagination.page") && localStorage.getItem("shoes.pagination.page") != 'undefined' ? localStorage.getItem("shoes.pagination.page") : 1;

        // watch for the change in current page to update the products per page
        $scope.$watch("shoes.currentPage", function() {

            // set the current page using local storage
            localStorage.setItem("shoes.pagination.page", $scope.shoes.currentPage);

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

        $scope.selectAllSports = function() {

            $scope.sports = ShoesSidebarService.selectAllSports();

            updatePage();
        };

        $scope.unselectAllSports = function() {

            $scope.sports = ShoesSidebarService.unselectAllSports();

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

            if ( localStorage.getItem('shoes.sidebar.size.selected') == null || localStorage.getItem('shoes.sidebar.size.selected') == 'false' ) {
                // set the size select value to false to show all sizes
                localStorage.setItem('shoes.sidebar.size.selected', false);

                // set the value to false to show the "select a size" option
                $scope.size.selected = false;
            }

            // get the selected size by which to filter available shoes
            var selectedSize = localStorage.getItem('shoes.sidebar.size.selected'),

                tempShoes = JSON.parse(localStorage.getItem('shoes.allShoesProducts')),

                itemsPerPage = localStorage.getItem("itemsPerPage"),

                currentPage = localStorage.getItem("shoes.pagination.page"),

                /*  Filter available shoes based on user's selections */
                shoesProducts = ShoesSidebarService.shoesFilter(tempShoes, $scope.sports, $scope.users, selectedSize);

            localStorage.setItem('shoes.availableShoesProducts', JSON.stringify(shoesProducts.availableShoes));

            var availableShoesProducts = JSON.parse(localStorage.getItem('shoes.availableShoesProducts'));

            // assign the number of products to a variable for pagination purposes
            $scope.totalItems = availableShoesProducts.length;

            // all available shoes to display on all pages
            $scope.shoesProducts = availableShoesProducts;

            // quantities to show next to selector values
            $scope.quantities = shoesProducts.quantities;

            // data array to be passed into the ViewData.page() function
            var data = [currentPage, itemsPerPage, $scope.shoesProducts],
                // set the products segment array for the current page
                shoesProductsShow = ViewData.page(data);

            localStorage.setItem('shoes.shoesProductsShow', JSON.stringify(shoesProductsShow));

            $scope.shoesProductsShow = JSON.parse(localStorage.getItem('shoes.shoesProductsShow'));
        };
    }]);
