const Application = require("./Application");

const moment = require("moment");

const AWS = require("aws-sdk");
const credentials = new AWS.SharedIniFileCredentials({profile: 'nordstrom-federated'});
AWS.config.update({region:'us-west-2'});
AWS.config.credentials = credentials;

const dynamodb = new AWS.DynamoDB();

module.exports = {
    updateApplicationByRenter: function(appId, status, cb) {
        const params = {
            Key: {
            "application_id": {
                S: appId
              }
            },
            TableName: "chaos-application-service"
        };

        dynamodb.getItem(params, (err, data) => {
            if (err) {
                cb(400, null);
            } else {
                //get id from JWT token; add checkin date validation
                if ((data.Item.renter_id.S === "4") && moment(new Date()).isBefore(data.Item.reservation_end.S)) {
                    const application = new Application(data.Item.renter_id.S, data.Item.owner_id.S, data.Item.property_id.S, data.Item.reservation_start.S, data.Item.reservation_end.S, data.Item.application_id.S, status);
                    dynamodb.putItem(application.query(), (err, data) => {
                        if (err) {
                            cb(500, null);
                        } else {
                            cb(null, data);
                        }
                    });
                } else {
                    cb(403, null);
                }
            }
            //permissions
        });
    },

    updateApplicationByOwner: function(appId, status, cb) {
        const params = {
            Key: {
            "application_id": {
                S: appId
              }
            },
            TableName: "chaos-application-service"
        };

        dynamodb.getItem(params, (err, data) => {
            if (err) {
                cb(400, null);
            } else {
                //get id from JWT token; add checkin date validation
                if (data.Item.owner_id.S === "3") {
                    const application = new Application(data.Item.renter_id.S, data.Item.owner_id.S, data.Item.property_id.S, data.Item.application_id.S, status);
                    dynamodb.putItem(application.query(), (err, data) => {
                        if (err) {
                            cb(500, null);
                        } else {
                            cb(null, data);
                        }
                    });
                } else {
                    cb(403, null);
                }
            }
            //permissions

            //validate time - can't cancel if they've already stayed there
        });
    }
}
