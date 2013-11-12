var format = d3.time.format("%Y-%m-%d");

function formatNumber(num)
{
  var p = num+'';
  return p.split("").reverse().reduce(function(acc, num, i, orig) {
      return  num + (i && !(i % 3) ? "," : "") + acc;
  }, "");

}


function drawGraph(selector,data)
{
  data.map(function(d){
    d.date = new Date(d.date);
  });


  data.sort(function(a,b){
    if (a.date<b.date)
    {
      return -1;
    }
    if (a.date>b.date)
    {
      return 1;
    }
    return 0;
  });

  d3.select(selector).datum(data).call(
    timechart()
      .mouseover(function(d){
        var map ={'total':'total','date':'date','dau':'actif','new':'created'};
        for (var k in map)
        {

          if (!$('#'+k).data('default'))
          {
            $('#'+k).data('default',$('#'+k).text());
          }
          if (k == 'date')
          {
            $('#'+k).text(moment(d[k]).format('MMMM Do'));
          } else {
            $('#'+k).text(formatNumber(d[map[k]]));
          }

        }
      })
  );
}

$(document).on('ready',function(){

  $('.daterange').daterangepicker(
    {
      format    : 'YYYY-MM-DD',
      opens     : 'left',
      minDate   : '2013-10-01',
      maxDate   : moment(),
      startDate : moment().subtract('months', 1),
      endDate : moment().subtract('months', 1)
    },
    function(start, end) {
      $.getJSON('/json?date_start='+start.format('YYYY-MM-DD')+'&date_end='+end.format('YYYY-MM-DD'),function(data){
        drawGraph('.graph', data);
      });
    }
  );

  drawGraph('.graph', data);


});