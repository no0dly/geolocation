define( 'controller', ['model','map', 'events', 'view'], function( Model, myMap, Events, View ) {

    return {
        drawBallons: function() {
            return Model.getAllrewiev().then(function(data) {
                 View.drawBaloons(data);
            });
        },

        showWindow: function() {
            
        },

        getMap: function() {
            return myMap.getMap();
        }
    };
});