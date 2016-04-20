define( ['model', 'controller', 'map'], function( Model, Controller, myMap ) {

    new Promise(function(resolve) {

        ymaps.ready(resolve);

    }).then(function() {

        myMap.getMap();

    }).then(function() {

        Controller.drawBallons();

    }).then(function(val) {
        
    });
});