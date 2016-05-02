define('actions', ['requests', 'view', 'scroll', 'map'] , function(request, view, scroll, myMap) {
    var ajax    = request();
    var result  = document.querySelector('.review');


    return {
        openWindowReview: function(address) {
            return ajax.get(address).then(function(data) {
                // data.date = data.date.toLocaleString();
                // console.log(data);
                result.innerHTML = view.render('form-review-full', data);
            }).then(function() {
                scroll.init();
            });
        },
        closeWindowReview: function() {
            result.innerHTML = '';
        },

        addReview: function( review, coords, name, place, text, date, markData ) {
            console.log(review);
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
        }
    };
});