define('controller', ['model', 'events'], function( Model, events ) {
    return {
        drawBaloons: Model.getAllrewiev().then(function(data) {
            var coordsKeys = Object.keys(data);

            if( coordsKeys.length ) {
                var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
                    '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
                    '<div class=ballon_body><a class=ballon_link href="#">{{ properties.balloonContentBody|raw }}</a></div>' +
                    '<div class=ballon_content>{{ properties.balloonContentContent|raw }}</div>' +
                    '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
                );

                clusterer = new ymaps.Clusterer({
                    preset: 'islands#invertedVioletClusterIcons',
                    groupByCoordinates: false,
                    clusterDisableClickZoom: true,
                    clusterHideIconOnBalloonOpen: false,
                    clusterOpenBalloonOnClick: true,
                    geoObjectHideIconOnBalloonOpen: false,
                    clusterBalloonContentLayout: 'cluster#balloonCarousel',
                    clusterBalloonItemContentLayout: customItemContentLayout,
                    clusterBalloonPanelMaxMapArea: 0,
                    clusterBalloonContentLayoutWidth: 200,
                    clusterBalloonContentLayoutHeight: 130,
                    clusterBalloonPagerSize: 5
                });

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

                clusterer.options.set({
                    gridSize: 80,
                    clusterDisableClickZoom: true
                });

                clusterer.add(geoObjects);
                myMap.geoObjects.add(clusterer);

                myMap.setBounds(clusterer.getBounds(), {
                    checkZoomRange: true
                });
            }
        })
    };
});