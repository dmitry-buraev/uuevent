define(
[
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/TagCloud.html',
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
    return declare('uuevent.TagCloud', [_WidgetBase, _TemplatedMixin], {
        baseClass: 'tag-cloud',

        store: null,

        templateString: template,

        postCreate: function() {
            var _t = this;
            this.store.query().then(function(res) {
                _t.constructTags(res);
            }, function(err) {
                console.error(err);
            });
        },

        constructTags: function(tags) {
            array.forEach(tags, function(tag) {
                domConstruct.create('div', {
                    innerHTML: tag.name
                }, this.containerNode);
            }, this);
        }
    });
});
