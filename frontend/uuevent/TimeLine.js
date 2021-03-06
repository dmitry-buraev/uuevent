define(
[
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/TimeLine.html',
    'dojo/_base/array',
    'dojo/_base/fx',
    'dojo/fx/easing',
    'dojo/date',
    'dojo/on',
    'dojo/topic',
    'dojo/dom',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/dom-geometry',
    'dojo/dom-style',
    'dojo/dom-prop'
],

function(declare, _WidgetBase, _TemplatedMixin, template, array, fx, easing,  date,
         on, topic, dom, domClass, domConstruct, domGeom, domStyle, domProp)
{
    return declare('uuevent.TimeLine', [_WidgetBase, _TemplatedMixin], {
        baseClass: 'time-line',

        currentWeek: 0, //0 for current week, -1 for previous, -2 and so on
        currentWeekNode: null,

        currentDayNodeId: null,

        templateString: template,

        postCreate: function() {
            var _t = this;
            var weekNode = this.constructWeekNode();
            this.currentWeekNode = weekNode;
            domConstruct.place(weekNode, this.weeksContainer);

            this.onSwitchWeek();

            on(this.weeksContainer, 'click', function(evt) {
                var target = evt.target,
                    tClass = domProp.get(target, 'class');

                if (tClass === 'day-name' || tClass === 'date') {
                    var tParent = target.parentNode,
                        selectedDate = domProp.get(tParent, 'id');

                    topic.publish('changeDate', selectedDate);

                    var selectedDayNode = dom.byId(_t.currentDayNodeId);
                    if (selectedDayNode) {
                        domClass.remove(selectedDayNode, 'selected');
                    }
                    domClass.add(tParent, 'selected');

                    _t.currentDayNodeId = domProp.get(tParent, 'id');
                }
            });
        },

        startup: function() {
            var todayDayNodeId = this.format_date(new Date()).date,
                dayNode = dom.byId(todayDayNodeId);
            this.currentDayNodeId = todayDayNodeId;

            domClass.add(dayNode, 'selected');
        },

        onSwitchWeek: function() {
            var _t = this,
                wCStyles = domStyle.getComputedStyle(_t.weeksContainer);

            on(_t.next, 'click', function(evt) {
                _t.currentWeek++;
                var weekNode = _t.constructWeekNode();
                domConstruct.place(weekNode, _t.weeksContainer);

                var wCMarginBox= domGeom.getMarginBox(_t.weeksContainer, wCStyles),
                    step = wCMarginBox.w / 2.0,
                    l = wCMarginBox.l;
                var anim = fx.animateProperty({
                    node: _t.weeksContainer,
                    properties: {
                        left: l - step,
                        units: 'px'
                    },
                    duration: 400
                });

                on(anim, 'End', function() {
                    domConstruct.destroy(_t.currentWeekNode);
                    domStyle.set(_t.weeksContainer, 'left', '0px');

                    _t.currentWeekNode = weekNode;
                });

                anim.play();
            });

            on(_t.previous, 'click', function(evt) {
                _t.currentWeek--;
                var weekNode = _t.constructWeekNode();
                domConstruct.place(weekNode, _t.weeksContainer, 'first');

                var wCMarginBox= domGeom.getMarginBox(_t.weeksContainer, wCStyles),
                    step = wCMarginBox.w / 2.0,
                    l = wCMarginBox.l;

                var left = l - step;
                domStyle.set(_t.weeksContainer, 'left', left + 'px');

                var anim = fx.animateProperty({
                    node: _t.weeksContainer,
                    properties: {
                        left: left + step,
                        units: 'px'
                    },
                    duration: 400
                });

                on(anim, 'End', function() {
                    domConstruct.destroy(_t.currentWeekNode);
                    domStyle.set(_t.weeksContainer, 'left', '0px');

                    _t.currentWeekNode = weekNode;
                });

                anim.play();
            });

        },

        constructWeekNode: function() {
            var week = this.getWeek(),
                weekNode = domConstruct.create('div'),
                daysWrapper = domConstruct.create('div', {
                    'class': 'days-wrapper'}, weekNode);

            array.forEach(week, function(day) {
                var dayNode = domConstruct.create('div', {
                    id: day.date,
                    innerHTML: '<div class="day-name">' + day.dayName + '</div> \
                                <span class="date">' + day.strDate+ '</span>',
                    'class': 'day'
                }, daysWrapper);

                if (day.date === this.currentDayNodeId) {
                    domClass.add(dayNode, 'selected');
                }

            }, this);

            return weekNode;
        },

        getWeek: function() {
            var today = new Date(),
                weekDay = date.add(today, 'week', this.currentWeek), //Day of target week
                day_num = (weekDay.getDay() !== 0) ? weekDay.getDay() : 7,
                monday = date.add(weekDay, 'day', - (day_num - 1)),
                week = [this.format_date(monday)];
            for (var i=1; i<7; i++) {
                var day = date.add(monday, 'day', i);
                week.push(this.format_date(day));
            }
            return week;
        },

        format_date: function(date) {
            var day_names = [
                    'ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'
                ],
                month_names = [
                    'Янв', 'Фев', 'Март', 'Апр',
                    'Май', 'Июн', 'Июл', 'Авг',
                    'Сен', 'Окт', 'Дек'
                ];

            var res = {};
            res['dayName'] = day_names[date.getDay()];
            res['strDate'] = date.getDate() + ' ' + month_names[date.getMonth()];
            res['date'] = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

            return res;
        }
    });
});
