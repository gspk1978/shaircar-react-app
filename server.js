var express = require('express');
const request = require('request');
const rest_api_helper = require('./makeRestCalls');
const path = require('path');
//const cors = require('cors');
var app = express();
//app.use(cors())

app.listen(8080, () => {
 console.log("Server running on port 8080");
});

    /*
    ** This method is to call the api to get the Vin Details 
    ** Vin validity and other details such as Manufacturer,
    ** Series, Model, year etc are extracted based on the variable id attribute representing each vehicle property
    */

app.get('/getVinDetails/:vinnumber', (req, res) => {
    if (!req.params.vinnumber) {
        res.status(500).json({ err: 'The VIN number cannot be empty' })
    }

    request.get({ url: "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/"+req.params.vinnumber+"?format=json" },
         function(error, response, body) {
        if (!error && response.statusCode == 200) {
            let tempBody = JSON.parse(body);
            let customResponse = {};
            let results = tempBody.Results;
            for (var result of results) 
            {
              if(result.VariableId === 191)
              {
                customResponse.vinvaliditystatus = result.Value;
              }
              if(result.VariableId === 26)
              {
                customResponse.vehiclemake = result.Value;
              }
              if(result.VariableId === 27)
              {
                customResponse.vehiclemanufacturer = result.Value;
              }
              if(result.VariableId === 29)
              {
                customResponse.vehiclemodelyear = result.Value;
              }
              if(result.VariableId === 34)
              {
                customResponse.vehicleseries = result.Value;
              }
            }
            res.json(customResponse);
           }
           else{
            res.status(500).json({ error: 'The VIN number cannot be empty' })
           }
       });
})

    /*
    ** This method is to call the api to get All manaufacturers 
    */

app.get('/getAllManufacturers', (req, res) => {
    rest_api_helper.make_rest_call('https://vpic.nhtsa.dot.gov/api/vehicles/GetAllManufacturers?format=json')
    .then(response => {
        res.json(response)
    })
    .catch(error => {
        res.send(error)
    })
})

    /*
    ** This method is to call the api to get makes from a Manufacturer
    */

app.get('/getMakeForManufacturers/:manuname', (req, res) => {
    if (!req.params.manuname) {
        res.status(500);
        res.send({"Error": "The manufacturer name seems to be not valid."});
        console.log("The manufacturer name seems to be not valid.");
    }
    rest_api_helper.make_rest_call('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakeForManufacturer/'+req.params.manuname+'?format=json')
    .then(response => {
        res.json(response)
    })
    .catch(error => {
        res.send(error)
    })
})

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
      
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
  }