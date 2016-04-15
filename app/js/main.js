(function() {
    var myMap,
        clusterer;

    new Promise(function(resolve) {
        ymaps.ready(resolve);
    }).then(function() {
        return new Promise(function(resolve) {
            myMap = new ymaps.Map("map", {
                center: [55.76, 37.64], 
                zoom: 14
            });

            resolve(myMap);
        });
    }).then(function(myMap) {
        return new Promise(function(resolve, reject) {
            var xhrGet  = new XMLHttpRequest();
            var reqData = {op: "all"};

            xhrGet.open('POST', 'http://localhost:3000/');

            xhrGet.onload = function(e) {
                var data = JSON.parse(xhrGet.response);
                resolve(data);
            };
            xhrGet.onerror = function(e) {
                console.log(e, 'kookooo');
                reject(new Error('problem?'));
            };

            xhrGet.send(JSON.stringify(reqData));
        });
    }).then(function(data) {
        var coordsKeys = Object.keys(data);

        if( coordsKeys.length ) {
            var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
                '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
                '<div class=ballon_body><a href="#">{{ properties.balloonContentBody|raw }}</a></div>' +
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
            }),

            getPointOptions = function () {
                return {
                    preset: 'islands#violetIcon'
                };
            },
            geoObjects = [];
            coordsKeys.forEach(function(val, index) {
                var coordArr = [ data[val][0].coords.x, data[val][0].coords.y];
                var parseDate = new Date(data[val][0].date);

                geoObjects[index] = new ymaps.Placemark(coordArr, {
                    balloonContentHeader:  data[val][0].place,
                    balloonContentBody: data[val][0].address,
                    balloonContentContent: data[val][0].text,
                    balloonContentFooter: parseDate.toLocaleString()
                }, getPointOptions());
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
    }).then(function(data) {
        myMap.events.add('click', openForm);

        function openForm(e) {
            var coords  = e.get('coords');
            var content = document.querySelector('.review-content');
            
            if(content) {
                Ps.initialize(content);
            }

            getAddress(coords);
        }

        function getAddress(coords) {
            ymaps.geocode(coords).then(function (res) {
                var firstGeoObject = res.geoObjects.get(0);
                var markData = firstGeoObject.properties.get('text');

                drawForm(markData, coords);
            });
        }

        function drawForm(markData, coords) {
            new Promise(function(resolve) {
                var source     = document.getElementById('form-review').innerHTML;
                var templateFn = Handlebars.compile(source);
                var template   = templateFn({data: markData});
                var result     = document.querySelector('.review');

                result.innerHTML = template;

                resolve();
            }).then(function() {
                //add scroll
                var content = document.querySelector('.review-content');
                Ps.initialize(content);

            }).then(function() {
                //close btn
                var closeBtn = document.querySelector('.review-title__close');
                closeBtn.addEventListener('click', closeRewiev);

                function closeRewiev(e) {
                    var result     = document.querySelector('.review');
                    result.innerHTML = '';
                }
            }).then(function() {
                var form = document.querySelector('.review-form');

                form.addEventListener('submit', sendAjax);

                function sendAjax(e) {
                    e.preventDefault();
                    var xhr      = new XMLHttpRequest();
                    var name     = form.firstName.value;
                    var place    = form.place.value;
                    var text     = form.rewiev.value;
                    var date     = new Date();
                    var data = {
                        'op': 'add',
                        'review': {
                            'coords':{
                                'x': coords[0],
                                'y': coords[1]
                            },
                            'address': markData,
                            'name'   : name,
                            'place'  : place,
                            'text'   : text,
                            'date'   : date.toUTCString()
                        }  
                    };

                    xhr.open('POST', 'http://localhost:3000/');
                    xhr.send(JSON.stringify(data));
                    xhr.onload = function() {
                        console.log('data was sended.');

                        // addReview(name, place, text );

                        form.firstName.value  = '';
                        form.place.value = '';
                        form.rewiev.value  = '';

                        clusterer.add(new ymaps.Placemark( coords, {
                            }, {
                                preset: 'islands#icon',
                                iconColor: '#b51eff'
                            }));

                        myMap.geoObjects.add(clusterer);
                            
                    };
                }
                // function addReview(name, place, text) {
                //     var source     = document.getElementById('review').innerHTML;
                //     var templateFn = Handlebars.compile(source);
                //     var template   = templateFn({data: markData});
                //     var result     = document.querySelector('.review');

                //     result.innerHTML = template;
                // }
            });
        }
    });
}());

