const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Enable CORS for all routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});
let token=''
// Proxy endpoint
app.post('/proxy', async (req, res) => {
    try {
        const response = await axios.post('https://uataaacasefilingws.adr.org/authenticate', req.body, {
            headers: {
                'Content-Type': 'application/json'
             }
        });
        token = response.data.token;
        res.json(response.data);
    } catch (error) {
        console.error('Error during proxy request:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).json({
            message: error.response ? error.response.data : error.message,
            headers: error.config.headers,
            requestBody: error.config.data
        });
    }
});

// Send Data To AAA
app.post('/CaseFiling', async (req, res) => {
    try {
       // console.log('req.body::'+req.body[0].Apidata);
       // console.log('authToken'+req.body[0].authToken);
        const response = await axios.post('https://uataaacasefilingws.adr.org/CaseFiling', req.body[0].Apidata, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization":"Bearer "+req.body[0].authToken
             }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error during proxy request:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).json({
            message: error.response ? error.response.data : error.message,
            headers: error.config.headers,
            requestBody: error.config.data
        });
    }
});
// Send Document
app.post('/documents', async (req, res) => {
    try {
        const response = await axios.post('http://192.168.7.130:8081/documents', req.body[0].ApiData, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization":"Bearer "+req.body[0].token
             }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error during proxy request:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).json({
            message: error.response ? error.response.data : error.message,
            headers: error.config.headers,
            requestBody: error.config.data
        });
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Proxy server listening at http://localhost:${port}`);
});
