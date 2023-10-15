function addReminder() {
  // CLIST info
  var userName = "";
  var apiKey = "";

  // contests info
  var hosts = ["leetcode.com", "codeforces.com"];

  // dates and times
  var minDate = new Date("October 15, 2023 00:00:00 Z");
  var maxDate = new Date("October 25, 2023 00:00:00 Z");
  var today = new Date();
  var todayString =
    Utilities.formatDate(today, "GMT", "yyyy-MM-dd") + "T00:00:00Z";
  // a contest will stay up for at max 30 days
  var maxDuration = 30 * 24 * 60 * 60;

  // calendar info
  var calendarID = "";
  var calendar = CalendarApp.getOwnedCalendarById(calendarID);

  // map existing calendar events to the url (description contains the url)
  var mp = {};
  var events = calendar.getEvents(minDate, maxDate);
  for (i = 0; i < events.length; i++) {
    mp[events[i].getDescription()] = events[i];
  }

  // add a contest if it doesn't exist in the map
  // else, update the existing contest with the new details
  for (var j in hosts) {
    try {
      var response = UrlFetchApp.fetch(
        "https://clist.by/api/v1/contest/?username=" +
          userName +
          "&api_key=" +
          apiKey +
          "&resource__name=" +
          hosts[j] +
          "&start__gte=" +
          todayString +
          "&order_by=start&duration__lte=" +
          maxDuration
      );
      var responseObj = JSON.parse(response);

      // all the contests are contained in "objects"
      var contests = responseObj["objects"];
      for (var k in contests) {
        // check if the contest is not added
        if (mp[contests[k]["href"]] == null) {
          var start = new Date(contests[k]["start"]);
          var end = new Date(contests[k]["end"]);
          var startTime = start.getTime();
          var endTime = end.getTime();

          // IST timezone conversion
          var milliseconds = (5 * 60 + 30) * 60 * 1000;
          var startTimeIST = startTime + milliseconds;
          var endTimeIST = endTime + milliseconds;
          var startFinal = new Date(startTimeIST);
          var endFinal = new Date(endTimeIST);
          console.log("Event start time: ", startFinal);
          console.log("Event end time: ", endFinal);

          var e = calendar.createEvent(
            contests[k]["event"],
            startFinal,
            endFinal,
            {
              description: contests[k]["href"],
            }
          );

          console.log("New event created: " + e.getTitle());
          mp[contests[k]["href"]] = e;
        } else {
          // do updation of existing event in case its details have changed
        }
      }
    } catch (err) {
      console.log("Error in fetching contests from the API: ", err);
    }
  }
}

// time-based trigger to automate the fetching of events
function timeDrivenTrigger() {
  ScriptApp.newTrigger("addReminder").timeBased().everyHours(1).create();
}
