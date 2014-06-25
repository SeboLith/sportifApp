'use strict';

/* Controllers */
angular.module('controllers')
    /*
        MEN CONTROLLER
    ----------------------------------------------------------------------------
    ============================================================================ */
    .controller('MenCtrl', ['$scope', "$injector", function ($scope, $injector){

        var MenSidebarService = $injector.get("MenSidebarService"),
            ViewData          = $injector.get("ViewData"),
            ProductsFactory   = $injector.get("ProductsFactory");

        $scope.men = {};

        ViewData.menMainData.then(function(menMainData){

            var promise = menMainData.data.values;

            $scope.sidebarData = promise.sidebarData;
        });

        // set the number of items per page
        localStorage.setItem("itemsPerPage", 12);
        $scope.itemsPerPage = localStorage.getItem("itemsPerPage");

        ProductsFactory.getAll.then(function(data){
            // temp array to hold all men
            var tempMen = [];

            // filter products and assign all men to tempMen
            data.forEach( function (product) {
                switch (product.user) {
                    case "Men":
                        tempMen.push(product);
                        break;
                }
            });

            // assign all products to localStorage variable
            localStorage.setItem('men.allMensProducts', JSON.stringify(tempMen));

            // temp array to hold available men
            var menProducts = [];

            // filter men and assign available men to $scope.menProducts
            tempMen.forEach( function (item) {
                switch (item.available) {
                    case true:
                        menProducts.push(item);
                        break;
                }
            });

            // assign all available products to localStorage variable
            localStorage.setItem('men.availableMensProducts', JSON.stringify(menProducts));
            updatePage();
        });

        // get the current page using local storage; if none exists, set it to 1
        $scope.men.currentPage = localStorage.getItem("men.pagination.page") && localStorage.getItem("men.pagination.page") != 'undefined' ? localStorage.getItem("men.pagination.page") : 1;

        // watch for the change in current page to update the products per page
        $scope.$watch("men.currentPage", function() {

            // set the current page using local storage
            localStorage.setItem("men.pagination.page", $scope.men.currentPage);

            updatePage();
        });

        /* default selected values for types checkboxes */
        $scope.products = MenSidebarService.productsCheckboxes;

        $scope.productSelected = function(checkbox, currentValue) {

            // change the selected value of "this" checkbox
            // from the current value to its opposite
            $scope.products[checkbox].selected = !currentValue;

            // store the checkbox's value in localstorage
            MenSidebarService.processCheckbox(checkbox, currentValue);

            updatePage();
        };

        /* default selected values for sports checkboxes */
        $scope.sports = MenSidebarService.sportsCheckboxes;

        $scope.sportSelected = function(checkbox, currentValue) {

            // change the selected value of "this" checkbox
            // from the current value to its opposite
            $scope.sports[checkbox].selected = !currentValue;

            // store the checkbox's value in localstorage
            MenSidebarService.processCheckbox(checkbox, currentValue);

            updatePage();
        };

        $scope.selectAllSports = function() {

            $scope.sports = MenSidebarService.selectAllSports();

            updatePage();
        };

        $scope.unselectAllSports = function() {

            $scope.sports = MenSidebarService.unselectAllSports();

            updatePage();
        };

        /* default selected values for types checkboxes */
        $scope.types = MenSidebarService.typesCheckboxes;

        $scope.typeSelected = function(checkbox, currentValue) {

            // change the selected value of "this" checkbox
            // from the current value to its opposite
            $scope.types[checkbox].selected = !currentValue;

            // store the checkbox's value in localstorage
            MenSidebarService.processCheckbox(checkbox, currentValue);

            updatePage();
        };

        $scope.selectAllTypes = function() {

            $scope.types = MenSidebarService.selectAllTypes();

            updatePage();
        };

        $scope.unselectAllTypes = function() {

            $scope.types = MenSidebarService.unselectAllTypes();

            updatePage();
        };

        $scope.size = {selected: localStorage.getItem('men.sidebar.size.selected') ? localStorage.getItem('men.sidebar.size.selected').replace(/(^\s+|\s+$)/g,'' /*remove blank spaces from size value*/) : false};

        $scope.sizeChange = function(selectedSize) {

            localStorage.setItem('men.sidebar.size.selected', selectedSize);

            updatePage();
        };

        $scope.sizeReset = function() {

            // set the size select value to false to show all sizes
            localStorage.setItem('men.sidebar.size.selected', false);

            // set the value to false to show the "select a size" option
            $scope.size.selected = false;

            updatePage();
        };

        function updatePage () {

            if ( localStorage.getItem('men.sidebar.size.selected') == null || localStorage.getItem('men.sidebar.size.selected') == 'false' ) {
                // set the size select value to false to show all sizes
                localStorage.setItem('men.sidebar.size.selected', false);

                // set the value to false to show the "select a size" option
                $scope.size.selected = false;
            }

            // get the selected size by which to filter available men
            var selectedSize = localStorage.getItem('men.sidebar.size.selected'),

                tempMen = JSON.parse(localStorage.getItem('men.allMensProducts')),

                itemsPerPage = localStorage.getItem("itemsPerPage"),

                currentPage = localStorage.getItem("men.pagination.page"),

                /*  Filter available men based on mens selections */
                menProducts = MenSidebarService.menFilter(tempMen, $scope.products, $scope.sports, $scope.types, selectedSize);

            localStorage.setItem('men.availableMensProducts', JSON.stringify(menProducts.availableMensProducts));

            var availableMensProducts = JSON.parse(localStorage.getItem('men.availableMensProducts'));

            // assign the number of products to a variable for pagination purposes
            $scope.totalItems = availableMensProducts.length;

            // all available men to display on all pages
            $scope.menProducts = availableMensProducts;

            // quantities to show next to selector values
            $scope.quantities = menProducts.quantities;

            // data array to be passed into the ViewData.page() function
            var data = [currentPage, itemsPerPage, $scope.menProducts],
                // set the products segment array for the current page
                menProductsShow = ViewData.page(data);

            localStorage.setItem('men.menProductsShow', JSON.stringify(menProductsShow));

            $scope.menProductsShow = JSON.parse(localStorage.getItem('men.menProductsShow'));
            /*
            */
        };
    }]);
