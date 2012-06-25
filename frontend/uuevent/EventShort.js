define(
[
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/EventShort.html',
    'dojo/_base/array',
    'dojo/on',
    'dojo/mouse',
    'dojo/topic',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/dom-class',
    'dojo/dom-prop'
],

function(declare, _WidgetBase, _TemplatedMixin, template, array,
         on, mouse, topic, dom, domConstruct, domClass, domProp)
{
    return declare('uuevent.EventShort', [_WidgetBase, _TemplatedMixin], {
        baseClass: 'event-short',

        templateString: template,

        postCreate: function() {
            var _t = this;

            array.forEach(this.intervals, function(i) {
                domConstruct.create('div', {
                    innerHTML: '(' +  i.start_time + (
                        i.end_time ? ' - ' + i.end_time: '') + ')'
                }, this.intervalsNode);
            }, this);

            array.forEach(this.tags, function(t) {
                var tag = domConstruct.create('div', {
                    innerHTML: t.name
                }, this.tagsNode);

                domProp.set(tag, 'tagId', t.id);
            }, this);

            on(this.button, 'click', function(evt) {
                topic.publish('clickedEvent', _t.item_id);
            });

            on(this.tagsNode, 'click', function(evt) {
                var target = evt.target;
                if (target.parentNode === this) {
                    var tagId = domProp.get(target, 'tagId');
                    topic.publish('clickedTagInEvent', tagId);
                }
            });

            on(this.domNode, mouse.enter, function(evt) {
                domClass.add(this, 'hover');
            });

            on(this.domNode, mouse.leave, function(evt) {
                domClass.remove(this, 'hover');
            });
        }

    });
});
