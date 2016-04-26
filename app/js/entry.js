define( ['controller', 'events'], function( Controller, Events ) {

    new Promise(function(resolve) {

        ymaps.ready(resolve);

    }).then(function() {

        Controller.getMap();

    }).then(function() {

        Controller.drawBallons();

    }).then(function(val) {
        Events.clickOnMapListener();
    });
});