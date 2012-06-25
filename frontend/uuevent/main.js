define(
[
    'uuevent/TimeLine',
    'uuevent/EventList',
    'uuevent/AsideBar',
    'uuevent/TagCloud',
    'dojo/store/JsonRest',
    'dojo/store/Memory',
    'dojo/store/Cache',
    'dojo/_base/window',
    'dojo/dom-construct',
    'dojo/dom-style',
    'dojo/topic'
],

function(TimeLine, EventList, AsideBar, TagCloud, JsonRest, Memory, Cache, win,
         domConstruct, domStyle, topic)
{
    var app = {
        init: function() {
            this.constructLED();

            var timeLine = new TimeLine({ region: 'top' }, 'time-line');
            timeLine.startup();

            var tagStore = Cache(JsonRest({ target: '/tags/' }), Memory());
            var tagCloud = new TagCloud({
                store: tagStore
            }, 'tag-cloud');
            tagCloud.startup();

            var eventStore = JsonRest({ target: '/events/' });
            var eventList = new EventList({
                store: eventStore,
                tagStore: tagStore
            }, 'event-list');
            eventList.startup();

            var asideBar = new AsideBar({}, 'aside-bar');
            asideBar.startup();

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
