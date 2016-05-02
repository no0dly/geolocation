define('scroll', function() {
    return {
        init: function() {
            var content = document.querySelector('.review-content');

            if(content) {
                Ps.initialize(content);
            }
        }
    };
});