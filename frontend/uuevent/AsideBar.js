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
    'dojo/dom-construct'
],

function(declare, _WidgetBase, _TemplatedMixin, template, array,
         on, topic, dom, domConstruct)
{
    return declare('uuevent.AsideBar', [_WidgetBase, _TemplatedMixin], {
        baseClass: 'aside-bar',

        templateString: template,

        postCreate: function() {
            console.log('postCreate');
        }
    });
});
