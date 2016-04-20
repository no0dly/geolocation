define('map', function() {
    return {
        getMap: function() {
            return new ymaps.Map("map", {
                center: [55.76, 37.64], 
                zoom: 14
            });
        },
    };
});