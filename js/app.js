$(document).ready(function () {
    run();
    return;
});

function run() {
    var months = generateData();
    window.months = months;
    createYearColumn(months);
    createMonthColumn(months);
    createWeekColumn(months);
    addClickListeners();
    addScrollListener();
}

function updateData() {
    createYearColumn(window.months);
    createMonthColumn(window.months);
    createWeekColumn(window.months);
}

function addClickListeners() {
    document.getElementById('weekToggle').onclick = function(event) {
        document.getElementById('monthViewCol').classList.toggle('week');
    }
}

function scrollTopTween(element, scrollTop) {
    return function () {
        var i = d3.interpolateNumber(element.attr('scrollTop') || 0, scrollTop);
        return function (t) {
            element.node().scrollTop = i(t);
        };
    };
}

function updateColumn(element) {
    var monthElements, monthsEnter, daySelection, daySelectionEnter;

    monthElements = element
        .selectAll('div.month')
        .data(months)

    //Enter
    monthsEnter = monthElements.enter()
            .append('div')
            .attr('class', function (d) {
                var extra = (d.ndays > 30) ? 'odd' : 'even';
                if (d.current) {
                    extra += ' current-month';
                }
                return 'month ' + extra;
            })
            .on('click', function (d, i) {
                var coords = d3.mouse(this);
            });


    monthsEnter.append('div')
        .attr('class', 'month-label')
        .text(function (d) {
            return d.name;
        });

    daySelection = monthsEnter.selectAll('div.day')
        .data(function (d) {
            return d.days;
        });

    daySelectionEnter = daySelection
        .enter()
        .append('div')
        .attr('class', getDayClass)
        .on('click', function (d, i) {
            var coords = d3.mouse(this);
            console.log("Day click")
        });

    daySelection.selectAll('.event')
        .data(function (d) {
            return d.events || [];
        })
        .enter()
        .append('div')
        .attr('class', getEventClass);
}

function createYearColumn(months) {
    var monthElements, monthsEnter, daySelection, daySelectionEnter;

    monthElements = d3.select("#yearCol")
        .selectAll('div.month')
        .data(months)

    //Enter
    monthsEnter = monthElements.enter()
            .append('div')
            .attr('class', function (d) {
                var extra = (d.ndays > 30) ? 'odd' : 'even';
                if (d.current) {
                    extra += ' current-month';
                }
                return 'month ' + extra;
            })
            .on('click', function (d, i) {
                var coords = d3.mouse(this);
                var height = d3.select('#monthViewCol').node().getBoundingClientRect().height;
                d3.select('#monthViewCol')
                    .transition()
                    .duration(200)
                    .tween('scrolltomonth', scrollTopTween(d3.select("#monthViewCol"), height * i));
            });

    monthsEnter.append('div').attr('class', 'month-label')
        .text(function (d) {
            return d.name;
        });

    daySelection = monthsEnter.selectAll('div.day')
        .data(function (d) {
            return d.days;
        });

    daySelectionEnter = daySelection
        .enter()
        .append('div')
        .attr('style', function (day) {
            return 'width:' + (day.dow * 10) + '%';
        })
        .attr('class', function (day) {
            return 'day ' + getDay(day.dow);
        });

    daySelection.selectAll('.event').data(function (d) {
        return d.events || [];
    }).enter().append('div').attr('class', 'event');

}

function createMonthColumn(months) {
    var monthDays, monthElements, monthEnter, daySelection, monthDaysElement, days, daysEvents;
    var monthElements = d3.select('#monthViewCol')
        .selectAll('div.month')
        .data(months);

    monthEnter = monthElements.enter().append('div')
            .attr('class', function (d) {
                var cls = 'month d' + d.ndays + 'days';
                cls += (d.current) ? ' current-month' : '';
                return cls;
            });

    monthEnter.append('div')
        .attr('class', 'month-label')
        .text(function (m) {
            return m.name;
        });
    monthEnter.append('div').attr('class', 'days');
    monthDaysElement = monthElements.select('.days')
    days = monthDaysElement.selectAll('.day')
        .data(function (d) {
            return d.days;
        })

    days.enter().append('div')
            .attr('class', function (day) {
                var cls = 'day ' + getDay(day.dow);
                if (day.current) {
                    cls += ' current-day';
                }
                return cls;
            })
            .text(function (d) {
                return d.month.name + ' - ' + d.dom + ' [' + getDay(d.dow) + ']' ;
            });

    daysEvents = days.selectAll('.event').data(function (d) { return d.events || []; })
    daysEvents.enter()
        .append('span')
        .attr('class', 'event')
        .attr('style', function (e) {
            var start = moment(e.start.dateTime).hour();
            var end = moment(e.end.dateTime).hour();
            var startP = (100 / 24) * start;
            var endP = 100 - ((100 / 24) * end);
            return "left: " + startP + "%; " + "right:" + endP + "%";
        })
        .text(function (e) { return e.summary; });

    daysEvents.exit().remove();
}

