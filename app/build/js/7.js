angular.module("factories").factory("ViewData",["Restangular",function(a){var b="/api",c="viewdata",d=a.withConfig(function(a){a.setBaseUrl(b)}),e=d.all(c).getList();return headerRoute="viewdata/header",headerData=d.one(headerRoute).get(),homeMainRoute="viewdata/homemain",homeMainData=d.one(homeMainRoute).get(),miscViewDataRoute="viewdata/miscdata",miscViewData=d.one(miscViewDataRoute).get(),corporateInfoRoute="viewdata/corporateinfo",corporateInfo=d.one(corporateInfoRoute).get(),customerServicesRoute="viewdata/customerservices",customerServices=d.one(customerServicesRoute).get(),popularProductsRoute="viewdata/popularproducts",popularProducts=d.one(popularProductsRoute).get(),{returnedData:e,headerData:headerData,homeMainData:homeMainData,miscViewData:miscViewData,corporateInfo:corporateInfo,customerServices:customerServices,popularProducts:popularProducts,newsletterSignup:function(a){console.log("Email: "+a+" received by ViewData newsletterSignup function")}}}]).factory("ProductsFactory",["Restangular",function(a){var b="/api",c="products",d=a.withConfig(function(a){a.setBaseUrl(b)}),e=d.all(c).getList();return{getAll:e}}]);