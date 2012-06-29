define(
[
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_Container',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/CompanyList.html',
    'dojo/_base/array',
    'dojo/on',
    'dojo/topic',
    'dojo/dom',
    'dojo/dom-construct',

    'uuevent/Company'
],

function(declare, _WidgetBase, _Container, _TemplatedMixin, template, array,
         on, topic, dom, domConstruct, Company)
{
    return declare('uuevent.CompanyList', [_WidgetBase, _TemplatedMixin, _Container], {
        baseClass: 'company-list',

        templateString: template,

        postCreate: function() {
            var _t = this,
                company;

            this.constructItems();

            topic.subscribe('clickedTag', function(tags) {
                _t.removeItems();
                _t.constructItems(tags);
            });
        },

        constructItems: function(tagIds) {
            var _t = this;
            this.store.query().then(function(res) {
                array.forEach(res, function(c) {
                    company = new Company(c);
                    this.addChild(company);
                }, _t);
            }, function(err) {
                console.error(err);
            });
        },

        removeItems: function() {
            array.forEach(this.getChildren(), function(item) {
                this.removeChild(item);
            }, this);
        }
    });
});
