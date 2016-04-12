(function() {
    ymaps.ready(init);
    var myMap,
        myPlacemark,
        markData;
        

    function init() {
        

        myMap = new ymaps.Map("map", {
            // center: [36.09922199, -115.12871905], 
            // zoom: 14
            center: [55.76, 37.64], 
            zoom: 14
        });

        myMap.events.add('click', openForm);
    }

    function openForm(e) {
        var coords     = e.get('coords');
        var content = document.querySelector('.review-content');

        if(content) {
            Ps.initialize(content);
        }

        getAddress(coords);
    }

    function getAddress(coords) {
        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);
            markData = firstGeoObject.properties.get('text');
        });
        
        drawForm(markData);
    }

    function drawForm(markData) {
        var source     = document.getElementById('form-review').innerHTML;
        var templateFn = Handlebars.compile(source);
        var template   = templateFn({data: markData});
        var result     = document.querySelector('.review');

        result.innerHTML = template;

        // scroll
        addScroll();

        var closeBtn = document.querySelector('.review-title__close');
        closeBtn.addEventListener('click', closeRewiev);
    }

    function addScroll() {
        var content = document.querySelector('.review-content');
        Ps.initialize(content);
    }

    function closeRewiev(e) {
        var result     = document.querySelector('.review');

        result.innerHTML = '';
    }

}());



(function() {
    // var content = document.querySelector('.review-content');

    // Ps.initialize(content);
}());

