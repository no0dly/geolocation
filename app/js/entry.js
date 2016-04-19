define( ['model', 'controller'], function( Model, Controller ) {

    new Promise(function(resolve) {

        ymaps.ready(resolve);

    }).then(function() {

        return Model.create();

    }).then(function() {

        return Controller.drawBallons;

    }).then(function(val) {
        
    });
});