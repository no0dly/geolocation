define('requests', function() {
    var server  = 'http://localhost:3000/';
    var reqType = 'POST';

    return function() {
        function ajaxReview(data) {
            return new Promise(function(resolve, reject) {
                var xhr  = new XMLHttpRequest();

                xhr.open( reqType, server );

                xhr.onload = function(e) {

                    if (xhr.response.error) {
                        reject(new Error(xhr.response.error.message));
                    }

                    resolve(JSON.parse(xhr.response));
                };
                console.log(JSON.stringify(data));
                xhr.send(JSON.stringify(data));
            });
        }
        return {
            all: function() {
                return ajaxReview({op: "all"});
            },
            get: function(address) {
                return ajaxReview({op: "get", address: address});
            },
            add: function(review) {
                return ajaxReview({op: 'add', review: review});
            }
        };
    };
    


});