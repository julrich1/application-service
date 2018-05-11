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
     "AlbumTitle": {
       S: "Somewhat Famous"
      }, 
     "Artist": {
       S: "No One You Know"
      }, 
     "SongTitle": {
       S: "Call Me Today"
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

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})