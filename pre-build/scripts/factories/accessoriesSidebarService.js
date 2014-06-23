'use strict';

/* Factories */
angular.module('factories')
    /*
        ACCESSORIES SIDEBAR SERVICE
    ----------------------------------------------------------------------------
    ============================================================================ */
    .factory("AccessoriesSidebarService", [function () {

            // set localStorage values to false if checkboxes are checked
        var typesCheckboxes = {
            Headbands: {
                selected: localStorage.getItem('accessories.sidebar.type.Headbands.unselected') == "true" ? false : true
            },
            Socks: {
                selected: localStorage.getItem('accessories.sidebar.type.Socks.unselected') == "true" ? false : true
            },
            Towels: {
                selected: localStorage.getItem('accessories.sidebar.type.Towels.unselected') == "true" ? false : true
            },
            Belts: {
                selected: localStorage.getItem('accessories.sidebar.type.Belts.unselected') == "true" ? false : true
            },
            Bags: {
                selected: localStorage.getItem('accessories.sidebar.type.Bags.unselected') == "true" ? false : true
            },
            Hats: {
                selected: localStorage.getItem('accessories.sidebar.type.Hats.unselected') == "true" ? false : true
            },
            Bottles: {
                selected: localStorage.getItem('accessories.sidebar.type.Bottles.unselected') == "true" ? false : true
            },
            Glasses: {
                selected: localStorage.getItem('accessories.sidebar.type.Glasses.unselected') == "true" ? false : true
            },
            Lamps: {
                selected: localStorage.getItem('accessories.sidebar.type.Lamps.unselected') == "true" ? false : true
            }
        };

            // set localStorage values to false if checkboxes are checked
        var sportsCheckboxes = {
            Running: {
                selected: localStorage.getItem('accessories.sidebar.sport.Running.unselected') == "true" ? false : true
            },
            Training: {
                selected: localStorage.getItem('accessories.sidebar.sport.Training.unselected') == "true" ? false : true
            },
            Basketball: {
                selected: localStorage.getItem('accessories.sidebar.sport.Basketball.unselected') == "true" ? false : true
            },
            Football: {
                selected: localStorage.getItem('accessories.sidebar.sport.Football.unselected') == "true" ? false : true
            },
            "Martial Arts": {
                selected: localStorage.getItem('accessories.sidebar.sport.MartialArts.unselected') == "true" ? false : true
            },
            "Any Sport": {
                selected: localStorage.getItem('accessories.sidebar.sport.Any.unselected') == "true" ? false : true
            }
   };

        var usersCheckboxes = {
            Male: {
                selected: localStorage.getItem('accessories.sidebar.user.Male.unselected') == "true" ? false : true
            },
            Female: {
                selected: localStorage.getItem('accessories.sidebar.user.Female.unselected') == "true" ? false : true
            },
            Kids: {
                selected: localStorage.getItem('accessories.sidebar.user.Kids.unselected') == "true" ? false : true
            },
            "Any User": {
                selected: localStorage.getItem('accessories.sidebar.user.Any.unselected') == "true" ? false : true
            }
        };

        var sizeSelections = {
            small: {
                selected: localStorage.getItem('accessories.sidebar.size.selected') == "small" ? true : false
            },
            medium: {
                selected: localStorage.getItem('accessories.sidebar.size.selected') == "medium" ? true : false
            },
            large: {
                selected: localStorage.getItem('accessories.sidebar.size.selected') == "large" ? true : false
            },
            "x-large": {
                selected: localStorage.getItem('accessories.sidebar.size.selected') == "x-large" ? true : false
            },
            "2x-large": {
                selected: localStorage.getItem('accessories.sidebar.size.selected') == "2x-large" ? true : false
            },
            "N/A": {
                selected: localStorage.getItem('accessories.sidebar.size.selected') == "N/A" ? true : false
            }
        };

        return {

            typesCheckboxes  : typesCheckboxes,

            sportsCheckboxes : sportsCheckboxes,

            usersCheckboxes  : usersCheckboxes,

            sizeSelections   : sizeSelections,

            accessoriesFilter : function(tempAccessories, types, sports, users, selectedSize) {

                var availableAccessories = [],
                    checkboxSelections   = [],
                    matchedSizes         = [],
                    accessories          = {availableAccessories: [], quantities: {}},

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
                    anySportVal       = {
                            selector   : "Any Sport",
                            category   : "Sports",
                            val        : sports["Any Sport"].selected,
                            updatedQty : 0
                    },
                    menVal             = {
                            selector   : "Men",
                            category   : "User",
                            val        : users.Male.selected,
                            updatedQty : 0
                    },
                    womenVal           = {
                            selector   : "Women",
                            category   : "User",
                            val        : users.Female.selected,
                            updatedQty : 0
                    },
                    kidsVal            = {
                            selector   : "Kids",
                            category   : "User",
                            val        : users.Kids.selected,
                            updatedQty : 0
                    },
                    anyUserVal        = {
                            selector   : "Any User",
                            category   : "User",
                            val        : users["Any User"].selected,
                            updatedQty : 0
                    },
                    sizeVal            = {
                            selector   : "Accessories Size",
                            category   : "Size",
                            val        : selectedSize.replace(/(^\s+|\s+$)/g,'') /*remove blank spaces from size value*/,
                            updatedQty : 0
                    };

                // build an array of checkbox selections to compare against accessories
                checkboxSelections.push(headbandsVal);
                checkboxSelections.push(socksVal);
                checkboxSelections.push(towelsVal);
                checkboxSelections.push(beltsVal);
                checkboxSelections.push(bagsVal);
                checkboxSelections.push(hatsVal);
                checkboxSelections.push(bottlesVal);
                checkboxSelections.push(glassesVal);
                checkboxSelections.push(lampsVal);
                checkboxSelections.push(runningVal);
                checkboxSelections.push(trainingVal);
                checkboxSelections.push(basketballVal);
                checkboxSelections.push(footballVal);
                checkboxSelections.push(martialArtsVal);
                checkboxSelections.push(anySportVal);
                checkboxSelections.push(menVal);
                checkboxSelections.push(womenVal);
                checkboxSelections.push(kidsVal);
                checkboxSelections.push(anyUserVal);

                // assign available accessories to an array
                tempAccessories.forEach( function (item) {
                    switch (item.available) {
                        case true:
                            availableAccessories.push(item);
                            break;
                    }
                });

                // compare checkbox selections against item values
                checkboxSelections.forEach( function (checkbox) {
                    switch (checkbox.val) {
                        case false:
                            matchByType(checkbox);
                            matchBySport(checkbox);
                            matchByUser(checkbox);
                            break;
                    }
                });

                function matchByType (checkbox) {
                    // remove every element matching the deselected sport from the available accessories array
                    for (var i = availableAccessories.length - 1; i >= 0; i--) {
                        if (availableAccessories[i].sub_category === checkbox.selector) {
                           availableAccessories.splice(i, 1);
                        }
                    }
                };

                function matchBySport (checkbox) {
                    // remove every element matching the deselected sport from the available accessories array
                    for (var i = availableAccessories.length - 1; i >= 0; i--) {
                        if (availableAccessories[i].activity === checkbox.selector) {
                           availableAccessories.splice(i, 1);
                        }
                    }
                };

                function matchByUser (checkbox) {
                    // remove every element matching the deselected user from the available accessories array
                    for (var i = availableAccessories.length - 1; i >= 0; i--) {
                        if (availableAccessories[i].user === checkbox.selector) {
                           availableAccessories.splice(i, 1);
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
                    // remove every element matching the deselected user from the available accessories array
                    for (var i = availableAccessories.length - 1; i >= 0; i--) {

                        if (availableAccessories[i].sizes.contains(sizeVal.val)) {
                            matchedSizes.push(availableAccessories[i]);
                        }
                    }

                    if (matchedSizes.length > 0) availableAccessories = matchedSizes;

                    else if (sizeVal.val == "false") return

                    else availableAccessories = [];

                };
                matchBySize();

                function updateProductQuantity () {
                    // remove every element matching the deselected user from the available accessories array
                    availableAccessories.forEach( function (item) {
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
                        switch (item.user) {
                            case "Men":
                                menVal.updatedQty += 1;
                                break;
                            case "Women":
                                womenVal.updatedQty += 1;
                                break;
                            case "Kids":
                                kidsVal.updatedQty += 1;
                                break;
                            case "Any User":
                                anyUserVal.updatedQty += 1;
                                break;
                        }
                    });
                };
                updateProductQuantity();

                accessories.availableAccessories        = availableAccessories;
                accessories.quantities.Headbands        = headbandsVal.updatedQty;
                accessories.quantities.Socks            = socksVal.updatedQty;
                accessories.quantities.Towels           = towelsVal.updatedQty;
                accessories.quantities.Belts            = beltsVal.updatedQty;
                accessories.quantities.Bags             = bagsVal.updatedQty;
                accessories.quantities.Hats             = hatsVal.updatedQty;
                accessories.quantities.Bottles          = bottlesVal.updatedQty;
                accessories.quantities.Glasses          = glassesVal.updatedQty;
                accessories.quantities.Lamps            = lampsVal.updatedQty;
                accessories.quantities.Running          = runningVal.updatedQty;
                accessories.quantities.Training         = trainingVal.updatedQty;
                accessories.quantities.Basketball       = basketballVal.updatedQty;
                accessories.quantities.Football         = footballVal.updatedQty;
                accessories.quantities["Martial Arts"]  = martialArtsVal.updatedQty;
                accessories.quantities["Any Sport"]     = anySportVal.updatedQty;
                accessories.quantities.Male             = menVal.updatedQty;
                accessories.quantities.Female           = womenVal.updatedQty;
                accessories.quantities.Kids             = kidsVal.updatedQty;
                accessories.quantities["Any User"]      = anyUserVal.updatedQty;

                return accessories;
            },

            processCheckbox : function(checkbox, currentValue) {
                /*
                 * store the checkbox value in localstorage
                 */

                switch (checkbox) {
                    // set the changed value of the checkbox on the in localStorage
                    case "Headbands":
                        localStorage.setItem('accessories.sidebar.type.Headbands.unselected', currentValue);
                        break;
                    case "Socks":
                        localStorage.setItem('accessories.sidebar.type.Socks.unselected', currentValue);
                        break;
                    case "Towels":
                        localStorage.setItem('accessories.sidebar.type.Towels.unselected', currentValue);
                        break;
                    case "Belts":
                        localStorage.setItem('accessories.sidebar.type.Belts.unselected', currentValue);
                        break;
                    case "Bags":
                        localStorage.setItem('accessories.sidebar.type.Bags.unselected', currentValue);
                        break;
                    case "Hats":
                        localStorage.setItem('accessories.sidebar.type.Hats.unselected', currentValue);
                        break;
                    case "Bottles":
                        localStorage.setItem('accessories.sidebar.type.Bottles.unselected', currentValue);
                        break;
                    case "Glasses":
                        localStorage.setItem('accessories.sidebar.type.Glasses.unselected', currentValue);
                        break;
                    case "Lamps":
                        localStorage.setItem('accessories.sidebar.type.Lamps.unselected', currentValue);
                        break;
                    case "Running":
                        localStorage.setItem('accessories.sidebar.sport.Running.unselected', currentValue);
                        break;
                    case "Training":
                        localStorage.setItem('accessories.sidebar.sport.Training.unselected', currentValue);
                        break;
                    case "Basketball":
                        localStorage.setItem('accessories.sidebar.sport.Basketball.unselected', currentValue);
                        break;
                    case "Football":
                        localStorage.setItem('accessories.sidebar.sport.Football.unselected', currentValue);
                        break;
                    case "Any Sport":
                        localStorage.setItem('accessories.sidebar.sport.Any.unselected', currentValue);
                        break;
                    case "Martial Arts":
                        localStorage.setItem('accessories.sidebar.sport.MartialArts.unselected', currentValue);
                        break;
                    case "Male":
                        localStorage.setItem('accessories.sidebar.user.Male.unselected', currentValue);
                        break;
                    case "Female":
                        localStorage.setItem('accessories.sidebar.user.Female.unselected', currentValue);
                        break;
                    case "Kids":
                        localStorage.setItem('accessories.sidebar.user.Kids.unselected', currentValue);
                        break;
                    case "Any User":
                        localStorage.setItem('accessories.sidebar.user.Any.unselected', currentValue);
                        break;
                }
            }
        }
    }]);
