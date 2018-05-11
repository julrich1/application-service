const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const AWS = require("aws-sdk");
const credentials = new AWS.SharedIniFileCredentials({profile: 'nordstrom-federated'});
AWS.config.update({region:'us-west-2'});
AWS.config.credentials = credentials;

const Application = require("./Application");

const port = 3000;

const dynamodb = new AWS.DynamoDB();

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
      TableName: "chaos-application-service"
  };

  dynamodb.scan(params, (err, data) => {
    if (err) { console.log(err); }
    else { res.send(data); }
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
    if (err) { console.log(err); }
    else { res.send(data); }
  });
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
