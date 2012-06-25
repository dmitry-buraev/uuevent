define(
[
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/TagCloud.html',
    'dojo/_base/array',
    'dojo/on',
    'dojo/topic',
    'dojo/dom-construct',
    'dojo/dom-prop',
    'dojo/dom-class',
    'dijit/form/CheckBox'
],

function(declare, _WidgetBase, _TemplatedMixin, template, array,
         on, topic, domConstruct, domProp, domClass, CheckBox)
{
    return declare('uuevent.TagCloud', [_WidgetBase, _TemplatedMixin], {
        baseClass: 'tag-cloud',

        store: null,

        templateString: template,

        selectedTagNode: null,

        postCreate: function() {
            var _t = this;
            this.store.query().then(function(res) {
                _t.constructTags(res);
            }, function(err) {
                console.error(err);
            });

            on(this.domNode, 'click', function(evt) {
                var target = evt.target,
                    tClass = domProp.get(target, 'class');
                if (tClass && tClass === 'tag') {
                    var tag_id = domProp.get(target, 'tag_id');
                    _t.selectTag(target);
                    topic.publish('selectedTag', tag_id);
                }
            });
        },

        selectTag: function(tag) {
            if (this.selectedTagNode) {
                domClass.remove(this.selectedTagNode, 'selected');
            }
            domClass.add(tag, 'selected');
            this.selectedTagNode = tag;
        },

        constructTags: function(tags) {
            array.forEach(tags, function(tag) {
                var tagNode = domConstruct.create('div', {
                    'class': 'tag',
                    innerHTML: tag.name
                }, this.containerNode);

                domProp.set(tagNode, 'tag_id', tag.id);

            }, this);
        }
    });
});
