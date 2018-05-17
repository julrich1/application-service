const Application = require("./Application");
const request = require('request');

//TODO: add correct endpoint for microservice
// const propAvailabilityEndpoint = "http://chaospropertyavailability-prod-2.mzjbqmkiud.us-west-2.elasticbeanstalk.com/availabilities?id=7&range[]=2018-05-10&range[]=2018-05-23"
const secondPropAvailabilityEndpoint = "http://chaospropertyavailability-prod-2.mzjbqmkiud.us-west-2.elasticbeanstalk.com/availabilities/isavailable?id=7&range%5B%5D=2018-05-19&range%5B%5D=2018-05-21"

module.exports = {

  checkApplicationDatesAvailability: function(propertyId, startDate, endDate, cb) {
    // const propertiesObject = {prop_id: propertyId, dateRange: [startDate, endDate]};
    request(secondPropAvailabilityEndpoint,  function(err, response, body) {
    // request({url:propAvailabilityEndpoint, qs:propertiesObject},  function(err, response, body) {
    console.log(body);
    console.log(propertyId);
      if (body === {"propertyId":false}) {
          cb(err, null);
      } else {
          cb(null, response)
      }
    })
  }
}
