function addReminder() {
  // CLIST info
  var userName = "";
  var apiKey = "";

  // contests info
  var hosts = ["leetcode.com", "codeforces.com"];

  // dates and times
  var milliseconds = (5 * 60 + 30) * 60 * 1000;
  var minDate = new Date("October 22, 2023 00:00:00 Z");
  var maxDate = new Date("November 5, 2023 00:00:00 Z");
  var minString =
    Utilities.formatDate(minDate, "GMT", "yyyy-MM-dd") + "T00:00:00Z";
  var maxString =
    Utilities.formatDate(maxDate, "GMT", "yyyy-MM-dd") + "T00:00:00Z";
  // a contest can stay up for max 30 days
  var maxDuration = 30 * 24 * 60 * 60;

  // calendar info
  var calendarID = "";
  var calendar = CalendarApp.getOwnedCalendarById(calendarID);

  // map existing calendar events to the url (description contains the url)
  var mp = {};
  var events = calendar.getEvents(minDate, maxDate);
  for (i = 0; i < events.length; i++) {
    var contestUrl = events[i].getDescription();
    mp[contestUrl] = events[i];
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
          minString +
          "&end__lte=" +
          maxString +
          "&order_by=start&duration__lte=" +
          maxDuration
      );
      var responseObj = JSON.parse(response);

      // all the contests are contained in "objects"
      var contests = responseObj["objects"];
      for (var k in contests) {
        var contest = contests[k];
        // check if the contest is not added
        if (mp[contest["href"]] == null) {
          var start = new Date(contest["start"]);
          var end = new Date(contest["end"]);
          var startTime = start.getTime();
          var endTime = end.getTime();

          // IST timezone conversion
          var startTimeIST = startTime + milliseconds;
          var endTimeIST = endTime + milliseconds;
          var startFinal = new Date(startTimeIST);
          var endFinal = new Date(endTimeIST);
          console.log("Event start time: ", startFinal);
          console.log("Event end time: ", endFinal);

          var e = calendar.createEvent(contest["event"], startFinal, endFinal, {
            description: contest["href"],
          });

          console.log("New event created: " + e.getTitle());
          mp[contest["href"]] = e;
        } else {
          // new info from API
          var newContestTitle = contest["event"];
          var newContestStart = new Date(contest["start"]);
          var newContestEnd = new Date(contest["end"]);
          // old info stored in map
          var e = mp[contest["href"]];
          var currContestTitle = e.getTitle();
          var currContestStart = e.getStartTime();
          var currContestEnd = e.getEndTime();

          // convert date to time (in ms)
          var newContestStartTime = newContestStart.getTime() + milliseconds;
          var currContestStartTime = currContestStart.getTime();
          var newContestEndTime = newContestEnd.getTime() + milliseconds;
          var currContestEndTime = currContestEnd.getTime();

          if (
            newContestTitle != currContestTitle ||
            newContestStartTime != currContestStartTime ||
            newContestEndTime != currContestEndTime
          ) {
            e.setTitle(newContestTitle);
            e.setTime(
              new Date(newContestStartTime),
              new Date(newContestEndTime)
            );
            console.log("Event updated: " + e.getTitle());
          } else {
            console.log("No changes to event: " + e.getTitle());
          }
        }
      }
    } catch (err) {
      console.log("Error in fetching contests from the API: ", err);
    }
  }
}

// time-based trigger to automate the fetching of events
// ScriptApp.newTrigger("addReminder").timeBased().everyHours(1).create();
