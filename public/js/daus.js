var sizes = {
    big:{
        width:920,
        height:460,
        margins:{
            top: 20,
            bottom: 40,
            left: 50,
            right: 20
        }
    },
}

$(document).on('ready',function(){
    var svg = d3.select('.graph')
                .append('svg')
                .attr('height',sizes.big.height + sizes.big.margins.top + sizes.big.margins.bottom)
                .attr('width',sizes.big.width + sizes.big.margins.left + sizes.big.margins.right)
                .append('g')
                .attr('transform', 'translate(' +  sizes.big.margins.left + ', ' +  sizes.big.margins.top + ')');

    // format the date as a js date object
    data.map(function(d){
        d.date = new Date(d.date);
    });

    // data.sort(function(a,b) { return a.date < b.date });

    // we need to extends the date range (+1/-1 day) to have a coherent axis with cented bars
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
            .rangeRound([sizes.big.width/data.length/2, sizes.big.width-sizes.big.width/data.length/2]),

        // y: DAUs
        y : d3.scale
        .linear()
        .domain([0, d3.max(data, function(d) { return d.actif; })])
        .rangeRound([sizes.big.height,0])
    }


    var rectangles = svg
       .selectAll('rect')
       .data(data)
       .enter()
       .append('rect');

    rectangles
        .attr("x", function (d,i) { return scales.x(d.date) - (sizes.big.width/data.length)/2 })
        .attr("y", function (d) { return scales.y(d.actif) })
        .attr("height", function (d) { return sizes.big.height - scales.y(d.actif) })
        .attr("width", sizes.big.width/data.length - 4)
        .style("fill", '#999' );


    var yAxis = d3.svg.axis()
    .scale(scales.y)
    .ticks(8)
    .orient("left")
    .tickSize(10)
    .tickPadding(3);

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + ((sizes.big.width/data.length)/2) + ",0)")
      .call(yAxis);

    var xAxis = d3.svg.axis()
    .scale(scales.x)
    .ticks(d3.time.day,2)
    .orient("bottom")
    .tickSize(10)
    .tickPadding(3)
    .tickFormat(d3.time.format("%m/%d"));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (sizes.big.height) + ")")
      .call(xAxis);

    var dates = svg
       .selectAll('text')
       .data(data)
       .enter()
       .append('text');

    // dates.
});
