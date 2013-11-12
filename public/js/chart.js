function timechart() {


  var width  = 700, // default width
      height = 460, // default height

      margin = {
        top: 20,
        bottom: 40,
        left: 50,
        right: 20
      },
      mouseover = function(d){},
      fieldsConfig = {
        'total': {
          field: 'total',
          css:   'total'
        },
        'dau': {
          field: 'actif',
          css:   'dau'
        },
        'new': {
          field: 'created',
          css:   'new'
        }
      },

      drawFields = ['total','dau','new'],

      xScale = d3.time.scale.utc(),
      yScale = d3.scale.linear(),

      xAxis  = d3.svg.axis().scale(xScale).orient("bottom").tickSize(10).tickPadding(3).tickFormat(d3.time.format("%m/%d")),
      yAxis  = d3.svg.axis().scale(yScale).ticks(5).orient("left").tickSize(3).tickPadding(3),

      barWidth = 20;


  function my(selection) {
    // in most use case we will only have one selection (might be used if we draw multiple graphs)
    selection.each(function(data){

      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([data]);

      // Otherwise, create the skeletal chart.
      var gEnter = svg.enter().append("svg").append("g");

      gEnter.append("g").attr("class", "x axis");
      gEnter.append("g").attr("class", "y axis");

      var maxValue = 0;
      for (var key in fieldsConfig)
      {
        gEnter.append("g").attr("class", 'g-'+fieldsConfig[key].css);
        maxValue = Math.max(maxValue,d3.max(data,function(d) { return d[fieldsConfig[key].field]}));
      }

      // Update the outer dimensions.
      svg.attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);

      // Update the inner dimensions.
      var g = svg.select("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

      barWidth = Math.min(Math.floor(width/data.length)-6,46);

      xScale.domain([minDate,maxDate])
        .range([0, width-width/data.length/2]);

      yScale.domain([0, maxValue])
        .range([height,0]);



      for (var key in fieldsConfig)
      {
        var css = fieldsConfig[key].css;
        var field = fieldsConfig[key].field;
        var bar = svg.select(".g-"+css).selectAll("."+css).data(data);

        // NEW BAR
        bar.enter().append("rect")
          .on("mouseover",mouseover)
          .attr("x", function (d,i) { return xScale(d.date) - barWidth/2 })
          .attr("y", height)
          .attr("class", css)
          .attr("height", 0);

        // REMOVE BAR
        bar.exit()
          .transition().duration(400)
          .attr('height',0)
          .attr('y',height)
          .remove();

        // UPDATE BAR
        bar.transition().duration(400)
          .attr("x", function (d,i) { return xScale(d.date) - barWidth/2 })
          .attr("x", function (d,i) { return xScale(d.date) - barWidth/2 })
          .attr("y", function (d) { return yScale(d[field])})
          .attr("height", function (d) { return height - yScale(d[field]) })
          .attr("width", barWidth);
      }

        // .on("mouseover",mouseover)
        // .on("mouseout",mouseout);

        // AXIS
        // Update the y-axis.
        svg.select(".y.axis").transition().duration(400)
          .call(yAxis);

        // We need to build the time range manually, as d3.time.day counts day since the beginning of a month
        // Build an array of date between min and maxdate, picking 1 day every n days
        var nbDays = nbTicks = data.length;
        while( ( (width - margin.left - margin.right) /nbTicks) <59 )
        {
          nbTicks --;
        }
        var tickInterval = Math.max(1,Math.floor(nbDays/nbTicks));

        console.log(Math.random(),nbTicks,tickInterval);

        var fixedTimeTicks = [];
        var currentTick = new Date();
        currentTick.setTime(minDate.getTime());
        currentTick.setDate(currentTick.getDate()+1);
        while(currentTick<maxDate)
        {
          var nd = new Date();
          nd.setTime(currentTick.getTime());
          fixedTimeTicks.push(nd);
          currentTick.setDate(currentTick.getDate()+tickInterval);
        }
        xAxis.tickValues(fixedTimeTicks);

        // Update the y-axis.
        g.select(".x.axis")
          .attr("transform", "translate(0," + height + ")").transition().duration(400)
          .call(xAxis);

    });
  }

  my.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return my;
  };

  my.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return my;
  };

  my.margin = function(value) {
    if (!arguments.length) return margin;
    margin = value;
    return my;
  };

  my.drawFields = function(value) {
    if (!arguments.length) return drawFields;
    drawFields = value;
    return my;
  }

  my.mouseover = function(value) {
    if (!arguments.length) return mouseover;
    mouseover = value;
    return my;
  }

  return my;
}