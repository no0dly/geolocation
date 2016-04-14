(function() {
    var myMap;

    new Promise(function(resolve) {
        ymaps.ready(resolve);
    }).then(function() {
        return new Promise(function(resolve) {
            myMap = new ymaps.Map("map", {
            // center: [36.09922199, -115.12871905], 
            // zoom: 14
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
                console.log('data received.');

                resolve(data);
            };
            xhrGet.onerror = function(e) {
                console.log(e, 'kookooo');
                reject(new Error('problem?'));
            };

            xhrGet.send(JSON.stringify(reqData));
        });
    }).then(function(data) {
        // Создаем собственный макет с информацией о выбранном геообъекте.
        var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
            // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
            '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
                '<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>' +
                '<div class=ballon_content>{{ properties.balloonContentContent|raw }}</div>' +
                '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
        );

        var clusterer = new ymaps.Clusterer({
            /**
             * Через кластеризатор можно указать только стили кластеров,
             * стили для меток нужно назначать каждой метке отдельно.
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/option.presetStorage.xml
             */
            preset: 'islands#invertedVioletClusterIcons',
            /**
             * Ставим true, если хотим кластеризовать только точки с одинаковыми координатами.
             */
            groupByCoordinates: false,
            /**
             * Опции кластеров указываем в кластеризаторе с префиксом "cluster".
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ClusterPlacemark.xml
             */
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
        geoObjects = [],
        coordsKeys = Object.keys(data);
        coordsKeys.forEach(function(val, index) {
            var coordArr = [ data[val][0].coords.x, data[val][0].coords.y];
            var parseDate = new Date(data[val][0].date);

            geoObjects[index] = new ymaps.Placemark(coordArr, {
                balloonContentHeader:  data[val][0].place,
                balloonContentBody: data[val][0].address,
                balloonContentContent: data[val][0].rewiev,
                balloonContentFooter: parseDate.toLocaleString()
            }, getPointOptions());
        });
        /**
         * Можно менять опции кластеризатора после создания.
         */
        clusterer.options.set({
            gridSize: 80,
            clusterDisableClickZoom: true
        });

        /**
         * В кластеризатор можно добавить javascript-массив меток (не геоколлекцию) или одну метку.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Clusterer.xml#add
         */
        clusterer.add(geoObjects);
        myMap.geoObjects.add(clusterer);

        /**
         * Спозиционируем карту так, чтобы на ней были видны все объекты.
         */

        myMap.setBounds(clusterer.getBounds(), {
            checkZoomRange: true
        });
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
                            'date'   : (new Date()).toUTCString()
                        }  
                    };

                    xhr.open('POST', 'http://localhost:3000/');
                    xhr.send(JSON.stringify(data));
                    xhr.onload = function() {
                        console.log('data was sended.');
                        var result     = document.querySelector('.review');

                        result.innerHTML = '';
                    };
                }
            });
        }
    });
}());

