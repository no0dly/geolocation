define( ['controller', 'events'], function( Controller, Events ) {

    new Promise(function(resolve) {

        ymaps.ready(resolve);

    }).then(function() {

        return Controller.getMap();

    }).then(function() {

        Controller.drawBallons();

    }).then(function(val) {
        console.log(Events.clickOnMapListener);
        Events.clickOnMapListener();
    });
});