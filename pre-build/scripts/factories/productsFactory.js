'use strict';

/* Factories */
angular.module('factories')
    /*
        PRODUCTS FACTORY
    ----------------------------------------------------------------------------
    ============================================================================ */
    .factory("ProductsFactory", ["Restangular", function (Restangular) {
        var baseUrl = "/api",
            productsCollection = Restangular.withConfig(function (configurer) {
                configurer.setBaseUrl(baseUrl)
            }),
            productsRoute = "products",
            returnedData = productsCollection.all(productsRoute).getList();
        return {
            getAll: returnedData
        }
    }]);
