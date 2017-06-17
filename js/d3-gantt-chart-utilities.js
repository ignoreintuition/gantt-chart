// tasks
var tasks = [
  { "startDate": new Date("Sun Dec 09 00:00:45 EST 2012"),"endDate": new Date("Sun Dec 09 02:36:45 EST 2012"), "taskName": "E Job" },
  { "startDate": new Date("Sun Dec 09 08:49:53 EST 2012"),"endDate": new Date("Sun Dec 09 06:34:04 EST 2012"), "taskName": "D Job" },
  { "startDate": new Date("Sun Dec 09 03:27:35 EST 2012"),"endDate": new Date("Sun Dec 09 03:58:43 EST 2012"), "taskName": "P Job" },
  { "startDate": new Date("Sun Dec 09 03:27:35 EST 2012"),"endDate": new Date("Sun Dec 09 03:58:43 EST 2012"), "taskName": "N Job" }
];


// task names
var taskNames = ["D Job", "P Job", "E Job", "A Job", "N Job"];


// sort data in ascending order by task end date
tasks.sort(function(a, b) {
  return a.endDate - b.endDate;
});


// calculate maximum date
var maxDate = tasks[tasks.length - 1].endDate;


// sort data in ascending order by task start date
tasks.sort(function(a, b) {
  return a.startDate - b.startDate;
});


// calculate minimum date
var minDate = tasks[0].startDate;


// x-axis tick datetime format
var format = "%H:%M";


// set default time domain
var timeDomainString = "1day";


// setup gantt chart
var gantt = d3.gantt().svgHeight(450)
                      .svgWidth(800)
                      .taskTypes(taskNames)
                      .tickFormat(format);


// change time domain
changeTimeDomain(timeDomainString);


// create gantt chart
gantt(tasks);


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
  gantt.redraw(tasks);
}


function getEndDate() {
  var lastEndDate = Date.now();

  if (tasks.length > 0) {
    lastEndDate = tasks[tasks.length - 1].endDate;
  }

  return lastEndDate;
}