define('events', ['controller', 'map'] , function( Controller, myMap ) {
    return {
        
        clickOnMapListener: function() {
            return myMap.getMap().events.add('click', Controller.showForm);
        },

        // closeBtn: function() {
        //     var closeBtn = document.querySelector('.review-title__close');
        //         closeBtn.addEventListener('click', closeRewiev);

        //     function closeRewiev(e) {
        //         var result     = document.querySelector('.review');
        //         result.innerHTML = '';
        //     }
        // }
    };
});