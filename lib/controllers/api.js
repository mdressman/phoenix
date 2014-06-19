'use strict';

/**
 * Get provided user and log data and parse into required formats and analytics
 */
exports.userStats = function(req, res) {

  var users = [],
      fs    = require("fs");

  // in reality, this would be a query to the database
  fs.readFile( __dirname + '/data/users.json', function(err, userData) {
    JSON.parse(userData).forEach(function(u) {
      // build users dict at higher scope
      users.push(u);
    });
  });
  
  fs.readFile( __dirname + '/data/logs.json', function(err, logs) {

    if (err) {
      console.log(err);
      return;
    }

    var jsonLogs      = JSON.parse(logs),
        userEvents    = {}, // bucket to store events sorted by user
        userStats     = {}, // bucket to store analytics required by front-end
        userObj;            // bucket to aid sync of user profile and log data

    // group event logs by user
    jsonLogs.forEach(function(e) {
      if (userEvents[e.user_id] === undefined) {
        userEvents[e.user_id] = [];
      }
      userEvents[e.user_id].push(e);
    });

    // parse user's event logs into desired stats
    for (var user in userEvents) {
      var eventCounter  = {};

      userStats[user] = { 'impressions': 0, 'conversions': 0, 'revenue': 0, 'dates': [], 'events_by_day': [], 'name':'','occupation':'', 'avatar':'' }

      // get the associated user profile
      userObj = users.filter(function(u) {
        return u.id == user;
      });

      // populate userStats with profile info
      userStats[user].id = userObj[0].id;
      userStats[user].name = userObj[0].name;
      userStats[user].occupation = userObj[0].occupation;
      userStats[user].avatar = userObj[0].avatar;

      // build out analytics
      userEvents[user].forEach(function(e) {
        if (e.type == 'impression') {
          userStats[user].impressions++;
        } else {
          userStats[user].conversions++;
          userStats[user].revenue += e.revenue;
        }
        userStats[user].dates.push(e.time);
      });

      // format date strings for chart data
      userStats[user].dates.sort();
      for (var d in userStats[user].dates) {
        userStats[user].dates[d] = userStats[user].dates[d].substr(0,10);
      }

      // count event volume per day
      for (var i = 0; i < userStats[user].dates.length; i++) {
        var date = userStats[user].dates[i];
        eventCounter[date] = eventCounter[date] ? eventCounter[date]+1 : 1;
      }

      // hacky > force daily event counts into format needed for chart
      // in reality, I would convert the date data to timestamps and update
      // the chart init to use time measurements
      var c = 1;
      for (var e in eventCounter) {
        userStats[user].events_by_day.push([c,eventCounter[e]]);
        c++;
      }

      // format USD, with dollar sign, commas, and no cents
      var usd = userStats[user].revenue.toString().split('.')[0];
      userStats[user].revenue = '$' + usd.split('').reverse().join('').replace(/(\d{3}(?!$))/g, '$1,').split('').reverse().join('');
    }

    // send payload to front-end
    res.json(userStats);
  });
};