module.exports = class ApplicationResponse {
    constructor(applicationId, status, renterId, ownerId, propertyId, reservationStart, reservationEnd) {
        this.applicationId = applicationId;
        this.status = status;
        this.renterId = renterId;
        this.ownerId = ownerId;
        this.propertyId = propertyId;
        this.reservationStart = reservationStart;
        this.reservationEnd = reservationEnd;
    }
}