define('actions', ['requests', 'view', 'scroll'] , function(request, view, scroll) {
    var ajax    = request();
    var result  = document.querySelector('.review');


    return {
        openWindowReview: function(address) {
            return ajax.get(address).then(function(data) {
                result.innerHTML = view.render('form-review-full', data);
            }).then(function() {
                scroll.init();
            });
        },
        closeWindowReview: function() {
            result.innerHTML = '';
        },

        addReview: function(review) {
            console.log(review);
            return ajax.add(review).then(function(data) {
                // var form = document.querySelector('.review-form');

                // clusterer.add(new ymaps.Placemark( coords, {
                //     balloonContentHeader: place,
                //     balloonContentBody: markData,
                //     balloonContentContent: text,
                //     balloonContentFooter: date.toLocaleString()
                // }, {
                //     preset: 'islands#icon',
                //     iconColor: '#b51eff'
                // }));

                // form.firstName.value  = '';
                // form.place.value = '';
                // form.rewiev.value  = '';

                // myMap.geoObjects.add(clusterer);
            });
        },
        addReviewComment: function() {
            
        }
    };
});