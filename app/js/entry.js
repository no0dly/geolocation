define( ['controller', 'events', 'map', 'requests', 'actions'], function( Controller, Events, myMap, request, actions) {
    var coords,
        markData;

    new Promise(function(resolve) {

        ymaps.ready(resolve);

    }).then(function() {

        myMap.createMap();

    }).then(function() {
        var ajax    = request();

        ajax.all().then(function(data) {
            var coordsKeys = Object.keys(data);
            var geoObjects = [];

            var getPointOptions = function () {
                return {
                    preset: 'islands#violetIcon'
                };
            };
            var getGeoObj = function( coordArr, place, address, text, date ) {
                return new ymaps.Placemark(coordArr, {
                        balloonContentHeader:  place,
                        balloonContentBody: address,
                        balloonContentContent: text,
                        balloonContentFooter: date.toLocaleString(),
                        coords: coordArr
                    }, getPointOptions());
            };

            if( coordsKeys.length ) {
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
                myMap.getMap().geoObjects.add(myMap.getClusterer());

                myMap.getMap().setBounds(myMap.getClusterer().getBounds(), {
                    checkZoomRange: true
                });
            }
        }).then(function() {
            var addressLink = 'ballon_link';
            var closeBtn    = 'fa-times';
            var submitBtn   = 'review-form-group__btn';
            document.addEventListener('click', _events);

            function _events(e) {
                
                if( e.target.classList.contains('ballon_link')) {
                    e.preventDefault();
                    var link      = e.target;
                    var address   = link.innerText;

                    actions.openWindowReview(address);

                } else if ( e.target.classList.contains('fa-times') ) {
                    e.preventDefault();
                    actions.closeWindowReview();
                } else if (e.target.classList.contains('review-form-group__btn')) {
                    e.preventDefault();

                    var form       = document.querySelector('.review-form');
                    var date       = new Date();
                    var ballonLink = document.querySelector('.ballon_link');

                    if( ballonLink ) {
                        coords     = [ ballonLink.dataset.x, ballonLink.dataset.y ];
                        markData   = ballonLink.innerText;
                    }

                    var data = {
                        'op': 'add',
                        'review': {
                            'coords':{
                                'x': coords[0],
                                'y': coords[1]
                            },
                            'address': markData,
                            'name'   : form.firstName.value,
                            'place'  : form.place.value,
                            'text'   : form.rewiev.value,
                            'date'   : date.toUTCString()
                        }  
                    };

                    actions.addReview(data);
                }
            }
        }).then(function() {
            
        });

    });
});