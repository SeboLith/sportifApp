'use strict';

/* Factories */
angular.module('factories')
    /*
        SIDEBAR SERVICE
    ----------------------------------------------------------------------------
    ============================================================================ */
    .factory("SidebarService", [function () {

        return {

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

                // console.log(checkboxSelections);

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
                            removeShoes(checkbox.selector);
                            break;
                    }
                });

                function removeShoes (selector) {
                    availableShoes.forEach( function (shoe) {
                        if (shoe.activity == selector) {
                            availableShoes.splice(shoe, 1);
                        };
                    });
                }

                return availableShoes;
            }
        }
    }]);
