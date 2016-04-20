define('map', ['view'], function( View ) {
    return {
        getMap: function() {
             return new ymaps.Map("map", {
                center: [55.76, 37.64], 
                zoom: 14
            });
        },

        getClusterer: function() {
            var clusterer = new ymaps.Clusterer({
                preset: 'islands#invertedVioletClusterIcons',
                groupByCoordinates: false,
                clusterDisableClickZoom: true,
                clusterHideIconOnBalloonOpen: false,
                clusterOpenBalloonOnClick: true,
                geoObjectHideIconOnBalloonOpen: false,
                clusterBalloonContentLayout: 'cluster#balloonCarousel',
                clusterBalloonItemContentLayout: View.ballonTemplate(),
                clusterBalloonPanelMaxMapArea: 0,
                clusterBalloonContentLayoutWidth: 200,
                clusterBalloonContentLayoutHeight: 130,
                clusterBalloonPagerSize: 5
            });
            return clusterer;
        }
    };
});