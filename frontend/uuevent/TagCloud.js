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

        selectedTagNodes: [],

        postCreate: function() {
            var _t = this;
            this.store.query().then(function(res) {
                _t.constructTags(res);
            }, function(err) {
                console.error(err);
            });

            on(this.domNode, 'click', function(evt) {
                var target = evt.target;
                if (target.parentNode === _t.containerNode) {
                    var tagIds = _t.getSelectedTagIds(target);
                    topic.publish('clickedTag', tagIds);
                }
            });
        },

        getSelectedTagIds: function(tag) {
            var _t = this,
                sTags = this.selectedTagNodes,
                tIndex = array.indexOf(sTags, tag);

            function markTag() {
                sTags.push(tag);
                domClass.add(tag, 'selected');
            }

            function unmarkTag() {
                _t.selectedTagNodes = array.filter(sTags, function(t) {
                    return t.innerHTML !== tag.innerHTML;
                });
                domClass.remove(tag, 'selected');
            }
            if (tIndex === -1) {
                markTag();
            } else {
                unmarkTag();
            }
            return array.map(_t.selectedTagNodes, function(t) {
                    return domProp.get(t, 'tag_id');
                });
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
