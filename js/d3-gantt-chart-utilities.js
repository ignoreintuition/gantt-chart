// data
var data;

// get data from json
// convert data from json file into javascript object named "data"
d3.json("data/jobs-03.json", function(error, data) {
  // _______________________________________________________________________
  // handle error
  if (error) {
    // display error message on page inside <div>
    d3.select("#error-message").text("Attention: Problem loading data.")
                                 // background color
                                 .attr("class", "bg-danger")
                                 // font color
                                 .style("color", "#fff");


    // hide navigation buttons
    d3.select("#button-container").style("display", "none");


    // display error in console
    return console.log(error);
  }


  // _______________________________________________________________________
  // success: retrieved data

  // test: loop through each object in data, write to console
  data.forEach(function(d) {
    console.log(d.CustomerInfo.CustomerName);
  });


  // convert each date string to a date object
  // loop through each object
  data.forEach(function(d) {
    // use dateParser to convert date string to date object
    var dateParser = d3.timeParse("%Y-%m-%dT%H:%M:%S");
    d.JobDuration.Start = dateParser(d.JobDuration.Start);
    d.JobDuration.End = dateParser(d.JobDuration.End);
  });


  // create array of customer names
  var customerNames = data.map(function(d) {
    return d.CustomerInfo.CustomerName;
  });


  // sort data in ascending order by job end date
  data.sort(function(a, b) {
    return a.JobDuration.End - b.JobDuration.End;
  });


  // calculate maximum date
  var maxDate = data[data.length - 1].JobDuration.End;


  // sort data in ascending order by job start date
  data.sort(function(a, b) {
    return a.JobDuration.Start - b.JobDuration.Start;
  });


  // calculate minimum date
  var minDate = data[0].JobDuration.Start;


  // x-axis tick datetime format
  var format = "%H:%M";


  // set default time domain
  var timeDomainString = "1day";


  // setup gantt chart
  var gantt = d3.gantt().svgHeight(450)
                        .svgWidth(800)
                        .customerNames(customerNames)
                        .tickFormat(format);


  // change time domain
  changeTimeDomain(timeDomainString);


  // create gantt chart
  gantt(data);


  function changeTimeDomain(timeDomainString) {
    // datetime domain string corresponds to navigation button that was clicked
    this.timeDomainString = timeDomainString;

    switch (timeDomainString) {
      case "1hr":
        // set datetime format
        format = "%H:%M:%S";
        // set time domain
        gantt.timeDomain([d3.timeHour.offset(getEndDate(), -1), getEndDate()]);
        break;

      case "3hr":
        // set datetime format
        format = "%H:%M";
        // set time domain
        gantt.timeDomain([d3.timeHour.offset(getEndDate(), -3), getEndDate()]);
        break;

      case "6hr":
        // set datetime format
        format = "%H:%M";
        // set time domain
        gantt.timeDomain([d3.timeHour.offset(getEndDate(), -6), getEndDate()]);
        break;

      case "1day":
        // set datetime format
        format = "%H:%M";
        // set time domain
        gantt.timeDomain([d3.timeDay.offset(getEndDate(), -1), getEndDate()]);
        break;

      case "1week":
        // set datetime format
        format = "%a %H:%M";
        // set time domain
        gantt.timeDomain([d3.timeDay.offset(getEndDate(), -7), getEndDate()]);
        break;

      default:
        // set datetime format
        format = "%H:%M"
    }


    // set x-axis tick format
    gantt.tickFormat(format);


    // redraw gantt chart
    gantt.redraw(data);
  }


  function getEndDate() {
    var lastEndDate = Date.now();

    if (data.length > 0) {
      lastEndDate = data[data.length - 1].JobDuration.End;
    }

    return lastEndDate;
  }
});