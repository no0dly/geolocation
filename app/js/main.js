(function() {

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
    }).then(function(val) {
        val.events.add('click', openForm);


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

               drawForm(markData);
            });
        }

        function drawForm(markData) {
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
            });
        }

    });

}());



(function() {
    // var content = document.querySelector('.review-content');

    // Ps.initialize(content);
}());

