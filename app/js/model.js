define('model', ['map'], function( myMap ) {
    return {
        getAllrewiev: function() {
            return new Promise(function(resolve, reject) {
                var xhr  = new XMLHttpRequest();
                var reqData = {op: "all"};

                xhr.open('POST', 'http://localhost:3000/');

                xhr.onload = function(e) {
                    var data = JSON.parse(xhr.response);
                    resolve(data);
                };
                xhr.onerror = function(e) {
                    console.log(e, 'kookooo');
                    reject(new Error('problem?'));
                };

                xhr.send(JSON.stringify(reqData));
            });
        },

        getReviewsByAddress: function(e) {
            if(e.target.classList.contains('ballon_link')) {
                new Promise(function(resolve, reject) {
                    var link      = e.target;
                    var linkText  = link.innerText;
                    var req       = {
                        op: "get",
                        address: linkText
                    };
                    var xhrReview = new XMLHttpRequest();

                    xhrReview.open('POST', 'http://localhost:3000/');
                    xhrReview.onload = function() {
                        var data = JSON.parse(xhrReview.response);
                        resolve(data);
                    };
                    xhrReview.send(JSON.stringify(req));
                });
            }
        },

        addReview: function(e) {
            e.preventDefault();
            var xhr      = new XMLHttpRequest();
            var name     = form.firstName.value;
            var place    = form.place.value;
            var text     = form.rewiev.value;
            var date     = new Date();
            var data = {
                'op': 'add',
                'review': {
                    'coords':{
                        'x': coords[0],
                        'y': coords[1]
                    },
                    'address': markData,
                    'name'   : name,
                    'place'  : place,
                    'text'   : text,
                    'date'   : date.toUTCString()
                }  
            };

            xhr.open('POST', 'http://localhost:3000/');
            xhr.send(JSON.stringify(data));
            xhr.onload = function() {
                var data = JSON.parse(xhr.response);
                if(data.error) {
                    return false;
                }
                console.log('data was sended.');
                addReview( name, place, text, date );

                form.firstName.value  = '';
                form.place.value = '';
                form.rewiev.value  = '';

                clusterer.add(new ymaps.Placemark( coords, {
                    }, {
                        preset: 'islands#icon',
                        iconColor: '#b51eff'
                    }));

                myMap.get().geoObjects.add(clusterer);
                    
            };
        }
    };
});