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
    d3.select("#yearCol").selectAll('div.day')
    .data(d3.range(0,365))
    .enter()
    .append('div')
    .attr('style','width:' + randPct() + '%')
    .attr('class',function(day) { return 'day '+ getDay(day)})
}
