define( 'controller', ['model','map', 'view'], function( Model, myMap, View ) {

    return {
        drawBallons: function() {
            return Model.getAllrewiev().then(function(data) {
                 View.drawBaloons(data);
            });
        },

        getMap: function() {
            return myMap.getMap();
        },

        showForm: function(e) {
            ymaps.geocode( myMap.getCoords(e) ).then(function (res) {
                var firstGeoObject = res.geoObjects.get(0);
                var markData = firstGeoObject.properties.get('text');

                View.drawForm(markData, myMap.getCoords(e));
                View.drawScroll();
                
                var closeBtn = document.querySelector('.review-title__close');
                    closeBtn.addEventListener('click', closeRewiev);

                function closeRewiev(e) {
                    var result     = document.querySelector('.review');
                    result.innerHTML = '';
                }
            });

        }
    };
});