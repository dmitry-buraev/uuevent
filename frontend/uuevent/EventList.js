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

        postCreate: function() {
            var _t = this,
                event;
            this.store.query().then(function(res) {
                array.forEach(res, function(evt) {
                    event = new Event(evt);
                    _t.addChild(event);
                });
            });
        }
    });
});
