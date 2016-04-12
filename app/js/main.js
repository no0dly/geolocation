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
        // var source     = $("#form-review").html();
        // var templateFn = Handlebars.compile(source);
        // var template   = templateFn({data: data});
        // if (myPlacemark) {
        //     myPlacemark.geometry.setCoordinates(coords);
        // }
        // else {
        //     myPlacemark = createPlacemark(coords);
        //     myMap.geoObjects.add(myPlacemark);
        //     myPlacemark.events.add('dragend', function () {
        //         getAddress(myPlacemark.geometry.getCoordinates());
        //     });
        // }
        getAddress(coords);
    }

    // function createPlacemark(coords) {
    //     return new ymaps.Placemark(coords, {
    //         iconContent: 'поиск...'
    //     }, {
    //         preset: 'islands#violetStretchyIcon',
    //         draggable: true
    //     });
    // }

    function getAddress(coords) {
        // myPlacemark.properties.set('iconContent', 'поиск...');
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
        console.log(markData);
        result.innerHTML = template;

        var content = document.querySelector('.review-content');

        Ps.initialize(content);
    }

}());



(function() {
    // var content = document.querySelector('.review-content');

    // Ps.initialize(content);
}());

