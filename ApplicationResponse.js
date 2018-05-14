module.exports = class ApplicationResponse {
    constructor(applicationId, status, renterId, ownerId) {
        this.applicationId = applicationId;
        this.status = status;
        this.renterId = renterId;
        this.ownerId = ownerId;
    }
}