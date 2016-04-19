define('model', function() {
    return {
        create: function() {
            new Promise(function(resolve) {
                var myMap = new ymaps.Map("map", {
                    center: [55.76, 37.64], 
                    zoom: 14
                });
                resolve(myMap);
            });
        },

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

        getBaloonRewiev: function(e) {
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
                        console.log(data);
                        resolve(data);
                    };
                    xhrReview.send(JSON.stringify(req));
                }).then(function(data) {
                    var source     = document.getElementById('form-review-full').innerHTML;
                    var templateFn = Handlebars.compile(source);
                    var template   = templateFn({data: data});
                    var result     = document.querySelector('.review');

                    result.innerHTML = template;
                });
            }
        }
    };
});