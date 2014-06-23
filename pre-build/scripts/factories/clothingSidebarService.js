'use strict';

/* Factories */
angular.module('factories')
    /*
        CLOTHING SIDEBAR SERVICE
    ----------------------------------------------------------------------------
    ============================================================================ */
    .factory("ClothingSidebarService", [function () {

            // set localStorage values to false if checkboxes are checked
        var typesCheckboxes = {
            "Jersey Shirts": {
                selected: localStorage.getItem('clothing.sidebar.type.JerseyShirts.unselected') == "true" ? false : true
            },
            "Jersey Shorts": {
                selected: localStorage.getItem('clothing.sidebar.type.JerseyShorts.unselected') == "true" ? false : true
            },
            Tights: {
                selected: localStorage.getItem('clothing.sidebar.type.Tights.unselected') == "true" ? false : true
            },
            Tees: {
                selected: localStorage.getItem('clothing.sidebar.type.Tees.unselected') == "true" ? false : true
            },
            "Tank Tops": {
                selected: localStorage.getItem('clothing.sidebar.type.TankTops.unselected') == "true" ? false : true
            }
        };

            // set localStorage values to false if checkboxes are checked
        var sportsCheckboxes = {
            Running: {
                selected: localStorage.getItem('clothing.sidebar.sport.Running.unselected') == "true" ? false : true
            },
            Training: {
                selected: localStorage.getItem('clothing.sidebar.sport.Training.unselected') == "true" ? false : true
            },
            Basketball: {
                selected: localStorage.getItem('clothing.sidebar.sport.Basketball.unselected') == "true" ? false : true
            },
            Football: {
                selected: localStorage.getItem('clothing.sidebar.sport.Football.unselected') == "true" ? false : true
            },
            "Martial Arts": {
                selected: localStorage.getItem('clothing.sidebar.sport.MartialArts.unselected') == "true" ? false : true
            }
        };

        var usersCheckboxes = {
            Male: {
                selected: localStorage.getItem('clothing.sidebar.user.Male.unselected') == "true" ? false : true
            },
            Female: {
                selected: localStorage.getItem('clothing.sidebar.user.Female.unselected') == "true" ? false : true
            },
            Kids: {
                selected: localStorage.getItem('clothing.sidebar.user.Kids.unselected') == "true" ? false : true
            }
        };

        var sizeSelections = {
            small: {
                selected: localStorage.getItem('clothing.sidebar.size.selected') == "small" ? true : false
            },
            medium: {
                selected: localStorage.getItem('clothing.sidebar.size.selected') == "medium" ? true : false
            },
            large: {
                selected: localStorage.getItem('clothing.sidebar.size.selected') == "large" ? true : false
            },
            "x-large": {
                selected: localStorage.getItem('clothing.sidebar.size.selected') == "x-large" ? true : false
            },
            "2x-large": {
                selected: localStorage.getItem('clothing.sidebar.size.selected') == "2x-large" ? true : false
            }
        };

        return {

            typesCheckboxes  : typesCheckboxes,

            sportsCheckboxes : sportsCheckboxes,

            usersCheckboxes  : usersCheckboxes,

            sizeSelections   : sizeSelections,

            clothingFilter : function(tempClothing, types, sports, users, selectedSize) {

                var availableClothing  = [],
                    checkboxSelections = [],
                    matchedSizes       = [],
                    clothing           = {availableClothing: [], quantities: {}},

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
                    sizeVal            = {
                            selector   : "Clothing Size",
                            category   : "Size",
                            val        : selectedSize.replace(/(^\s+|\s+$)/g,'') /*remove blank spaces from size value*/,
                            updatedQty : 0
                    };

                // build an array of checkbox selections to compare against clothing
                checkboxSelections.push(jerseyShirtsVal);
                checkboxSelections.push(jerseyShortsVal);
                checkboxSelections.push(tightsVal);
                checkboxSelections.push(teesVal);
                checkboxSelections.push(tankTopsVal);
                checkboxSelections.push(runningVal);
                checkboxSelections.push(trainingVal);
                checkboxSelections.push(basketballVal);
                checkboxSelections.push(footballVal);
                checkboxSelections.push(martialArtsVal);
                checkboxSelections.push(menVal);
                checkboxSelections.push(womenVal);
                checkboxSelections.push(kidsVal);

                // assign available clothing to an array
                tempClothing.forEach( function (item) {
                    switch (item.available) {
                        case true:
                            availableClothing.push(item);
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
                    // remove every element matching the deselected sport from the available clothing array
                    for (var i = availableClothing.length - 1; i >= 0; i--) {
                        if (availableClothing[i].sub_category === checkbox.selector) {
                           availableClothing.splice(i, 1);
                        }
                    }
                };

                function matchBySport (checkbox) {
                    // remove every element matching the deselected sport from the available clothing array
                    for (var i = availableClothing.length - 1; i >= 0; i--) {
                        if (availableClothing[i].activity === checkbox.selector) {
                           availableClothing.splice(i, 1);
                        }
                    }
                };

                function matchByUser (checkbox) {
                    // remove every element matching the deselected user from the available clothing array
                    for (var i = availableClothing.length - 1; i >= 0; i--) {
                        if (availableClothing[i].user === checkbox.selector) {
                           availableClothing.splice(i, 1);
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
                    // remove every element matching the deselected user from the available clothing array
                    for (var i = availableClothing.length - 1; i >= 0; i--) {

                        if (availableClothing[i].sizes.contains(sizeVal.val)) {
                            matchedSizes.push(availableClothing[i]);
                        }
                    }

                    if (matchedSizes.length > 0) availableClothing = matchedSizes;

                    else if (sizeVal.val == "false") return

                    else availableClothing = [];

                };
                matchBySize();

                function updateProductQuantity () {
                    // remove every element matching the deselected user from the available clothing array
                    availableClothing.forEach( function (item) {
                        switch (item.sub_category) {
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
                        }
                    });
                };
                updateProductQuantity();

                clothing.availableClothing           = availableClothing;
                clothing.quantities["Jersey Shirts"] = jerseyShirtsVal.updatedQty;
                clothing.quantities["Jersey Shorts"] = jerseyShortsVal.updatedQty;
                clothing.quantities.Tights           = tightsVal.updatedQty;
                clothing.quantities.Tees             = teesVal.updatedQty;
                clothing.quantities["Tank Tops"]     = tankTopsVal.updatedQty;
                clothing.quantities.Running          = runningVal.updatedQty;
                clothing.quantities.Training         = trainingVal.updatedQty;
                clothing.quantities.Basketball       = basketballVal.updatedQty;
                clothing.quantities.Football         = footballVal.updatedQty;
                clothing.quantities["Martial Arts"]  = martialArtsVal.updatedQty;
                clothing.quantities.Male             = menVal.updatedQty;
                clothing.quantities.Female           = womenVal.updatedQty;
                clothing.quantities.Kids             = kidsVal.updatedQty;

                return clothing;
            },

            processCheckbox : function(checkbox, currentValue) {
                /*
                 * store the checkbox value in localstorage
                 */

                switch (checkbox) {
                    // set the changed value of the checkbox on the in localStorage
                    case "Jersey Shirts":
                        localStorage.setItem('clothing.sidebar.type.JerseyShirts.unselected', currentValue);
                        break;
                    case "Jersey Shorts":
                        localStorage.setItem('clothing.sidebar.type.JerseyShorts.unselected', currentValue);
                        break;
                    case "Tights":
                        localStorage.setItem('clothing.sidebar.type.Tights.unselected', currentValue);
                        break;
                    case "Tees":
                        localStorage.setItem('clothing.sidebar.type.Tees.unselected', currentValue);
                        break;
                    case "Tank Tops":
                        localStorage.setItem('clothing.sidebar.type.TankTops.unselected', currentValue);
                        break;
                    case "Running":
                        localStorage.setItem('clothing.sidebar.sport.Running.unselected', currentValue);
                        break;
                    case "Training":
                        localStorage.setItem('clothing.sidebar.sport.Training.unselected', currentValue);
                        break;
                    case "Basketball":
                        localStorage.setItem('clothing.sidebar.sport.Basketball.unselected', currentValue);
                        break;
                    case "Football":
                        localStorage.setItem('clothing.sidebar.sport.Football.unselected', currentValue);
                        break;
                    case "Martial Arts":
                        localStorage.setItem('clothing.sidebar.sport.MartialArts.unselected', currentValue);
                        break;
                    case "Male":
                        localStorage.setItem('clothing.sidebar.user.Male.unselected', currentValue);
                        break;
                    case "Female":
                        localStorage.setItem('clothing.sidebar.user.Female.unselected', currentValue);
                        break;
                    case "Kids":
                        localStorage.setItem('clothing.sidebar.user.Kids.unselected', currentValue);
                        break;
                }
            }
        }
    }]);
