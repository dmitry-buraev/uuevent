define(
[
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/EventList.html',
    'dojo/_base/array',
    'dojo/on',
    'dojo/topic',
    'dojo/dom',
    'dojo/dom-construct',

    'uuevent/Event'
],

function(declare, _WidgetBase, _TemplatedMixin, template, array,
         on, topic, dom, domConstruct, Event)
{
    return declare('uuevent.EventList', [_WidgetBase, _TemplatedMixin], {
        baseClass: 'event-list',

        store: null,

        templateString: template,

        postCreate: function() {
            this.store.query().then(function(res) {
                array.forEach(res, function(event) {
                    console.log(event);
                });
            });
        }
    });
});
