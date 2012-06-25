define(
[
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/TagCloud.html',
    'dojo/_base/array',
    'dojo/on',
    'dojo/topic',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/dom-prop',
    'dojo/dom-class',
    'dijit/form/CheckBox'
],

function(declare, _WidgetBase, _TemplatedMixin, template, array,
         on, topic, dom, domConstruct, domProp, domClass, CheckBox)
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
                if (domClass.contains(target, 'tag')) {
                    var tagIds = _t.getSelectedTagIds(target);
                    topic.publish('clickedTag', tagIds);
                } else if (domClass.contains(target, 'all')) {
                    array.forEach(_t.selectedTagNodes, function(tagNode) {
                        domClass.remove(tagNode, 'selected');
                    });
                    domClass.add(target, 'selected');
                    _t.selectedTagNodes = [];
                    topic.publish('clickedTag', []);
                }
            });

            topic.subscribe('clickedTagInEvent', function(id) {
                topic.publish('clickedTag', [id]);
                array.forEach(_t.selectedTagNodes, function(tagNode) {
                    domClass.remove(tagNode, 'selected');
                });
                domClass.remove(_t.allTag, 'selected');

                var tagNode = dom.byId('tag' + id);
                domClass.add(tagNode, 'selected');
                _t.selectedTagNodes.push(tagNode);
            });
        },

        getSelectedTagIds: function(tag) {
            var _t = this,
                sTags = this.selectedTagNodes,
                tIndex = array.indexOf(sTags, tag);

            function markTag() {
                sTags.push(tag);
                domClass.add(tag, 'selected');
                if (domClass.contains(_t.allTag, 'selected')) {
                    domClass.remove(_t.allTag, 'selected');
                }
            }

            function unmarkTag() {
                _t.selectedTagNodes = array.filter(sTags, function(t) {
                    return t.innerHTML !== tag.innerHTML;
                });
                domClass.remove(tag, 'selected');

                if (_t.selectedTagNodes.length === 0) {
                    domClass.add(_t.allTag, 'selected');
                }
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
            var all = domConstruct.create('div', {
                'class': 'all selected',
                innerHTML: 'ВСЕ'
            }, this.containerNode);

            this.allTag = all;

            array.forEach(tags, function(tag) {
                var tagNode = domConstruct.create('div', {
                    id: 'tag' + tag.id,
                    'class': 'tag',
                    innerHTML: tag.name
                }, this.containerNode);

                domProp.set(tagNode, 'tag_id', tag.id);

            }, this);
        }
    });
});
