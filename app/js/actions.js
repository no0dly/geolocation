define('actions', ['requests', 'view', 'scroll', 'map'] , function(request, view, scroll, myMap) {
    var ajax    = request();
    var result  = document.querySelector('.review');
    var coords, markData;

    return {
        openWindowReview: function(address) {
            return ajax.get(address).then(function(data) {
                result.innerHTML = view.render('form-review-full', data);
            }).then(function() {
                var addressText = document.querySelector('.review-title__text');
                var textNode    = document.createTextNode(address);

                addressText.appendChild(textNode);

                scroll.init();
            });
        },
        closeWindowReview: function() {
            result.innerHTML = '';
        },

        addReview: function( review, coords, name, place, text, date, markData ) {
            return ajax.add(review).then(function(data) {

                var form = document.querySelector('.review-form');

                myMap.getClusterer().add(new ymaps.Placemark( coords, {
                    balloonContentHeader: place,
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

                myMap.getMap().geoObjects.add(myMap.getClusterer());
            });
        },
        addReviewComment: function( name, place, text, date ) {
            var data       = {
                name: name,
                place: place,
                text: text,
                date: date.toLocaleTimeString()
            };
            var el         = document.createElement('div');
            var result     = document.querySelector('.review-content');
            var empty      = document.querySelector('.review-content__wrap--empty');

            el.classList.add('review-content__wrap');

            el.innerHTML   = view.render('review', data);

            if(empty) {
                result.removeChild(empty);
            }

            result.insertBefore(el, result.firstChild);
        },

        openWindowClick: function(e) {

            var content = document.querySelector('.review-content');
            var clickPoint = [e.get('clientX'), e.get('clientY')];

            coords  = e.get('coords');
            
            scroll.init();

            getAddress(coords);

            function getAddress(coords) {
                ymaps.geocode(coords).then(function (res) {
                    var firstGeoObject = res.geoObjects.get(0);
                    markData = firstGeoObject.properties.get('text');
                    drawForm(markData, coords);
                });
            }

            function drawForm(markData, coords) {
                new Promise(function(resolve) {
                    var result     = document.querySelector('.review');

                    result.innerHTML = view.render('form-review', markData );

                    resolve(clickPoint);
                }).then(function() {
                    var reviewWindow = document.querySelector('.review');
                    var windowRect   = reviewWindow.getBoundingClientRect();
                    var top, left;

                    top = clickPoint[1];
                    left = clickPoint[0];

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
                    scroll.init();
                });
            }
        },
        getCoords: function() {
            return coords;
        },
        getAddress: function() {
            return markData;
        },
    };
});