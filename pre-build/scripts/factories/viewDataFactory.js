'use strict';

/* Factories */
angular.module('factories')
    /*
        VIEWDATA FACTORY
    ----------------------------------------------------------------------------
    ============================================================================ */
    .factory("ViewData", ["Restangular", function (Restangular) {

        var baseUrl = "/api",

            // configure Restangular object with baseUrl
            viewDataCollection = Restangular.withConfig(function (configurer) {
                configurer.setBaseUrl(baseUrl)
            }),

            // api routes
            viewDataRoute        = "viewdata",
            headerRoute          = "viewdata/header",
            homemainRoute        = "viewdata/homemain",
            shoesmainRoute       = "viewdata/shoesmain",
            clothingmainRoute    = "viewdata/clothingmain",
            accessoriesmainRoute = "viewdata/accessoriesmain",
            menmainRoute         = "viewdata/menmain",
            miscDataRoute        = "viewdata/miscdata",
            corporateInfoRoute   = "viewdata/corporateinfo",
            customServicesRoute  = "viewdata/customerservices",
            popularProductsRoute = "viewdata/popularproducts",

            // api get calls
            returnedData        = viewDataCollection.all(viewDataRoute).getList(),
            headerData          = viewDataCollection.one(headerRoute).get(),
            homeMainData        = viewDataCollection.one(homemainRoute).get(),
            shoesMainData       = viewDataCollection.one(shoesmainRoute).get(),
            clothingMainData    = viewDataCollection.one(clothingmainRoute).get(),
            accessoriesMainData = viewDataCollection.one(accessoriesmainRoute).get(),
            menMainData         = viewDataCollection.one(menmainRoute).get(),
            miscViewData        = viewDataCollection.one(miscDataRoute).get(),
            corporateInfo       = viewDataCollection.one(corporateInfoRoute).get(),
            customerServices    = viewDataCollection.one(customServicesRoute).get(),
            popularProducts     = viewDataCollection.one(popularProductsRoute).get(),

            ieLt9               = (navigator.appName == 'Microsoft Internet Explorer' && !document.addEventListener);

        return {

            returnedData: returnedData,

            headerData: headerData,

            homeMainData: homeMainData,

            shoesMainData: shoesMainData,

            clothingMainData: clothingMainData,

            accessoriesMainData: accessoriesMainData,

            menMainData: menMainData,

            miscViewData: miscViewData,

            corporateInfo: corporateInfo,

            customerServices: customerServices,

            popularProducts: popularProducts,

            ieLt9: ieLt9,

            newsletterSignup: function (email) {

                console.log("Email: " + email + " received by ViewData newsletterSignup function")
            },

            page : function(data) {
                /*
                 * data[0] = currentPage
                 * data[1] = itemsPerPage
                 * data[1] = $scope.Members[]
                 */

                // when paginating, reset the beginning and end of the members array segment
                var sliceStart = (data[0] * data[1]) - data[1];
                var sliceEnd = data[0] * data[1];

                return data[2].slice(sliceStart, sliceEnd);
            }
        }
    }]);
