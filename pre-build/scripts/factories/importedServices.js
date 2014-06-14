/* Factories */
angular.module('factories')

.factory( 'QuickShopService' , ["$http", function ($http) {
    var model = {
        contents: null
    };
    return {
        model: model,

        getProductData: function ( code, callback ) {
            var promise = $http.get( globals.contextPath + '/json/product/getLightweightProductData.json?productCode=' + code ).success( function ( data ) {
                if( data.primaryImage ) {
                    data.primaryImage.url = data.primaryImage.url.indexOf('?') === -1 ? data.primaryImage.url +'?time='+ ( new Date().getTime() ) :
                        data.primaryImage.url +'&time='+ ( new Date().getTime() );
                }
                model.contents = data;
                // callback();
            }).error( function ( err ) {
                if(window.console)
                    window.console.log(err);
            });

            return promise;
        }
    };
}])
.factory('QuickShopPanelService', ["QuickShopService", "$rootScope", function(QuickShopService, $rootScope){
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
        },

        getProductData: function(productCode){
            $rootScope.$broadcast('quickShopLoading');
            return QuickShopService.getProductData( productCode );
        }

    };

    return {
        panel: panel
    };
}]);

