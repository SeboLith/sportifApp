'use strict';

/* Factories */
angular.module('factories')
    /*
        SHOE SIDEBAR SERVICE
    ----------------------------------------------------------------------------
    ============================================================================ */
    .factory("ShoesSidebarService", [function () {

            // set localStorage values to false if checkboxes are checked
        var sportsCheckboxes = {
            Running: {
                selected: localStorage.getItem('shoes.sidebar.sport.Running.unselected') == "true" ? false : true
            },
            Training: {
                selected: localStorage.getItem('shoes.sidebar.sport.Training.unselected') == "true" ? false : true
            },
            Basketball: {
                selected: localStorage.getItem('shoes.sidebar.sport.Basketball.unselected') == "true" ? false : true
            },
            Football: {
                selected: localStorage.getItem('shoes.sidebar.sport.Football.unselected') == "true" ? false : true
            },
            "Martial Arts": {
                selected: localStorage.getItem('shoes.sidebar.sport.MartialArts.unselected') == "true" ? false : true
            }
        };

        var usersCheckboxes = {
            Male: {
                selected: localStorage.getItem('shoes.sidebar.user.Male.unselected') == "true" ? false : true
            },
            Female: {
                selected: localStorage.getItem('shoes.sidebar.user.Female.unselected') == "true" ? false : true
            },
            Kids: {
                selected: localStorage.getItem('shoes.sidebar.user.Kids.unselected') == "true" ? false : true
            }
        };

        return {

            sportsCheckboxes: sportsCheckboxes,

            usersCheckboxes: usersCheckboxes,

            shoesFilter : function(tempShoes, sports, users, selectedSize) {

                var availableShoes     = [],
                    checkboxSelections = [],
                    matchedSizes       = [],
                    shoes              = {availableShoes: [], quantities: {}},

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
                            selector   : "Shoe Size",
                            category   : "Size",
                            val        : selectedSize,
                            updatedQty : 0
                    };

                // build an array of checkbox selections to compare against shoes
                checkboxSelections.push(runningVal);
                checkboxSelections.push(trainingVal);
                checkboxSelections.push(basketballVal);
                checkboxSelections.push(footballVal);
                checkboxSelections.push(martialArtsVal);
                checkboxSelections.push(menVal);
                checkboxSelections.push(womenVal);
                checkboxSelections.push(kidsVal);

                // assign available shoes to an array
                tempShoes.forEach( function (shoe) {
                    switch (shoe.available) {
                        case true:
                            availableShoes.push(shoe);
                            break;
                    }
                });

                // compare checkbox selections against shoe values
                checkboxSelections.forEach( function (checkbox) {
                    switch (checkbox.val) {
                        case false:
                            matchBySport(checkbox);
                            matchByUser(checkbox);
                            break;
                    }
                });

                function matchBySport (checkbox) {
                    // remove every element matching the deselected sport from the available shoes array
                    for (var i = availableShoes.length - 1; i >= 0; i--) {
                        if (availableShoes[i].activity === checkbox.selector) {
                           availableShoes.splice(i, 1);
                        }
                    }
                };

                function matchByUser (checkbox) {
                    // remove every element matching the deselected user from the available shoes array
                    for (var i = availableShoes.length - 1; i >= 0; i--) {
                        if (availableShoes[i].user === checkbox.selector) {
                           availableShoes.splice(i, 1);
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
                    // remove every element matching the deselected user from the available shoes array
                    for (var i = availableShoes.length - 1; i >= 0; i--) {
                        if (availableShoes[i].sizes.contains(JSON.parse(sizeVal.val))) {
                            matchedSizes.push(availableShoes[i]);
                        }
                    }

                    if (matchedSizes.length > 0) availableShoes = matchedSizes;

                    else if (sizeVal.val == "false") return

                    else availableShoes = [];

                };
                matchBySize();

                function updateProductQuantity () {
                    // remove every element matching the deselected user from the available shoes array
                    availableShoes.forEach( function (shoe) {
                        switch (shoe.activity) {
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
                        switch (shoe.user) {
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

                shoes.availableShoes = availableShoes;
                shoes.quantities.Running         = runningVal.updatedQty;
                shoes.quantities.Training        = trainingVal.updatedQty;
                shoes.quantities.Basketball      = basketballVal.updatedQty;
                shoes.quantities.Football        = footballVal.updatedQty;
                shoes.quantities["Martial Arts"] = martialArtsVal.updatedQty;
                shoes.quantities.Male            = menVal.updatedQty;
                shoes.quantities.Female          = womenVal.updatedQty;
                shoes.quantities.Kids            = kidsVal.updatedQty;

                return shoes;
            },

            processCheckbox : function(checkbox, currentValue) {
                /*
                 * store the checkbox value in localstorage
                 */

                switch (checkbox) {
                    case "Running":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('shoes.sidebar.sport.Running.unselected', currentValue);
                        break;
                    case "Training":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('shoes.sidebar.sport.Training.unselected', currentValue);
                        break;
                    case "Basketball":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('shoes.sidebar.sport.Basketball.unselected', currentValue);
                        break;
                    case "Football":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('shoes.sidebar.sport.Football.unselected', currentValue);
                        break;
                    case "Martial Arts":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('shoes.sidebar.sport.MartialArts.unselected', currentValue);
                        break;
                        case "Male":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('shoes.sidebar.user.Male.unselected', currentValue);
                        break;
                    case "Female":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('shoes.sidebar.user.Female.unselected', currentValue);
                        break;
                    case "Kids":
                        // set the changed value of the checkbox on the in localStorage
                        localStorage.setItem('shoes.sidebar.user.Kids.unselected', currentValue);
                        break;
                }
            }
        }
    }]);
