define(
[
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/TimeLine.html'
],

function(declare, _WidgetBase, _TemplatedMixin, template)
{
    return declare('uuevent.TimeLine', [_WidgetBase, _TemplatedMixin], {
        baseClass: 'time-line',

        templateString: template,

        postCreate: function() {
            console.log('postCreate');
        }
    });
});
