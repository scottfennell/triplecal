$(document).ready(function(){
   
   var y = $(".year");
   var m = $(".month");
   var w = $(".week");
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
   m.html(monthDays);
   w.html(weekDays);
   
   
   
   var ydh = y.height()/365; 
   var mdh = m.height()/30;
   var wdh = w.height()/7;
   
   m.on('scroll',function(e){
      var off = m.scrollTop()
      var day = Math.floor(off/mdh);
      var eday = day + 30;
      var mCls = ".month-"+Math.floor(day/30);
      y.find(".onmonth").removeClass("onmonth")
      y.find(mCls).addClass("onmonth");
      w.scrollTop(wdh * day);
   })
   
   
})

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
