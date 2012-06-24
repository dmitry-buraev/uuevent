define(
[
    'dijit/layout/BorderContainer',
    'uuevent/TimeLine',
    'uuevent/EventList',
    'uuevent/AsideBar',
    'dojo/store/JsonRest',
    'dojo/_base/window',
    'dojo/dom-construct',
    'dojo/dom-style',
    'dojo/topic'
],

function(BorderContainer, TimeLine, EventList, AsideBar, JsonRest, win,
         domConstruct, domStyle, topic)
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

            this.constructLED();
        },

        constructLED: function() {
            var LEDNode = domConstruct.create('div', {
                id: 'LED',
                innerHTML: 'загрузка'
            }, win.body());

            topic.subscribe('startLoading', function() {
                domStyle.set(LEDNode, 'display', 'block');
            });

            topic.subscribe('endLoading', function() {
                domStyle.set(LEDNode, 'display', 'none');
            });
        }
    };
    return app;
});
