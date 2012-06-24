define(
[
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/Event.html',
    'dojo/_base/array',
    'dojo/on',
    'dojo/mouse',
    'dojo/topic',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/dom-class'
],

function(declare, _WidgetBase, _TemplatedMixin, template, array,
         on, mouse, topic, dom, domConstruct, domClass)
{
    return declare('uuevent.Event', [_WidgetBase, _TemplatedMixin], {
        baseClass: 'event-short',

        templateString: template,

        postCreate: function() {
            array.forEach(this.intervals, function(i) {
                domConstruct.create('div', {
                    innerHTML: '(' +  i.start_time + (
                        i.end_time ? ' - ' + i.end_time: '') + ')'
                }, this.intervalsNode);
            }, this);

            array.forEach(this.tags, function(t) {
                domConstruct.create('div', {
                    innerHTML: t.name
                }, this.tagsNode);
            }, this);

            on(this.domNode, mouse.enter, function(evt) {
                domClass.add(this, 'hover');
            });

            on(this.domNode, mouse.leave, function(evt) {
                domClass.remove(this, 'hover');
            });
        }
    });
});
