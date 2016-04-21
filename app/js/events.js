define('events', ['controller', 'map'] , function( Controller, myMap ) {
    return {
        clickOnMapListener: function() {
            console.log(myMap.getMap().events);
            return myMap.getMap().events.add('click', function() {
                console.log(3333);
            });

        }
    };
});