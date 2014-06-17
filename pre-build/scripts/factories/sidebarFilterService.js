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
                            category : "Sports",
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

                return availableShoes;
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
