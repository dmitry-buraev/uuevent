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

    'uuevent/Event'
],

function(declare, _WidgetBase, _Container, _TemplatedMixin, template, array,
         on, topic, dom, domConstruct, Event)
{
    return declare('uuevent.EventList', [_WidgetBase, _TemplatedMixin, _Container], {
        baseClass: 'event-list',

        store: null,

        templateString: template,

        currentDate: (function() {
            var dt = new Date();
            var res = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();
            return res;
        })(), //FIXME

        postCreate: function() {
            var _t = this,
                event;
            this.store.query().then(function(res) {
                _t.constructEvents(res);
            });

            topic.subscribe('changeDate', function(dateText) {
                _t.currentDate = dateText;
                _t.updateEvents({ 'date': dateText });
            });

            topic.subscribe('selectedTag', function(id) {
                console.log(_t.currentDate);
                _t.updateEvents({ 'date': _t.currentDate, 'tag': id });
            });
        },

        updateEvents: function(query) {
            var _t = this;
            topic.publish('startLoading');
            _t.store.query(query).then(function(res) {
                _t.removeEvents();
                _t.constructEvents(res);
                topic.publish('endLoading');
            }, function(err) {
                console.error(err);
            });
        },

        constructEvents: function(events) {
            array.forEach(events, function(evt) {
                event = new Event(evt);
                this.addChild(event);
            }, this);
        },

        removeEvents: function() {
            array.forEach(this.getChildren(), function(event) {
                this.removeChild(event);
            }, this);
        }
    });
});
