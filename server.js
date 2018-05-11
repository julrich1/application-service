const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");
AWS.config.update({region:'us-west-2'});
const credentials = new AWS.SharedIniFileCredentials({profile: 'nordstrom-federated'});
AWS.config.credentials = credentials;

const port = 3000;

const dynamodb = new AWS.DynamoDB();

app.use(bodyParser.json());

app.post("/application", (req, res) => {
    res.send(req.body);
});

var params = {
    Item: {
     "application_id": {
       N: "1"
      },
     "owner_id": {
       N: "1"
      },
     "renter_id": {
       N: "2"
     },
     "application_status": {
       S: "pending"
     }
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName: "chaos-application-service"
};

app.get("/", (req,res) => {
    dynamodb.putItem(params, (err, data) => {
        if (err) { console.log(err); }
        else { console.log(data); }
    })
})

app.get("/application", (req, res) => {
    var params = {
      TableName: "chaos-application-service"
    }
    dynamodb.scan(params, (err, data) => {
      if (err) { console.log(err); }
      else { res.send(data); }
    })
})

app.get("/application/:id", (req, res) => {
  const id = parseInt(req.params.id)
  var params = {
    Key: {
      "application_id": {
        N: id.toString()
      }
    },
    TableName: "chaos-application-service"
  }
  dynamodb.getItem(params, (err, data) => {
    if (err) { console.log(err); }
    else { res.send(data); }
  })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
