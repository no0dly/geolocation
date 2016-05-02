define('view', ['map'], function( myMap ) {
    return {
        render: function( templateName, data ) {
            var source     = document.getElementById(templateName).innerHTML;
            var templateFn = Handlebars.compile(source);
            var template   = templateFn({data: data});

            return template;
        }
    };
});