const express = require("express");
const app = express();
const bodyParser = require("body-parser");

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

app.post("/application", (req, res) => {
  const renterId = req.body.renter_id;
  const ownerId = req.body.owner_id;
  const propertyId = req.body.property_id;

  let application = new Application(renterId, ownerId, propertyId);

  dynamodb.putItem(application.query(), (err, data) => {
    if (err) {
      res.sendStatus(500);
    }
    else {
      res.send(data);
    }
  });
});

app.get("/application", (req, res) => {
  const params = {
    TableName : 'chaos-application-service',
    FilterExpression: "contains (owner_id, :ownerId) OR contains (renter_id, :renterId)",
    ExpressionAttributeValues : {   
        ':ownerId' : "31",
        ':renterId' : "31"
    }
  };

  docClient.scan(params, (err, data) => {
    if (err) {
      res.sendStatus(500);
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

app.get("/application/:id", (req, res) => {
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
      res.sendStatus(500);
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

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
