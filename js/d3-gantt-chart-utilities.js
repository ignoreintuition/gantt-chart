// data
var data = [
  { "startDate": new Date("Sun Dec 09 00:00:45 EST 2012"),"endDate": new Date("Sun Dec 09 02:36:45 EST 2012"), "customerName": "Cust 3" },
  { "startDate": new Date("Sun Dec 09 08:49:53 EST 2012"),"endDate": new Date("Sun Dec 09 06:34:04 EST 2012"), "customerName": "Cust 1" },
  { "startDate": new Date("Sun Dec 09 03:27:35 EST 2012"),"endDate": new Date("Sun Dec 09 03:58:43 EST 2012"), "customerName": "Cust 2" },
  { "startDate": new Date("Sun Dec 09 03:27:35 EST 2012"),"endDate": new Date("Sun Dec 09 03:58:43 EST 2012"), "customerName": "Cust 4" }
];


// customer names
var customerNames = ["Cust 1", "Cust 2", "Cust 3", "Cust 4"];


// sort data in ascending order by job end date
data.sort(function(a, b) {
  return a.endDate - b.endDate;
});


// calculate maximum date
var maxDate = data[data.length - 1].endDate;


// sort data in ascending order by job start date
data.sort(function(a, b) {
  return a.startDate - b.startDate;
});


// calculate minimum date
var minDate = data[0].startDate;


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
    lastEndDate = data[data.length - 1].endDate;
  }

  return lastEndDate;
}