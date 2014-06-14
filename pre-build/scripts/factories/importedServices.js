/* Factories */
angular.module('factories')

    .factory('SliderPanelService', [function(){
        var panel = {
            left: 0,
            top: 0,
            width: 0,

            setLeft: function(value){
                panel.left = value;
            },

            setTop: function(value){
                panel.top = value;
            },

            setWidth: function(value){
                panel.width = value;
            }
        };

        return {
            panel: panel
        };
    }]);

