define(
[
    'dijit/layout/BorderContainer',
    'uuevent/TimeLine',
    'uuevent/EventList',
    'uuevent/AsideBar',
    'dojo/store/JsonRest'
],

function(BorderContainer, TimeLine, EventList, AsideBar, JsonRest)
{
    var app = {
        init: function() {
            var layout = new BorderContainer({
                design: 'headline'
            }, 'app-layout');

            var timeLine = new TimeLine({ region: 'top' });
            layout.addChild(timeLine);

            var eventStore = JsonRest({ target: '/events/' });
            var eventList = new EventList({
                region: 'center',
                store: eventStore
            });
            layout.addChild(eventList);

            var asideBar = new AsideBar({ region: 'right'  });
            layout.addChild(asideBar);

            layout.startup();
        }
    };
    return app;
});
