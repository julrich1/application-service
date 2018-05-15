const Application = require("./Application");
const request = require('request');

//TODO: add correct endpoint for microservice
const propAvailabilityEndpoint = "https://ip.jsontest.com"

module.exports = {

  checkApplicationDatesAvailability: function(propertyId, startDate, endDate, cb) {
    const propertiesObject = {prop_id: propertyId, dateRange: [startDate, endDate]};
    request({url:propAvailabilityEndpoint, qs:propertiesObject},  function(err, response, body) {
      if (err) {
          cb(err, null);
      } else {
          cb(null, response)
      }
    })
  }
}
