var sizes = {
  big:{
    width:800,
    height:460,
    margins:{
      top: 20,
      bottom: 40,
      left: 50,
      right: 20
    }
  },
}

var format = d3.time.format("%Y-%m-%d");
function formatNumber(num)
{
  var p = num+'';
  return p.split("").reverse().reduce(function(acc, num, i, orig) {
      return  num + (i && !(i % 3) ? "," : "") + acc;
  }, "");

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
      alert('A date range was chosen: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
    }
  );

  // ==========================================================
  // SVG ROOT ELEMENT
  // margin transform pattern to ease further positionning
  // ==========================================================
  var svg = d3.select('.graph')
              .append('svg')
              .attr('height',sizes.big.height + sizes.big.margins.top + sizes.big.margins.bottom)
              .attr('width',sizes.big.width + sizes.big.margins.left + sizes.big.margins.right)
              .append('g')
              .attr('transform', 'translate(' +  sizes.big.margins.left + ', ' +  sizes.big.margins.top + ')');

  // ==========================================================
  // DATA REFORMATING / ORDERING
  // convert string date to js date object, sort by date
  // ==========================================================

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

  // ==========================================================
  // TOOLTIP (creation, mouseout/over fn)
  // ==========================================================
  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  function mouseover(d)
  {
    var map ={'total':'total','date':'date','dau':'actif','new':'created'};
    for (var k in map)
    {

      if (!$('#'+k).data('toto'))
      {
        $('#'+k).data('toto',$('#'+k).text());
      }
      if (k == 'date')
      {
        $('#'+k).text(moment(d[k]).format('MMMM Do'));
      } else {
        $('#'+k).text(formatNumber(d[map[k]]));
      }

    }
  }

  function mouseout(d)
  {
    // for (k in {'total':'total','date':'date','dau':'actif','new':'created'})
    // {
    //    $('#'+k).text($('#'+k).data('toto'));
    // }
  }



  // ==========================================================
  // SCALING
  // we increase our date range by one on each side so the
  // bar width does not causes trouble
  // ==========================================================
  var minDate = new Date();
  minDate.setTime(d3.min(data,function(d) { return d.date; }).getTime());
  minDate.setDate(minDate.getDate()-1);

  var maxDate = new Date();
  maxDate.setTime(d3.max(data,function(d) { return d.date; }).getTime());
  maxDate.setDate(maxDate.getDate()+1);

  var scales = {
    // x : time
    x : d3.time.scale.utc()
        .domain([minDate,maxDate])
        .range([sizes.big.width/data.length/2, sizes.big.width-sizes.big.width/data.length/2]),

    // y: DAUs
    y : d3.scale
    .linear()
    .domain([0, d3.max(data, function(d) { return d.total; })])
    .range([sizes.big.height,0])
  }

  var barWidth = Math.floor(sizes.big.width/data.length)-4;

  // ==========================================================
  // TOTALs
  // ==========================================================
  var barstotal = svg
   .selectAll('.bars-total')
   .data(data)
   .enter()
   .append('rect')
   .attr('class','bars-total');

  barstotal
    .attr("x", function (d,i) { return scales.x(d.date) - barWidth/2 })
    .attr("y", sizes.big.height)
    .attr("height", 0)
    .attr("width", barWidth)
    .on("mouseover",mouseover)
    .on("mouseout",mouseout);

  barstotal.transition().duration(400).delay( function(d,i){return i*30} )
    .attr("y", function (d) { return scales.y(d.total) })
    .attr("height", function (d) { return sizes.big.height - scales.y(d.total) })

  // ==========================================================
  // DAUs
  // ==========================================================
  var barsDAU = svg
   .selectAll('.bars-dau')
   .data(data)
   .enter()
   .append('rect')
   .attr('class','bars-dau');

  barsDAU
    .attr("x", function (d,i) { return scales.x(d.date) - barWidth/2 })
    .attr("y", sizes.big.height)
    .attr("height", 0)
    .attr("width", barWidth)
    .on("mouseover",mouseover)
    .on("mouseout",mouseout);

  barsDAU.transition().duration(400).delay( function(d,i){return i*30 + (data.length/3)*30} )
    .attr("y", function (d) { return scales.y(d.actif) })
    .attr("height", function (d) { return sizes.big.height - scales.y(d.actif) })

  // ==========================================================
  // NEWs users / acquisition
  // ==========================================================
  var barsNEW = svg
   .selectAll('.bars-new')
   .data(data)
   .enter()
   .append('rect')
   .attr('class','bars-new');

  barsNEW
    .attr("x", function (d,i) { return scales.x(d.date) - barWidth/2 })
    .attr("y",sizes.big.height)
    .attr("height", 0)
    .attr("width", barWidth)
    .on("mouseover",mouseover)
    .on("mouseout",mouseout);

  barsNEW.transition().duration(400).delay( function(d,i){return i*30 + (data.length/3)*60} )
    .attr("y", function (d) { return scales.y(d.created) })
    .attr("height", function (d) { return sizes.big.height - scales.y(d.created) })

  // ==========================================================
  // DRAW AXIS
  // ==========================================================
  var yAxis = d3.svg.axis()
    .scale(scales.y)
    .ticks(5)
    .orient("left")
    .tickSize(10)
    .tickPadding(3);

  svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + (barWidth/2 + 2 ) + ",0)")
    .call(yAxis);

  // We need to build the time range manually, as d3.time.day counts day since the beginning of a month
  // Build an array of date between min and maxdate, picking 1 day every 2 days
  var fixedTimeTicks = [];
  var currentTick = new Date();
  currentTick.setTime(minDate.getTime());
  currentTick.setDate(currentTick.getDate()+1);
  while(currentTick<maxDate)
  {
    var nd = new Date();
    nd.setTime(currentTick.getTime());
    fixedTimeTicks.push(nd);
    currentTick.setDate(currentTick.getDate()+3);
  }

  var xAxis = d3.svg.axis()
    .scale(scales.x)
    .tickValues(fixedTimeTicks)
    .orient("bottom")
    .tickSize(10)
    .tickPadding(3)
    .tickFormat(d3.time.format("%m/%d"));

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (sizes.big.height) + ")")
    .call(xAxis);


  // var line = d3.svg.line()
  //   .x(function(d,i) {
  //     return scales.x(d.date);
  //   })
  //   .y(function(d) {
  //     return scales.y(d.created);
  //   })
  //   .interpolate("monotone");


  // svg.append('svg:path').attr('d',line(data)).attr('fill','none').attr('stroke','blue').attr('stroke-width','2px');
});
