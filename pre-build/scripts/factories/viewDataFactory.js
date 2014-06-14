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
            miscDataRoute        = "viewdata/miscdata",
            corporateInfoRoute   = "viewdata/corporateinfo",
            customServicesRoute  = "viewdata/customerservices",
            popularProductsRoute = "viewdata/popularproducts",

            // api get calls
            returnedData     = viewDataCollection.all(viewDataRoute).getList(),
            headerData       = viewDataCollection.one(headerRoute).get(),
            homeMainData     = viewDataCollection.one(homemainRoute).get(),
            shoesMainData    = viewDataCollection.one(shoesmainRoute).get(),
            miscViewData     = viewDataCollection.one(miscDataRoute).get(),
            corporateInfo    = viewDataCollection.one(corporateInfoRoute).get(),
            customerServices = viewDataCollection.one(customServicesRoute).get(),
            popularProducts  = viewDataCollection.one(popularProductsRoute).get();

            // set localStorage values to false if checkboxes are checked
        var sportsCheckboxes = {
            Running: {
                selected: localStorage.getItem('shoes.sidebar.sport.Running.selected') == "true" ? false : true
            },
            Training: {
                selected: localStorage.getItem('shoes.sidebar.sport.Training.selected') == "true" ? false : true
            },
            Basketball: {
                selected: localStorage.getItem('shoes.sidebar.sport.Basketball.selected') == "true" ? false : true
            },
            Football: {
                selected: localStorage.getItem('shoes.sidebar.sport.Football.selected') == "true" ? false : true
            },
            "Martial Arts": {
                selected: localStorage.getItem('shoes.sidebar.sport.MartialArts.selected') == "true" ? false : true
            }
        };

        var usersCheckboxes = {
            Male: {
                selected: localStorage.getItem('shoes.sidebar.user.Male.selected') == "true" ? false : true
            },
            Female: {
                selected: localStorage.getItem('shoes.sidebar.user.Female.selected') == "true" ? false : true
            },
            Kids: {
                selected: localStorage.getItem('shoes.sidebar.user.Kids.selected') == "true" ? false : true
            }
        };

        return {

            returnedData: returnedData,

            headerData: headerData,

            homeMainData: homeMainData,

            shoesMainData: shoesMainData,

            miscViewData: miscViewData,

            corporateInfo: corporateInfo,

            customerServices: customerServices,

            popularProducts: popularProducts,

            sportsCheckboxes: sportsCheckboxes,

            usersCheckboxes: usersCheckboxes,

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
            },

            processCheckbox : function(checkbox, currentValue) {
                /*
                 * store the checkbox value in localstorage
                 */

                switch (checkbox) {
                    case "Running":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('shoes.sidebar.sport.Running.selected', currentValue);
                        break;
                    case "Training":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('shoes.sidebar.sport.Training.selected', currentValue);
                        break;
                    case "Basketball":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('shoes.sidebar.sport.Basketball.selected', currentValue);
                        break;
                    case "Football":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('shoes.sidebar.sport.Football.selected', currentValue);
                        break;
                    case "Martial Arts":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('shoes.sidebar.sport.MartialArts.selected', currentValue);
                        break;
                        case "Male":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('shoes.sidebar.user.Male.selected', currentValue);
                        break;
                    case "Female":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('shoes.sidebar.user.Female.selected', currentValue);
                        break;
                    case "Kids":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('shoes.sidebar.user.Kids.selected', currentValue);
                        break;
                }
            }
        }
    }]);
