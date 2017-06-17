d3.gantt = function() {
  // svg dimensions: margin, height, width
  var svgMargin = { top : 20, right : 40, bottom : 20, left : 150 };
  var svgHeight = document.body.clientHeight - svgMargin.top - svgMargin.bottom - 5;
  var svgWidth = document.body.clientWidth - svgMargin.right - svgMargin.left - 5;


  // domain mode
  var FIT_TIME_DOMAIN_MODE = "fit";
  var FIXED_TIME_DOMAIN_MODE = "fixed";
  var timeDomainMode = FIXED_TIME_DOMAIN_MODE; // fixed or fit


  // time domain
  var timeDomainStart = d3.timeDay.offset(new Date(), - 3);
  var timeDomainEnd = d3.timeHour.offset(new Date(), + 3);


  // customer info
  var customerNames = [];


  // x-axis tick format
  var tickFormat = "%H:%M";


  var keyFunction = function(d) {
    return d.startDate + d.customerName + d.endDate;
  };


  var rectTransform = function(d) {
    return "translate(" + x(d.startDate) + "," + y(d.customerName) + ")";
  };


  var x;
  var y;
  var xAxis;
  var yAxis;


  // setup x-axis and y-axis
  setupAxis();


  var setupTimeDomain = function() {
    if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
      if (data === undefined || data.length < 1) {
        timeDomainStart = d3.timeDay.offset(new Date(), - 3);
        timeDomainEnd = d3.timeHour.offset(new Date(), + 3);
        return;
      }

      // sort data in ascending order by job end date
      data.sort(function(a, b) {
        return a.endDate - b.endDate;
      });


      // calculate time domain end date
      timeDomainEnd = data[data.length - 1].endDate;


      // sort data in ascending order by job start date
      data.sort(function(a, b) {
        return a.startDate - b.startDate;
      });


      // calculate time domain start date
      timeDomainStart = data[0].startDate;
    }
  };


 function setupAxis() {
    // calculate x-position using scaleTime()
    x = d3.scaleTime()
          // input domain
          .domain([timeDomainStart, timeDomainEnd])
          // output range
          .range([0, svgWidth])
          // clamp
          .clamp(true);


    // calculate y-position using scaleBand()
    y = d3.scaleBand()
          // input domain
          .domain(customerNames)
          // output range
          .range([0, svgHeight - svgMargin.top - svgMargin.bottom])
          // padding
          .padding(0.1);


    // x-axis
    xAxis = d3.axisBottom().scale(x)
              // tick format
              .tickFormat( d3.timeFormat(tickFormat) )
              // tick size
              .tickSize(8)
              // tick padding
              .tickPadding(8);


    // y-axis
    yAxis = d3.axisLeft().scale(y)
              // tick size
              .tickSize(0);
  };


  function gantt(data) {
    // setup datetime domain
    setupTimeDomain();


    // setup x-axis and setup y-axis
    setupAxis();


    // create <svg> element inside svg container
    var svg = d3.select("#svg-container").append("svg")
        // apply css
        .attr("class", "chart")
        // <svg> width
        .attr("width", svgWidth + svgMargin.left + svgMargin.right)
        // <svg> height
        .attr("height", svgHeight + svgMargin.top + svgMargin.bottom)

        // create <g> element
        .append("g")
          // apply class
          .attr("class", "gantt-chart")
          // <g> width
          .attr("width", svgWidth + svgMargin.left + svgMargin.right)
          // <g> height
          .attr("height", svgHeight + svgMargin.top + svgMargin.bottom)
          // transform
          .attr("transform", "translate(" + svgMargin.left + ", " + svgMargin.top + ")");


    // make selection of <rect> elements
    svg.selectAll(".chart")
      // bind data
      .data(data, keyFunction)
        // create placeholder for each missing <rect>
        .enter()
          // create <rect>
          .append("rect")
            // rx-position
            .attr("rx", 5)
            // ry-position
            .attr("ry", 5)
            // fill color
            .attr("fill", "steelblue")
            // y-position
            .attr("y", 0)
            // transform
            .attr("transform", rectTransform)
            // height: use bandwidth scale to calculate height
            .attr("height", function(d) {
              return y.bandwidth();
            })
            // width
            .attr("width", function(d) {
              return (x(d.endDate) - x(d.startDate));
            });


      // create <g> element for x-axis
      svg.append("g")
        // apply css class
        .attr("class", "x axis")
        // move position of x-axis
        .attr("transform", "translate(0, " + (svgHeight - svgMargin.top - svgMargin.bottom) + ")")
        // transition
        .transition()
          // draw x-axis
          .call(xAxis);


      // create <g> element for y-axis
      svg.append("g")
        // apply css class
        .attr("class", "y axis")
        // transition
        .transition()
          // draw y-axis
          .call(yAxis);


    return gantt;
  };


  gantt.redraw = function(data) {
    // setup datetime domain
    setupTimeDomain();


    // setup x-axis and setup y-axis
    setupAxis();


    // make selection of svg
    var svg = d3.select("svg");


    // make selection of gantt chart group
    var ganttChartGroup = svg.select(".gantt-chart");


    // create <rect> elements inside <svg> element
    var rect = ganttChartGroup.selectAll("rect")
                              // bind data item to <rect>
                              .data(data, keyFunction);


    // create placeholder for each missing <rect>
    rect.enter()
      // insert new <rect> element
      .insert("rect", ":first-child")
      // rx-position
      .attr("rx", 5)
      // ry-position
      .attr("ry", 5)
      // fill color
      .attr("fill", "steelblue")
      // transition
      .transition()
      // y-position
      .attr("y", 0)
      // move position of <rect> element
      .attr("transform", rectTransform)
      // height: use bandwidth scale to calculate height
      .attr("height", function(d) {
        return y.bandwidth();
      })
      // width
      .attr("width", function(d) {
         return (x(d.endDate) - x(d.startDate));
      });


      // merge <rect> element
      rect.merge(rect).transition()
        // move position of <rect> element
      	.attr("transform", rectTransform)
        // height
	      .attr("height", function(d) {
          return y.bandwidth();
        })
        // width
        .attr("width", function(d) {
          return (x(d.endDate) - x(d.startDate));
        });


        // remove <rect> elements
        rect.exit().remove();


        // make selection of x-axis
        svg.select(".x")
           // move position of x-axis
           .transition()
             // draw x-axis
             .call(xAxis);


        // make selection of y-axis
        svg.select(".y")
           // move position of y-axis
           .transition()
             // draw y-axis
             .call(yAxis);


    return gantt;
  };


  gantt.svgMargin = function(value) {
    if (!arguments.length)
      return svgMargin;

    svgMargin = value;
    return gantt;
  };


  gantt.timeDomain = function(value) {
    if (!arguments.length)
      return [ timeDomainStart, timeDomainEnd ];

    timeDomainStart = +value[0], timeDomainEnd = +value[1];
    return gantt;
  };


  gantt.timeDomainMode = function(value) {
    if (!arguments.length)
      return timeDomainMode;

    timeDomainMode = value;
    return gantt;
  };


  gantt.customerNames = function(value) {
    if (!arguments.length)
      return customerNames;

    customerNames = value;
    return gantt;
  };


  gantt.svgWidth = function(value) {
    if (!arguments.length)
      return svgWidth;

    svgWidth = +value;
    return gantt;
  };


  gantt.svgHeight = function(value) {
    if (!arguments.length)
      return svgHeight;

    svgHeight = +value;
    return gantt;
  };


  gantt.tickFormat = function(value) {
    if (!arguments.length)
      return tickFormat;

    tickFormat = value;
    return gantt;
  };

  return gantt;
};