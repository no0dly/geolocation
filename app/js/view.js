define('view', ['map'], function( myMap ) {
    return {
        drawBaloons: function(data) {
            var coordsKeys = Object.keys(data);
            if( coordsKeys.length ) {

                var getPointOptions = function () {
                    return {
                        preset: 'islands#violetIcon'
                    };
                },
                getGeoObj = function( coordArr, place, address, text, date ) {
                    return new ymaps.Placemark(coordArr, {
                            balloonContentHeader:  place,
                            balloonContentBody: address,
                            balloonContentContent: text,
                            balloonContentFooter: date.toLocaleString()
                        }, getPointOptions());
                };
                geoObjects = [];
                coordsKeys.forEach(function(val, index) {
                    for(var i = 0; i < data[val].length; i++) {
                        var coordArr = [ data[val][i].coords.x, data[val][i].coords.y];
                        var parseDate = new Date(data[val][i].date);
                        var place = data[val][i].place;
                        var address = data[val][i].address;
                        var text   = data[val][i].text;

                        geoObjects.push( getGeoObj( coordArr, place, address, text, parseDate ) );
                    }
                });

                myMap.getClusterer().options.set({
                    gridSize: 80,
                    clusterDisableClickZoom: true
                });

                myMap.getClusterer().add(geoObjects);
                myMap.getMap().geoObjects.add( myMap.getClusterer() );

                // myMap.getMap().setBounds( myMap.getClusterer().getBounds(), {
                //     checkZoomRange: true
                // });
            }
        },

    };
});