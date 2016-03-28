$(document).ready(function(){

  run();
  return;
  var y = $(".toplayer .year");
  var m = $(".toplayer .month");
  var w = $(".toplayer .week");
  var yearpos = $(".backdrop .yearpos");
  var mdaysHolder = m.find('.days');

  var cont = ""
  var monthDays = "";
  var weekDays = "";
  for(var i = 0; i < 365; i++){
    var mc = "month-" + Math.floor(i/30);
    var dc = "day-" + i;
    var cls = "day " + getDay(i) + " " + mc + " " + dc;
    var style = "width: "+ randPct() + "%;"
    cont += "<div class='"+ cls +"' style='"+style+"'></div>"
    monthDays += "<div class='" + cls  + "'>" + mc + " " + dc + "</div>"
    weekDays += "<div class='" + cls + "'>" + dc + "</div>";
  }

  y.html(cont);
  mdaysHolder.html(monthDays);
  w.html(weekDays);


  var ydh = y.height()/365;
  var mdh = m.height()/30;
  var wdh = w.height()/7;
  var height = y.height();
  var backHeight = height * 0.08129;
  var totalMonthHeight = (mdh-1) * 365;

  m.on('scroll',function(e){
    var off = m.scrollTop();
    var posPct = off/ (totalMonthHeight - height);
    var scaledPrct = off/mdh;
    var day = Math.floor(scaledPrct);
    var eday = day + 30;
    var mCls = ".month-" + Math.floor(day/30);
    y.find(".onmonth").removeClass("onmonth");
    y.find(mCls).addClass("onmonth");
    w.scrollTop(wdh * scaledPrct);
    yearpos.css({top:(posPct*(height-backHeight))});
  });
});

function randPct() {
   return Math.floor(Math.random() * 50) + 25;
}

function getDay(v) {
  var s = v % 7;
  switch(s){
    case 1: return "mon";
    case 2: return "tue";
    case 3: return "wed";
    case 4: return "thu";
    case 5: return "fri";
    case 6: return "sat";
    case 0: return "sun";
    default:
      console.log("Default case",s)
      return "mon";
  }
}

function run() {
    var days = [];
    var months = [
        {name: 'Jan', ndays: 31, days:[]},
        {name: 'Feb', ndays: 28, days:[]},
        {name: 'Mar', ndays: 31, days:[]},
        {name: 'Apr', ndays: 30, days:[]},
        {name: 'May', ndays: 31, days:[]},
        {name: 'Jun', ndays: 30, days:[]},
        {name: 'Jul', ndays: 31, days:[]},
        {name: 'Aug', ndays: 31, days:[]},
        {name: 'Sep', ndays: 30, days:[]},
        {name: 'Oct', ndays: 31, days:[]},
        {name: 'Nov', ndays: 30, days:[]},
        {name: 'Dec', ndays: 31, days:[]}
    ];
    var now = new Date();
    var jan1 = new Date(now.getFullYear(), 1, 1);
    var offset = jan1.getDay();
    var dom = 1;
    var monthIdx = 0;
    var month = months[0];

    for(var i = 0; i < 365; i++) {
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
        month.days.push(day)
        dom++;
    }
    var month = d3.select("#yearCol").selectAll('div.month')
        .data(months)
        .enter()
        .append('div')
        .attr('class', function(d) {
            var extra = (d.ndays > 30) ? 'odd' : 'even';
            console.log("month",d, extra)
            return 'month ' + extra
        })

    month.append('div').attr('class','monthlabel')
        .text(function(d) {
            return d.name
        })

    month.selectAll('div.day').data(function(d){
        return d.days;
    }).enter().append('div')
        .attr('style',function(day) { return 'width:' + (day.dow * 10) + '%' })
        .attr('class', function(day) {
            return 'day '+ getDay(day.dow)
        })

    var monthViewMonth = d3.select('#monthViewCol').selectAll('div.mmonth')
        .data(months)
        .append('div')
        .attr('class', function(d){ return 'mmonth ' + d.ndays +'days'; });

    monthViewMonth.selectAll('div.month')
        .data(function(d) {return d.days})
        .enter()
        .append('div')
        .attr('class', function(day) {
            return 'day '+ getDay(day.dow)
        });

}
