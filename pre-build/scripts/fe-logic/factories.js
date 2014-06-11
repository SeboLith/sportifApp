angular.module("factories").factory("ViewData", ["Restangular", function (Restangular) {
    var baseUrl = "/api",
        viewDataCollection = Restangular.withConfig(function (configurer) {
            configurer.setBaseUrl(baseUrl)
        }),
        viewDataRoute = "viewdata",
        headerRoute = "viewdata/header",
        homemainRoute = "viewdata/homemain",
        miscDataRoute = "viewdata/miscdata",
        corporateInfoRoute = "viewdata/corporateinfo",
        customServicesRoute = "viewdata/customerservices",
        popularProductsRoute = "viewdata/popularproducts",

        returnedData = viewDataCollection.all(viewDataRoute).getList(),
        headerData = viewDataCollection.one(headerRoute).get(),
        homeMainData = viewDataCollection.one(homemainRoute).get(),
        miscViewData = viewDataCollection.one(miscDataRoute).get(),
        corporateInfo = viewDataCollection.one(corporateInfoRoute).get(),
        customerServices = viewDataCollection.one(customServicesRoute).get(),
        popularProducts = viewDataCollection.one(popularProductsRoute).get();

    return {
        returnedData: returnedData,
        headerData: headerData,
        homeMainData: homeMainData,
        miscViewData: miscViewData,
        corporateInfo: corporateInfo,
        customerServices: customerServices,
        popularProducts: popularProducts,
        newsletterSignup: function (email) {
            console.log("Email: " + email + " received by ViewData newsletterSignup function")
        }
    }
}]).factory("ProductsFactory", ["Restangular", function (Restangular) {
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
