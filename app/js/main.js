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
                reject(new Error('problem?'));
            };

            xhrGet.send(JSON.stringify(reqData));
        });
    }).then(function(data) {
        var coordsKeys = Object.keys(data);

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
    }).then(function() {

        document.addEventListener('click', goToReview);

        function goToReview(e) {
            if(e.target.classList.contains('ballon_link')) {
                new Promise(function(resolve, reject) {
                    var link      = e.target;
                    var linkText  = link.innerText;
                    var req       = {
                        op: "get",
                        address: linkText
                    };
                    var xhrReview = new XMLHttpRequest();

                    xhrReview.open('POST', 'http://localhost:3000/');
                    xhrReview.onload = function() {
                        var data = JSON.parse(xhrReview.response);
                        console.log(data);
                        resolve(data);
                    };
                    xhrReview.send(JSON.stringify(req));
                }).then(function(data) {
                    var source     = document.getElementById('form-review-full').innerHTML;
                    var templateFn = Handlebars.compile(source);
                    var template   = templateFn({data: data});
                    var result     = document.querySelector('.review');

                    result.innerHTML = template;
                    
                }).then(function(data) {
                    var content = document.querySelector('.review-content');
                    Ps.initialize(content);
                });
            } else if ( e.target.classList.contains('fa-times') ) {
                //close btn
                console.log(123);
                var result     = document.querySelector('.review');
                result.innerHTML = '';
            }
        }
    }).then(function(data) {
        myMap.events.add('click', openForm);

        function openForm(e) {
            var coords  = e.get('coords');
            var content = document.querySelector('.review-content');
            var clickPoint = [e.get('clientX'), e.get('clientY')];
            
            if(content) {
                Ps.initialize(content);
            }

            getAddress(coords, clickPoint);
        }

        function getAddress(coords, clickPoint) {
            ymaps.geocode(coords).then(function (res) {
                var firstGeoObject = res.geoObjects.get(0);
                var markData = firstGeoObject.properties.get('text');

                drawForm(markData, coords, clickPoint);
            });
        }

        function drawForm(markData, coords, clickPoint) {
            new Promise(function(resolve) {
                var source     = document.getElementById('form-review').innerHTML;
                var templateFn = Handlebars.compile(source);
                var template   = templateFn({data: markData});
                var result     = document.querySelector('.review');

                result.innerHTML = template;

                resolve(clickPoint);
            }).then(function() {
                var reviewWindow = document.querySelector('.review');
                var windowRect   = reviewWindow.getBoundingClientRect();
                var top, left;

                top = clickPoint[1];
                left = clickPoint[0];

                console.log(clickPoint);

                if (top + windowRect.height > window.innerHeight) {
                    top = window.innerHeight - windowRect.height;

                    if (top < 0) {
                        top = 0;
                    }
                }

                if (left + windowRect.width > window.innerWidth) {
                    left = window.innerWidth - windowRect.width;

                    if (left < 0) {
                        left = 0;
                    }
                }

                reviewWindow.style.top = top + 'px';
                reviewWindow.style.left = left + 'px';
            }).then(function() {
                //add scroll
                var content = document.querySelector('.review-content');
                Ps.initialize(content);

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
                        var data = JSON.parse(xhr.response);
                        if(data.error) {
                            return false;
                        }
                        console.log('data was sended.');
                        addReview( name, place, text, date );

                        clusterer.add(new ymaps.Placemark( coords, {
                            balloonContentHeader:  place,
                            balloonContentBody: markData,
                            balloonContentContent: text,
                            balloonContentFooter: date.toLocaleString()
                        }, {
                            preset: 'islands#icon',
                            iconColor: '#b51eff'
                        }));

                        form.firstName.value  = '';
                        form.place.value = '';
                        form.rewiev.value  = '';

                        myMap.geoObjects.add(clusterer);
                            
                    };

                }
                function addReview(name, place, text, date) {
                    var source     = document.getElementById('review').innerHTML;
                    var data       = {
                        name: name,
                        place: place,
                        text: text,
                        date: date.toLocaleTimeString()
                    };
                    var templateFn = Handlebars.compile(source);
                    var template   = templateFn({data: data});
                    var result     = document.querySelector('.review-content');
                    var empty      = document.querySelector('.review-content__wrap--empty');
                    var el         = document.createElement('div');

                    el.classList.add('review-content__wrap');
                    el.innerHTML   = template;
                    if(empty) {
                        result.removeChild(empty);
                    }
                    result.insertBefore(el, result.firstChild);
                }
            });
        }
    });
}());

