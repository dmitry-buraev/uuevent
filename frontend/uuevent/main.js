define(
[
    'dijit/layout/BorderContainer'
],

function(BorderContainer)
{
    var app = {
        init: function() {
            var layout = new BorderContainer({
                design: 'headline'
            }, 'app-layout');

            layout.startup();
        }
    };
    return app;
});
