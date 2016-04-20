define( ['model', 'controller', 'map'], function( Model, Controller, Map ) {

    new Promise(function(resolve) {

        ymaps.ready(resolve);

    }).then(function() {

        return Map.getMap();

    }).then(function() {
        
        return Controller.drawBallons;

    }).then(function(val) {
        
    });
});