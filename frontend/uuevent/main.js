define(
[
    'dijit/layout/BorderContainer',
    'uuevent/TimeLine'
],

function(BorderContainer, TimeLine)
{
    var app = {
        init: function() {
            var layout = new BorderContainer({
                design: 'headline'
            }, 'app-layout');

            layout.addChild(new TimeLine({ region: 'top' }));

            layout.startup();
        }
    };
    return app;
});
