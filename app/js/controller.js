define( 'controller', ['model','map', 'events', 'view'], function( Model, myMap, Events, View ) {
    for(var i = 0; i<arguments.length; i ++) {
        console.log(arguments[i]);
    }
    return {
        drawBallons: function() {
            console.log(Model);
            return Model.getAllrewiev().then(function(data) {
                 View.drawBaloons(data);
            });
        },
    };
});