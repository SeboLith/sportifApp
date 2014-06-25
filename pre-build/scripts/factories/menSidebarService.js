'use strict';

/* Factories */
angular.module('factories')
    /*
        MEN SIDEBAR SERVICE
    ----------------------------------------------------------------------------
    ============================================================================ */
    .factory("MenSidebarService", [function () {

        var productsCheckboxes = {
            Shoes: {
                selected: localStorage.getItem('men.sidebar.product.Shoes.unselected') == "true" ? false : true
            },
            Clothing: {
                selected: localStorage.getItem('men.sidebar.product.Clothing.unselected') == "true" ? false : true
            },
            Accessories: {
                selected: localStorage.getItem('men.sidebar.product.Accessories.unselected') == "true" ? false : true
            }
        };

            // set localStorage values to false if checkboxes are checked
        var sportsCheckboxes = {
            Running: {
                selected: localStorage.getItem('men.sidebar.sport.Running.unselected') == "true" ? false : true
            },
            Training: {
                selected: localStorage.getItem('men.sidebar.sport.Training.unselected') == "true" ? false : true
            },
            Basketball: {
                selected: localStorage.getItem('men.sidebar.sport.Basketball.unselected') == "true" ? false : true
            },
            Football: {
                selected: localStorage.getItem('men.sidebar.sport.Football.unselected') == "true" ? false : true
            },
            "Martial Arts": {
                selected: localStorage.getItem('men.sidebar.sport.MartialArts.unselected') == "true" ? false : true
            },
            "Any Sport": {
                selected: localStorage.getItem('men.sidebar.sport.Any.unselected') == "true" ? false : true
            }
        };

            // set localStorage values to false if checkboxes are checked
        var typesCheckboxes = {
            Headbands: {
                selected: localStorage.getItem('men.sidebar.type.Headbands.unselected') == "true" ? false : true
            },
            Socks: {
                selected: localStorage.getItem('men.sidebar.type.Socks.unselected') == "true" ? false : true
            },
            Towels: {
                selected: localStorage.getItem('men.sidebar.type.Towels.unselected') == "true" ? false : true
            },
            Belts: {
                selected: localStorage.getItem('men.sidebar.type.Belts.unselected') == "true" ? false : true
            },
            Bags: {
                selected: localStorage.getItem('men.sidebar.type.Bags.unselected') == "true" ? false : true
            },
            Hats: {
                selected: localStorage.getItem('men.sidebar.type.Hats.unselected') == "true" ? false : true
            },
            Bottles: {
                selected: localStorage.getItem('men.sidebar.type.Bottles.unselected') == "true" ? false : true
            },
            Glasses: {
                selected: localStorage.getItem('men.sidebar.type.Glasses.unselected') == "true" ? false : true
            },
            Lamps: {
                selected: localStorage.getItem('men.sidebar.type.Lamps.unselected') == "true" ? false : true
            },
            "Jersey Shirts": {
                selected: localStorage.getItem('men.sidebar.type.JerseyShirts.unselected') == "true" ? false : true
            },
            "Jersey Shorts": {
                selected: localStorage.getItem('men.sidebar.type.JerseyShorts.unselected') == "true" ? false : true
            },
            Tights: {
                selected: localStorage.getItem('men.sidebar.type.Tights.unselected') == "true" ? false : true
            },
            Tees: {
                selected: localStorage.getItem('men.sidebar.type.Tees.unselected') == "true" ? false : true
            },
            "Tank Tops": {
                selected: localStorage.getItem('men.sidebar.type.TankTops.unselected') == "true" ? false : true
            }
        };

        var sizeSelections = {
            small: {
                selected: localStorage.getItem('men.sidebar.size.selected') == "small" ? true : false
            },
            medium: {
                selected: localStorage.getItem('men.sidebar.size.selected') == "medium" ? true : false
            },
            large: {
                selected: localStorage.getItem('men.sidebar.size.selected') == "large" ? true : false
            },
            "x-large": {
                selected: localStorage.getItem('men.sidebar.size.selected') == "x-large" ? true : false
            },
            "2x-large": {
                selected: localStorage.getItem('men.sidebar.size.selected') == "2x-large" ? true : false
            },
            "N/A": {
                selected: localStorage.getItem('men.sidebar.size.selected') == "N/A" ? true : false
            }
        };

        return {

            productsCheckboxes : productsCheckboxes,

            sportsCheckboxes   : sportsCheckboxes,

            typesCheckboxes    : typesCheckboxes,

            sizeSelections     : sizeSelections,

            menFilter : function(tempMensProducts, products, sports, types, selectedSize) {

                var availableMensProducts = [],
                    checkboxSelections    = [],
                    matchedSizes          = [],
                    mensProducts          = {availableMensProducts: [], quantities: {}},

                    shoesVal           = {
                            selector   : "Shoes",
                            category   : "Products",
                            val        : products.Shoes.selected,
                            updatedQty : 0
                    },
                    clothingVal        = {
                            selector   : "Clothing",
                            category   : "Products",
                            val        : products.Clothing.selected,
                            updatedQty : 0
                    },
                    accessoriesVal     = {
                            selector   : "Accessories",
                            category   : "Products",
                            val        : products.Accessories.selected,
                            updatedQty : 0
                    },
                    runningVal         = {
                            selector   : "Running",
                            category   : "Sports",
                            val        : sports.Running.selected,
                            updatedQty : 0
                    },
                    trainingVal        = {
                            selector   : "Training",
                            category   : "Sports",
                            val        : sports.Training.selected,
                            updatedQty : 0
                    },
                    basketballVal      = {
                            selector   : "Basketball",
                            category   : "Sports",
                            val        : sports.Basketball.selected,
                            updatedQty : 0
                    },
                    footballVal        = {
                            selector   : "Football",
                            category   : "Sports",
                            val        : sports.Football.selected,
                            updatedQty : 0
                    },
                    martialArtsVal     = {
                            selector   : "Martial Arts",
                            category   : "Sports",
                            val        : sports["Martial Arts"].selected,
                            updatedQty : 0
                    },
                    anySportVal        = {
                            selector   : "Any Sport",
                            category   : "Sports",
                            val        : sports["Any Sport"].selected,
                            updatedQty : 0
                    },
                    headbandsVal       = {
                            selector   : "Headbands",
                            category   : "Types",
                            val        : types.Headbands.selected,
                            updatedQty : 0
                    },
                    socksVal           = {
                            selector   : "Socks",
                            category   : "Types",
                            val        : types.Socks.selected,
                            updatedQty : 0
                    },
                    towelsVal          = {
                            selector   : "Towels",
                            category   : "Types",
                            val        : types.Towels.selected,
                            updatedQty : 0
                    },
                    beltsVal           = {
                            selector   : "Belts",
                            category   : "Types",
                            val        : types.Belts.selected,
                            updatedQty : 0
                    },
                    bagsVal            = {
                            selector   : "Bags",
                            category   : "Types",
                            val        : types.Bags.selected,
                            updatedQty : 0
                    },
                    hatsVal            = {
                            selector   : "Hats",
                            category   : "Types",
                            val        : types.Hats.selected,
                            updatedQty : 0
                    },
                    bottlesVal         = {
                            selector   : "Bottles",
                            category   : "Types",
                            val        : types.Bottles.selected,
                            updatedQty : 0
                    },
                    glassesVal         = {
                            selector   : "Glasses",
                            category   : "Types",
                            val        : types.Glasses.selected,
                            updatedQty : 0
                    },
                    lampsVal           = {
                            selector   : "Lamps",
                            category   : "Types",
                            val        : types.Lamps.selected,
                            updatedQty : 0
                    },
                    jerseyShirtsVal    = {
                            selector   : "Jersey Shirts",
                            category   : "Types",
                            val        : types["Jersey Shirts"].selected,
                            updatedQty : 0
                    },
                    jerseyShortsVal    = {
                            selector   : "Jersey Shorts",
                            category   : "Types",
                            val        : types["Jersey Shorts"].selected,
                            updatedQty : 0
                    },
                    tightsVal          = {
                            selector   : "Tights",
                            category   : "Types",
                            val        : types.Tights.selected,
                            updatedQty : 0
                    },
                    teesVal            = {
                            selector   : "Tees",
                            category   : "Types",
                            val        : types.Tees.selected,
                            updatedQty : 0
                    },
                    tankTopsVal        = {
                            selector   : "Tank Tops",
                            category   : "Types",
                            val        : types["Tank Tops"].selected,
                            updatedQty : 0
                    },
                    sizeVal            = {
                            selector   : "Accessories Size",
                            category   : "Size",
                            val        : selectedSize.replace(/(^\s+|\s+$)/g,'') /*remove blank spaces from size value*/,
                            updatedQty : 0
                    };

                // build an array of checkbox selections to compare against mens products
                checkboxSelections.push(shoesVal);
                checkboxSelections.push(clothingVal);
                checkboxSelections.push(accessoriesVal);
                checkboxSelections.push(runningVal);
                checkboxSelections.push(trainingVal);
                checkboxSelections.push(basketballVal);
                checkboxSelections.push(footballVal);
                checkboxSelections.push(martialArtsVal);
                checkboxSelections.push(anySportVal);
                checkboxSelections.push(headbandsVal);
                checkboxSelections.push(socksVal);
                checkboxSelections.push(towelsVal);
                checkboxSelections.push(beltsVal);
                checkboxSelections.push(bagsVal);
                checkboxSelections.push(hatsVal);
                checkboxSelections.push(bottlesVal);
                checkboxSelections.push(glassesVal);
                checkboxSelections.push(lampsVal);
                checkboxSelections.push(jerseyShirtsVal);
                checkboxSelections.push(jerseyShortsVal);
                checkboxSelections.push(tightsVal);
                checkboxSelections.push(teesVal);
                checkboxSelections.push(tankTopsVal);

                // assign available men's products to an array
                tempMensProducts.forEach( function (item) {
                    switch (item.available) {
                        case true:
                            availableMensProducts.push(item);
                            break;
                    }
                });

                // compare checkbox selections against item values
                checkboxSelections.forEach( function (checkbox) {
                    switch (checkbox.val) {
                        case false:
                            matchByProduct(checkbox);
                            matchBySport(checkbox);
                            matchByType(checkbox);
                            break;
                    }
                });

                function matchByProduct (checkbox) {
                    // remove every element matching the deselected product from the available men's products array
                    for (var i = availableMensProducts.length - 1; i >= 0; i--) {
                        if (availableMensProducts[i].category === checkbox.selector) {
                           availableMensProducts.splice(i, 1);
                        }
                    }
                };

                function matchBySport (checkbox) {
                    // remove every element matching the deselected sport from the available men's products array
                    for (var i = availableMensProducts.length - 1; i >= 0; i--) {
                        if (availableMensProducts[i].activity === checkbox.selector) {
                           availableMensProducts.splice(i, 1);
                        }
                    }
                };

                function matchByType (checkbox) {
                    // remove every element matching the deselected sport from the available men's products array
                    for (var i = availableMensProducts.length - 1; i >= 0; i--) {
                        if (availableMensProducts[i].sub_category === checkbox.selector) {
                           availableMensProducts.splice(i, 1);
                        }
                    }
                };

                Array.prototype.contains = function ( needle ) {
                   for (var i in this) {
                       if (this[i] == needle) return true;
                   }
                   return false;
                };

                function matchBySize () {
                    // remove every element matching the deselected user from the available men's products array
                    for (var i = availableMensProducts.length - 1; i >= 0; i--) {

                        if (availableMensProducts[i].sizes.contains(sizeVal.val)) {
                            matchedSizes.push(availableMensProducts[i]);
                        }
                    }

                    if (matchedSizes.length > 0) availableMensProducts = matchedSizes;

                    else if (sizeVal.val == "false") return

                    else availableMensProducts = [];

                };
                matchBySize();

                function updateProductQuantity () {
                    // remove every element matching the deselected user from the available men's products array
                    availableMensProducts.forEach( function (item) {
                        switch (item.category) {
                            case "Shoes":
                                shoesVal.updatedQty += 1;
                                break;
                            case "Clothing":
                                clothingVal.updatedQty += 1;
                                break;
                            case "Accessories":
                                accessoriesVal.updatedQty += 1;
                                break;
                        }
                        switch (item.activity) {
                            case "Running":
                                runningVal.updatedQty += 1;
                                break;
                            case "Training":
                                trainingVal.updatedQty += 1;
                                break;
                            case "Basketball":
                                basketballVal.updatedQty += 1;
                                break;
                            case "Football":
                                footballVal.updatedQty += 1;
                                break;
                            case "Martial Arts":
                                martialArtsVal.updatedQty += 1;
                                break;
                            case "Any Sport":
                                anySportVal.updatedQty += 1;
                                break;
                        }
                        switch (item.sub_category) {
                            case "Headbands":
                                headbandsVal.updatedQty += 1;
                                break;
                            case "Socks":
                                socksVal.updatedQty += 1;
                                break;
                            case "Towels":
                                towelsVal.updatedQty += 1;
                                break;
                            case "Belts":
                                beltsVal.updatedQty += 1;
                                break;
                            case "Bags":
                                bagsVal.updatedQty += 1;
                                break;
                            case "Hats":
                                hatsVal.updatedQty += 1;
                                break;
                            case "Bottles":
                                bottlesVal.updatedQty += 1;
                                break;
                            case "Glasses":
                                glassesVal.updatedQty += 1;
                                break;
                            case "Lamps":
                                lampsVal.updatedQty += 1;
                                break;
                            case "Jersey Shirts":
                                jerseyShirtsVal.updatedQty += 1;
                                break;
                            case "Jersey Shorts":
                                jerseyShortsVal.updatedQty += 1;
                                break;
                            case "Tights":
                                tightsVal.updatedQty += 1;
                                break;
                            case "Tees":
                                teesVal.updatedQty += 1;
                                break;
                            case "Tank Tops":
                                tankTopsVal.updatedQty += 1;
                                break;
                        }
                    });
                };
                updateProductQuantity();

                mensProducts.availableMensProducts       = availableMensProducts;
                mensProducts.quantities.Shoes            = shoesVal.updatedQty;
                mensProducts.quantities.Clothing         = clothingVal.updatedQty;
                mensProducts.quantities.Accessories      = accessoriesVal.updatedQty;
                mensProducts.quantities.Running          = runningVal.updatedQty;
                mensProducts.quantities.Training         = trainingVal.updatedQty;
                mensProducts.quantities.Basketball       = basketballVal.updatedQty;
                mensProducts.quantities.Football         = footballVal.updatedQty;
                mensProducts.quantities["Martial Arts"]  = martialArtsVal.updatedQty;
                mensProducts.quantities["Any Sport"]     = anySportVal.updatedQty;
                mensProducts.quantities.Headbands        = headbandsVal.updatedQty;
                mensProducts.quantities.Socks            = socksVal.updatedQty;
                mensProducts.quantities.Towels           = towelsVal.updatedQty;
                mensProducts.quantities.Belts            = beltsVal.updatedQty;
                mensProducts.quantities.Bags             = bagsVal.updatedQty;
                mensProducts.quantities.Hats             = hatsVal.updatedQty;
                mensProducts.quantities.Bottles          = bottlesVal.updatedQty;
                mensProducts.quantities.Glasses          = glassesVal.updatedQty;
                mensProducts.quantities.Lamps            = lampsVal.updatedQty;
                mensProducts.quantities["Jersey Shirts"] = jerseyShirtsVal.updatedQty;
                mensProducts.quantities["Jersey Shorts"] = jerseyShortsVal.updatedQty;
                mensProducts.quantities.Tights           = tightsVal.updatedQty;
                mensProducts.quantities.Tees             = teesVal.updatedQty;
                mensProducts.quantities["Tank Tops"]     = tankTopsVal.updatedQty;

                return mensProducts;
            },

            selectAllSports : function() {

                var sportsCheckboxes = {
                        Running        : 'men.sidebar.sport.Running.unselected',
                        Training       : 'men.sidebar.sport.Training.unselected',
                        Basketball     : 'men.sidebar.sport.Basketball.unselected',
                        Football       : 'men.sidebar.sport.Football.unselected',
                        "Martial Arts" : 'men.sidebar.sport.MartialArts.unselected',
                        "Any Sport"    : 'men.sidebar.sport.AnySport.unselected'
                    },
                    returnedCheckboxes = {};

                for (var key in sportsCheckboxes) {

                    var value = localStorage.getItem(sportsCheckboxes[key]);

                    localStorage.setItem(sportsCheckboxes[key], false);

                    returnedCheckboxes[key] = {selected: true}
               };

               return returnedCheckboxes;
            },

            unselectAllSports : function() {

                var sportsCheckboxes = {
                        Running        : 'men.sidebar.sport.Running.unselected',
                        Training       : 'men.sidebar.sport.Training.unselected',
                        Basketball     : 'men.sidebar.sport.Basketball.unselected',
                        Football       : 'men.sidebar.sport.Football.unselected',
                        "Martial Arts" : 'men.sidebar.sport.MartialArts.unselected',
                        "Any Sport"    : 'men.sidebar.sport.AnySport.unselected'
                    },
                    returnedCheckboxes = {};

                for (var key in sportsCheckboxes) {

                    var value = localStorage.getItem(sportsCheckboxes[key]);

                    localStorage.setItem(sportsCheckboxes[key], true);

                    returnedCheckboxes[key] = {selected: false}
               };

               return returnedCheckboxes;
            },

            selectAllTypes : function() {

                var typesCheckboxes = {
                        Headbands       : 'men.sidebar.type.Headbands.unselected',
                        Socks           : 'men.sidebar.type.Socks.unselected',
                        Towels          : 'men.sidebar.type.Towels.unselected',
                        Belts           : 'men.sidebar.type.Belts.unselected',
                        Bags            : 'men.sidebar.type.Bags.unselected',
                        Hats            : 'men.sidebar.type.Hats.unselected',
                        Bottles         : 'men.sidebar.type.Bottles.unselected',
                        Glasses         : 'men.sidebar.type.Glasses.unselected',
                        Lamps           : 'men.sidebar.type.Lamps.unselected',
                        "Jersey Shirts" : 'men.sidebar.type.JerseyShirts.unselected',
                        "Jersey Shorts" : 'men.sidebar.type.JerseyShorts.unselected',
                        Tights          : 'men.sidebar.type.Tights.unselected',
                        Tees            : 'men.sidebar.type.Tees.unselected',
                        "Tank Tops"     : 'men.sidebar.type.TankTops.unselected'
                    },
                    returnedCheckboxes = {};

                for (var key in typesCheckboxes) {

                    var value = localStorage.getItem(typesCheckboxes[key]);

                    localStorage.setItem(typesCheckboxes[key], false);

                    returnedCheckboxes[key] = {selected: true}
               };

               return returnedCheckboxes;
            },

            unselectAllTypes : function() {

                var typesCheckboxes = {
                        Headbands       : 'men.sidebar.type.Headbands.unselected',
                        Socks           : 'men.sidebar.type.Socks.unselected',
                        Towels          : 'men.sidebar.type.Towels.unselected',
                        Belts           : 'men.sidebar.type.Belts.unselected',
                        Bags            : 'men.sidebar.type.Bags.unselected',
                        Hats            : 'men.sidebar.type.Hats.unselected',
                        Bottles         : 'men.sidebar.type.Bottles.unselected',
                        Glasses         : 'men.sidebar.type.Glasses.unselected',
                        Lamps           : 'men.sidebar.type.Lamps.unselected',
                        "Jersey Shirts" : 'men.sidebar.type.JerseyShirts.unselected',
                        "Jersey Shorts" : 'men.sidebar.type.JerseyShorts.unselected',
                        Tights          : 'men.sidebar.type.Tights.unselected',
                        Tees            : 'men.sidebar.type.Tees.unselected',
                        "Tank Tops"     : 'men.sidebar.type.TankTops.unselected'
                    },
                    returnedCheckboxes = {};

                for (var key in typesCheckboxes) {

                    var value = localStorage.getItem(typesCheckboxes[key]);

                    localStorage.setItem(typesCheckboxes[key], true);

                    returnedCheckboxes[key] = {selected: false}
               };

               return returnedCheckboxes;
            },

            processCheckbox : function(checkbox, currentValue) {
                /*
                 * store the checkbox value in localstorage
                 */
                switch (checkbox) {
                    // set the changed value of the checkbox on the in localStorage
                    case "Shoes":
                        localStorage.setItem('men.sidebar.product.Shoes.unselected', currentValue);
                        break;
                    case "Clothing":
                        localStorage.setItem('men.sidebar.product.Clothing.unselected', currentValue);
                        break;
                    case "Accessories":
                        localStorage.setItem('men.sidebar.product.Accessories.unselected', currentValue);
                        break;
                    case "Running":
                        localStorage.setItem('men.sidebar.sport.Running.unselected', currentValue);
                        break;
                    case "Training":
                        localStorage.setItem('men.sidebar.sport.Training.unselected', currentValue);
                        break;
                    case "Basketball":
                        localStorage.setItem('men.sidebar.sport.Basketball.unselected', currentValue);
                        break;
                    case "Football":
                        localStorage.setItem('men.sidebar.sport.Football.unselected', currentValue);
                        break;
                    case "Martial Arts":
                        localStorage.setItem('men.sidebar.sport.MartialArts.unselected', currentValue);
                        break;
                    case "Any Sport":
                        localStorage.setItem('men.sidebar.sport.Any.unselected', currentValue);
                        break;
                    case "Headbands":
                        localStorage.setItem('men.sidebar.type.Headbands.unselected', currentValue);
                        break;
                    case "Socks":
                        localStorage.setItem('men.sidebar.type.Socks.unselected', currentValue);
                        break;
                    case "Towels":
                        localStorage.setItem('men.sidebar.type.Towels.unselected', currentValue);
                        break;
                    case "Belts":
                        localStorage.setItem('men.sidebar.type.Belts.unselected', currentValue);
                        break;
                    case "Bags":
                        localStorage.setItem('men.sidebar.type.Bags.unselected', currentValue);
                        break;
                    case "Hats":
                        localStorage.setItem('men.sidebar.type.Hats.unselected', currentValue);
                        break;
                    case "Bottles":
                        localStorage.setItem('men.sidebar.type.Bottles.unselected', currentValue);
                        break;
                    case "Glasses":
                        localStorage.setItem('men.sidebar.type.Glasses.unselected', currentValue);
                        break;
                    case "Lamps":
                        localStorage.setItem('men.sidebar.type.Lamps.unselected', currentValue);
                        break;
                    case "Jersey Shirts":
                        localStorage.setItem('men.sidebar.type.JerseyShirts.unselected', currentValue);
                        break;
                    case "Jersey Shorts":
                        localStorage.setItem('men.sidebar.type.JerseyShorts.unselected', currentValue);
                        break;
                    case "Tights":
                        localStorage.setItem('men.sidebar.type.Tights.unselected', currentValue);
                        break;
                    case "Tees":
                        localStorage.setItem('men.sidebar.type.Tees.unselected', currentValue);
                        break;
                    case "Tank Tops":
                        localStorage.setItem('men.sidebar.type.TankTops.unselected', currentValue);
                        break;
                }
            }
        }
    }]);
