define('map', function( ) {
    return {
        getMap: function() {
             return new ymaps.Map("map", {
                center: [55.76, 37.64], 
                zoom: 14
            });
        },

        getClusterer: function() {

            var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
                '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
                '<div class=ballon_body><a class=ballon_link href="#">{{ properties.balloonContentBody|raw }}</a></div>' +
                '<div class=ballon_content>{{ properties.balloonContentContent|raw }}</div>' +
                '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
            );

            var clusterer = new ymaps.Clusterer({
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
            return clusterer;
        }
    };
});