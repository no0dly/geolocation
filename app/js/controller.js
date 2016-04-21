define( 'controller', ['model','map', 'view'], function( Model, myMap, View ) {

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
        },

        showForm: function() {
            console.log('hello');
        }
    };
});