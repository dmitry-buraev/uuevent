define(
[
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/EventFull.html',
    'dojo/_base/array',
    'dojo/on',
    'dojo/mouse',
    'dojo/topic',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/dom-class',
    'dojo/dom-prop',
    'dojox/lang/functional/object'
],

function(declare, _WidgetBase, _TemplatedMixin, template, array,
         on, mouse, topic, dom, domConstruct, domClass, domProp, object)
{
    return declare('uuevent.EventShort', [_WidgetBase, _TemplatedMixin], {
        baseClass: 'event-full',

        templateString: template,

        postCreate: function() {
            var _t = this,
                dates = {};
            array.forEach(this.intervals, function(i) {
                if (!dates[i.start_date]) {
                    dates[i.start_date] = [];
                }
                dates[i.start_date].push(
                    { startTime: i.start_time, endTime: i.end_time });
            }, this);

            var dateNode;
            object.forIn(dates, function(val, key) {
                dateNode = domConstruct.create('div', {innerHTML: key });
                array.forEach(val, function(v) {
                    domConstruct.create('div', {
                        'class': 'time',
                        innerHTML: '(' +  v.startTime + (
                            v.endTime ? ' - ' + v.endTime: '') + ')'
                    }, dateNode);
                });
                domConstruct.place(dateNode, _t.intervalsNode);
            });

            array.forEach(this.tags, function(t) {
                var tagNode = domConstruct.create('div', {
                    innerHTML: t.name
                }, this.tagsNode);

                domProp.set(tagNode, 'tagId', t.id);
            }, this);

            on(this.back, 'click', function(evt) {
                topic.publish('backToList');
            });

            on(this.tagsNode, 'click', function(evt) {
                var target = evt.target;
                if (target.parentNode === this) {
                    var tagId = domProp.get(target, 'tagId');
                    topic.publish('clickedTagInEvent', tagId);
                }
            });
        }
    });
});
