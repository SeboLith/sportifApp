'use strict';

/* Factories */
angular.module('factories')
    /*
        SIDEBAR SERVICE
    ----------------------------------------------------------------------------
    ============================================================================ */
    .factory("SidebarService", [function () {

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

            sportsCheckboxes: sportsCheckboxes,

            usersCheckboxes: usersCheckboxes,

            shoeFilter : function(tempShoes, sports, users, selectedSize) {

                var availableShoes     = [],
                    checkboxSelections = [],
                    runningVal         = {
                            selector : "Running",
                            category : "Sports",
                            val      : sports.Running.selected
                    },
                    trainingVal        = {
                            selector : "Training",
                            category : "Sports",
                            val      : sports.Training.selected
                    },
                    basketballVal      = {
                            selector : "Basketball",
                            category : "Sports",
                            val      : sports.Basketball.selected
                    },
                    footballVal        = {
                            selector : "Football",
                            category : "Sports",
                            val      : sports.Football.selected
                    },
                    martialArtsVal     = {
                            selector : "Martial Arts",
                            category : "Sports Arts",
                            val      : sports["Martial Arts"].selected
                    },
                    menVal             = {
                            selector : "Men",
                            category : "User",
                            val      : users.Male.selected
                    },
                    womenVal           = {
                            selector : "Women",
                            category : "User",
                            val      : users.Female.selected
                    },
                    kidsVal            = {
                            selector : "Kids",
                            category : "User",
                            val      : users.Kids.selected
                    },
                    sizeVal            = {
                            selector : "Shoe Size",
                            category : "Size",
                            val      : selectedSize
                    };

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

                checkboxSelections.forEach( function (checkbox) {
                    switch (checkbox.val) {
                        case false:
                            matchBySelector(checkbox.selector);
                            break;
                    }
                });

                function matchBySelector (selector) {
                    availableShoes.forEach( function (shoe) {
                        if (shoe.activity == selector) {
                            availableShoes.splice(availableShoes.indexOf(shoe), 1);
                        } else if (shoe.user == selector) {
                            availableShoes.splice(availableShoes.indexOf(shoe), 1);
                        };
                    });
                }

                return availableShoes;
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