function createWeekColumn(months) {
    var weekView, weekViewEnter, days, daysEnter;
    weekView = d3.select('#weekViewCol')
        .selectAll('div.month')
        .data(months)

    weekViewEnter = weekView.enter()
        .append('div')
        .attr('class', function (d) {
            return 'month d' + d.ndays + 'days';
        });

    days = weekView.selectAll('div.day')
        .data(function (d) {
            return d.days;
        });

    daysEnter = days
        .enter()
        .append('div')
        .attr('class', function (day) {
            var cls = 'day ' + getDay(day.dow);
            if (day.current) {
                cls += ' current-day';
            }
            return cls;
        })
        .text(function (d) {
            return d.month.name + ' - ' + d.dom + ' [' + getDay(d.dow) + ']' ;
        });

    daysEvents = days.selectAll('.event').data(function (d) { return d.events || []; })
    daysEvents.enter()
        .append('span')
        .attr('class', 'event')
        .attr('style', function (e) {
            var start = moment(e.start.dateTime).hour();
            var end = moment(e.end.dateTime).hour();
            var startP = (100 / 24) * start;
            var endP = 100 - ((100 / 24) * end);
            return "left: " + startP + "%; " + "right:" + endP + "%";
        })
        .text(function (e) { return e.summary; });

}

function addScrollListener() {
    var y = $("#yearCol"),
        m = $('#monthViewCol'),
        w = $("#weekViewCol"),
        yearpos = $("#yearpos"),
        monthWindowHeight = m.height(),
        mdh = $("#monthViewCol .dat").first().height(),
        wdh = w.height() / 7,
        height = y.height(),
        backHeight = height * 0.08129,
        totalMonthHeight = mdh * 365,
        weekScroll = null,
        monthScroll = null;

    m.on('scroll', function (e) {
        if (weekScroll !== null) return;
        var off = m.scrollTop();
        var posPct = off / (totalMonthHeight - monthWindowHeight);
        var scaledPrct = off / mdh;
        var day = Math.floor(scaledPrct);
        var eday = day + 30;
        var mCls = ".month-" + Math.floor(day / 30);
        if (monthScroll) {
            clearTimeout(monthScroll);
            monthScroll = null;
        }

        y.find(".onmonth").removeClass("onmonth");
        y.find(mCls).addClass("onmonth");
        w.scrollTop(wdh * scaledPrct);
        yearpos.css({
            top: (posPct * (height - backHeight))
        });
        monthScroll = setTimeout(function () {
            monthScroll = null;
        }, 50);
    });

    w.on('scroll', function (e) {
        if (monthScroll !== null) return;
        var off = w.scrollTop();
        var posPct = off / (((wdh - 1) * 365) - height);
        var scaledPrct = off / wdh;
        if (weekScroll !== null) {
            clearTimeout(weekScroll);
            weekScroll = null;
        }
        m.scrollTop(mdh * scaledPrct);
        weekScroll = setTimeout(function () {
            weekScroll = null;
        }, 50);
    })
}

function randPct() {
    return Math.floor(Math.random() * 50) + 25;
}

function getDay(v) {
    var s = v % 7;
    switch (s) {
        case 1:
            return "mon";
        case 2:
            return "tue";
        case 3:
            return "wed";
        case 4:
            return "thu";
        case 5:
            return "fri";
        case 6:
            return "sat";
        case 0:
            return "sun";
        default:
            console.log("Default case", s);
            return "mon";
    }
}

function getDayClass(day) {
    return 'day' + getDay(day);
}

function getEventClass(event) {
    return 'event';
}

function generateData() {
    var months = [{
        name: 'Jan',
        ndays: 31,
        days: []
    }, {
        name: 'Feb',
        ndays: 28,
        days: []
    }, {
        name: 'Mar',
        ndays: 31,
        days: []
    }, {
        name: 'Apr',
        ndays: 30,
        days: []
    }, {
        name: 'May',
        ndays: 31,
        days: []
    }, {
        name: 'Jun',
        ndays: 30,
        days: []
    }, {
        name: 'Jul',
        ndays: 31,
        days: []
    }, {
        name: 'Aug',
        ndays: 31,
        days: []
    }, {
        name: 'Sep',
        ndays: 30,
        days: []
    }, {
        name: 'Oct',
        ndays: 31,
        days: []
    }, {
        name: 'Nov',
        ndays: 30,
        days: []
    }, {
        name: 'Dec',
        ndays: 31,
        days: []
    }];

    var now = new Date();
    var jan1 = new Date(now.getFullYear(), 0, 1);
    var offset = jan1.getDay();
    console.log("Offset day?", offset, jan1);
    var dom = 1;
    var monthIdx = 0;
    var month = months[0];
    var nowmonth = now.getMonth();
    var nowday = now.getDate();

    for (var i = 0; i < 365; i++) {
        if (dom > month.ndays) {
            dom = 1;
            monthIdx++;
            month = months[monthIdx];
        }

        let day = {
            day: i,
            month: month,
            dom: dom,
            dow: (offset + i) % 7
        };
        if (monthIdx === nowmonth) {
            month.current = true;
            if (dom === nowday) {
                console.log("nowday!", dom,  month, day);
                day.current = true;
            }
        }
        month.days.push(day)
        dom++;
    }

    return months;
}
