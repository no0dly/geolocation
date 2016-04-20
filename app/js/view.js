define('view', ['map', 'controller'], function( myMap, Controller ) {
    return {
        drawBaloons: function(data) {
            console.log( myMap );
            // var coordsKeys = Object.keys(data);
            // if( coordsKeys.length ) {

            //     var getPointOptions = function () {
            //         return {
            //             preset: 'islands#violetIcon'
            //         };
            //     },
            //     getGeoObj = function( coordArr, place, address, text, date ) {
            //         return new ymaps.Placemark(coordArr, {
            //                 balloonContentHeader:  place,
            //                 balloonContentBody: address,
            //                 balloonContentContent: text,
            //                 balloonContentFooter: date.toLocaleString()
            //             }, getPointOptions());
            //     };
            //     geoObjects = [];
            //     coordsKeys.forEach(function(val, index) {
            //         for(var i = 0; i < data[val].length; i++) {
            //             var coordArr = [ data[val][i].coords.x, data[val][i].coords.y];
            //             var parseDate = new Date(data[val][i].date);
            //             var place = data[val][i].place;
            //             var address = data[val][i].address;
            //             var text   = data[val][i].text;

            //             geoObjects.push( getGeoObj( coordArr, place, address, text, parseDate ) );

                        
            //         }
            //     });

                // Map.getClusterer().options.set({
                //     gridSize: 80,
                //     clusterDisableClickZoom: true
                // });

                // Map.getClusterer().add(geoObjects);
                // Map.getMap.geoObjects.add( Map.getClusterer() );

                // Map.getMap.setBounds( Map.getClusterer().getBounds(), {
                //     checkZoomRange: true
                // });
            // }
        },

        ballonTemplate: function() {
            var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
                '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
                '<div class=ballon_body><a class=ballon_link href="#">{{ properties.balloonContentBody|raw }}</a></div>' +
                '<div class=ballon_content>{{ properties.balloonContentContent|raw }}</div>' +
                '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
            );
            return customItemContentLayout;
        }

    };
});