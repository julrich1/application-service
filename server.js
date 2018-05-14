const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const appProcessor = require("./ApplicationProcessor");

const AWS = require("aws-sdk");
const credentials = new AWS.SharedIniFileCredentials({profile: 'nordstrom-federated'});
AWS.config.update({region:'us-west-2'});
AWS.config.credentials = credentials;

const Application = require("./Application");
const ApplicationResponse = require("./ApplicationResponse");

const port = 3000;

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.json());

app.post("/application", (req, res, next) => {
  const renterId = req.body.renter_id;
  const ownerId = req.body.owner_id;
  const propertyId = req.body.property_id;

  let application = new Application(renterId, ownerId, propertyId);

  dynamodb.putItem(application.query(), (err, data) => {
    if (err) {
      let error = { status: 500 }
      return next(error)
    }
    else {
      res.send(data);
    }
  });
});

app.get("/application", (req, res, next) => {
  const params = {
    TableName : 'chaos-application-service',
    FilterExpression: "contains (owner_id, :ownerId) OR contains (renter_id, :renterId)",
    ExpressionAttributeValues : {
        ':ownerId' : "3",
        ':renterId' : "3"
    }
  };

  docClient.scan(params, (err, data, next) => {
    if (err) {
      let error = { status: 500 }
      return next(error)
    }
    else {
      const response = [];

      for (let application of data.Items) {
        const appResponse = new ApplicationResponse(application.application_id, application.application_status, application.renter_id, application.owner_id);
        response.push(appResponse)
      }

      res.send(response);
    }
  });
})

app.get("/application/:id", (req, res, next) => {
  const id = req.params.id;
  const params = {
    Key: {
      "application_id": {
        S: id
      }
    },
    TableName: "chaos-application-service"
  };

  dynamodb.getItem(params, (err, data) => {
    if (err) {
      let error = { status: 500 }
      return next(error)
    }
    else {
      if (Object.keys(data).length === 0) {
        res.send("Empty");
      }
      else {
        const response = new ApplicationResponse(data.Item.application_id.S, data.Item.application_status.S, data.Item.renter_id.S, data.Item.owner_id.S);
        res.send(response);
      }
    }
  });
})

app.patch("/application/:id", (req, res, next) => {
  const id = req.params.id;
  const newStatus = req.body.status.toLowerCase();
  if (newStatus === "cancelled") {
    appProcessor.updateApplicationByRenter(id, newStatus, (err, data) => {
      if (err) {
        let error = { status: err }
        return next(error)  
      }
      else {
        res.send(data);
      }
    });
  }
  else if (newStatus === "approved" || newStatus === "declined") {
    appProcessor.updateApplicationByOwner(id, newStatus, (err, data) => {
      if (err) {
        let error = { status: err }
        return next(error)  
      }
      else {
        res.send(data);
      }
    });
  }
  else {
    let error = { status: 400 }
    return next(error)
  }
})

app.use((err, req, res, next) => {
  if (err.status) {
    return res.sendStatus(err.status);
  }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
