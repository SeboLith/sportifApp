/* globals app, Sportif, $, globals */

/* Services */

angular.module('factories')
    /*
        VIEWDATA FACTORY
    ----------------------------------------------------------------------------
    ============================================================================ */
    .factory('ViewData', ['Restangular', function (Restangular) {

        var baseUrl = '/api',
            viewdataCollection = Restangular.withConfig(function(Configurer) {
                Configurer.setBaseUrl(baseUrl);
            }),
            /* all records in ViewData */
            dbRoute = 'viewdata',
            /* Header record in ViewData */
            headerRoute = 'viewdata/header',
            /* HomeMain record in ViewData */
            homeMainRoute = 'viewdata/homemain',
            /* MiscData record in ViewData */
            miscViewDataRoute = 'viewdata/miscdata',
            /* CorporateInfo record in ViewData */
            corporateInfoRoute = 'viewdata/corporateinfo',
            /* CustomerServices record in ViewData */
            customerServicesRoute = 'viewdata/customerservices',
            /* PopularProducts record in ViewData */
            popularProductsRoute = 'viewdata/popularproducts';


        var returnedData = viewdataCollection.all(dbRoute).getList(),
            headerData = viewdataCollection.one(headerRoute).get(),
            homeMainData = viewdataCollection.one(homeMainRoute).get(),
            miscViewData = viewdataCollection.one(miscViewDataRoute).get(),
            corporateInfo = viewdataCollection.one(corporateInfoRoute).get(),
            customerServices = viewdataCollection.one(customerServicesRoute).get(),
            popularProducts = viewdataCollection.one(popularProductsRoute).get();

        return {
            // return the unwrapped viewData promise from the db
            returnedData: returnedData,
            // return the unwrapped headerData promise from the db
            headerData: headerData,
            // return the unwrapped homeMainData promise from the db
            homeMainData: homeMainData,
            // return the unwrapped miscViewData promise from the db
            miscViewData: miscViewData,
            // return the unwrapped corporateInfo promise from the db
            corporateInfo: corporateInfo,
            // return the unwrapped customerServices promise from the db
            customerServices: customerServices,
            // return the unwrapped popularProducts promise from the db
            popularProducts: popularProducts,
            // process email requesting to subscribe to newsletter
            newsletterSignup: function (email) {
                console.log("Email: "+email+" received by ViewData newsletterSignup function");
            }
        };
      }])
    /*
        PRODUCTS FACTORY
    ----------------------------------------------------------------------------
    ============================================================================ */
    .factory('ProductsFactory', ['Restangular', function (Restangular) {
        var baseUrl = '/api',
            /* Products */
            productsCollection = Restangular.withConfig(function(Configurer) {
                Configurer.setBaseUrl(baseUrl);
            }),
            /* all records in Products */
            dbRoute = 'products';

        var returnedData = productsCollection.all(dbRoute).getList();

        // function updateProduct (product) {
        //   find the specified Restangular object
        //   var productToUpdate = productsCollection.one(dbRoute, product._id);
        //   build the Restangular object with the specified values

        //   productToUpdate.manufacturer = product.manufacturer;
        //   productToUpdate.name = product.name;
        //   productToUpdate.color = product.color;
        //   productToUpdate.style = product.style;
        //   productToUpdate.vendor = product.vendor;
        //   productToUpdate.upc = product.upc;
        //   productToUpdate.sku = product.sku;
        //   productToUpdate.image = product.image;
        //   productToUpdate.url = product.url;
        //   productToUpdate.category = product.category;
        //   productToUpdate.sub_category = product.sub_category;
        //   productToUpdate.for = product.for;
        //   productToUpdate.sport = product.sport;
        //   productToUpdate.description = product.description;
        //   productToUpdate.short_description = product.short_description;
        //   productToUpdate.suggestedPrice = product.suggestedPrice;
        //   productToUpdate.listPrice = product.listPrice;
        //   productToUpdate.salePrice = product.salePrice;
        //   productToUpdate.available = product.available;
        //   productToUpdate.on_sale = product.on_sale;
        //   productToUpdate.stock = product.stock;
        //   productToUpdate.sizes = product.sizes;
        //   // return the Restangular object
        //   return productToUpdate;
        // };

        return {
            // return unwrapped promise of all products to controller
          // getAll: collection.all(dbRoute).getList(),
          getAll: returnedData,

          // getOne: function(product_id) {
          //   // return unwrapped promise of specified product to controller
          //   return collection.one(dbRoute, product_id).get();
          // },
          // update: function(product) {
          //   // update the Restangular object
          //   updateProduct(product).put();
          //   // return the full list of products
          //   return collection.all(dbRoute).getList();
          // },
          // create: function(product) {
          //   collection.all(dbRoute).post(product);
          //   // return the full list of members
          //   return collection.all(dbRoute).getList();
          // }
        }
      }]);

