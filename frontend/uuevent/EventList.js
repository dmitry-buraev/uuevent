define(
[
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_Container',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/EventList.html',
    'dojo/_base/array',
    'dojo/on',
    'dojo/topic',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/dom-style',

    'uuevent/EventShort',
    'uuevent/EventFull'
],

function(declare, _WidgetBase, _Container, _TemplatedMixin, template, array,
         on, topic, dom, domConstruct, domStyle, EventShort, EventFull)
{
    return declare('uuevent.EventList', [_WidgetBase, _TemplatedMixin, _Container], {
        baseClass: 'event-list',

        store: null,
        tagStore: null,

        templateString: template,

        currentDate: (function() {
            var dt = new Date();
            var res = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();
            return res;
        })(), //FIXME

        currentTagIds: [],

        offset: 0,
        count: 10,

        postCreate: function() {
            var _t = this,
                event,
                query = { date: _t.currentDate, offset: _t.offset, count: _t.count };

            this.store.query(query).then(function(res) { //FIXME: start and count in headers
                _t.updateEvents(res);
            });

            topic.subscribe('changeDate', function(dateText) {
                _t.currentDate = dateText;
                _t.removeEvents();
                _t.offset = 0;
                _t.updateEvents({ date: dateText, tags: _t.currentTagIds });
            });

            topic.subscribe('clickedTag', function(tagIds) {
                _t.currentTagIds = tagIds;
                _t.removeEvents();
                _t.offset = 0;
                _t.updateEvents({ date: _t.currentDate, tags: tagIds });
            });

            topic.subscribe('clickedEvent', function(eventId) {
                _t.removeEvents();
                _t.constructEventFull(eventId);
            });

            topic.subscribe('backToList', function() {
                _t.removeEvents();
                _t.offset = 0;
                _t.updateEvents({ date: _t.currentDate, tags: _t.currentTagIds });
            });

            on(this.more, 'click', function(evt) {
                _t.updateEvents({ date: _t.currentDate, tags: _t.currentTagIds,
                                  offset: _t.offset, count: _t.count });
            });

        },

        constructEventFull: function(id) {
            var _t = this;
            this.store.get(id).then(function(res) {
                var tags = [];
                array.forEach(res.tags, function(tagId) {
                    var tag = this.tagStore.get(tagId);
                    tags.push(tag);
                }, _t);

                res.tags = tags;
                var eventFull = new EventFull(res);
                _t.addChild(eventFull);
            });
        },

        updateEvents: function(query) {
            var _t = this;
            query.offset = _t.offset;
            query.count = _t.count;

            topic.publish('startLoading');
            _t.store.query(query).then(function(res) {
                _t.constructEvents(res);

                _t.offset += res.events.length;
                _t.toggleMoreNode(res.more);

                topic.publish('endLoading');
            }, function(err) {
                console.error(err);
            });
        },

        constructEvents: function(res) {
            var events = res.events;
            if (events.length > 0) {
                array.forEach(events, function(event) {
                    var tags = [];
                    array.forEach(event.tags, function(tagId) {
                        var tag = this.tagStore.get(tagId);
                        tags.push(tag);
                    }, this);

                    event.tags = tags;
                    eventShort = new EventShort(event);
                    this.addChild(eventShort);
                }, this);

            } else {
                console.log('No events');
            }
        },

        removeEvents: function() {
            array.forEach(this.getChildren(), function(event) {
                this.removeChild(event);
            }, this);

            this.toggleMoreNode(false);
        },

        toggleMoreNode: function(show) {
            if (show) {
                domStyle.set(this.more, 'display', 'block');
            } else {
                domStyle.set(this.more, 'display', 'none');
            }
        }
    });
});
