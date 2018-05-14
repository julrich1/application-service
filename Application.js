const uuidV1 = require("uuid/v1");

module.exports = class Application {
    constructor(renterId, ownerId, propertyId, reservationStart, reservationEnd, applicationId = uuidV1(), applicationStatus = "pending") {
        this.applicationId = applicationId;
        this.renterId = renterId;
        this.ownerId = ownerId;
        this.reservationStart = reservationStart;
        this.reservationEnd = reservationEnd;
        this.propertyId = propertyId;
        this.applicationStatus = applicationStatus;
    }

    query() {
        const params = {
            Item: {
             "application_id": {
               S: this.applicationId
              },
             "owner_id": {
               S: this.ownerId
              },
             "renter_id": {
               S: this.renterId
             },
             "reservation_start": {
               S: this.reservationStart
             },
             "reservation_end": {
               S: this.reservationEnd
             },
             "property_id": {
               S: this.propertyId
             },
             "application_status": {
               S: this.applicationStatus
             }
            },
            ReturnConsumedCapacity: "TOTAL",
            TableName: "chaos-application-service"
        };

        return params;
    }
}
