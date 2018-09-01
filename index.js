var express = require('express');
var http = require('http')
var ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');

var app = express();
var port = 1337;

var api = new ParseServer({
  databaseURI: 'mongodb://localhost:27017/dev', // Connection string for your MongoDB database
  // cloud: __dirname + '/cloud/main.js', // Absolute path to your Cloud Code
  appId: 'myAppId',
  masterKey: 'myMasterKey', // Keep this key secret!
  // fileKey: 'optionalFileKey',
  serverURL: 'http://localhost:1337/parse', // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Test", "Tests", "testnames"]
  }
});

var options = { allowInsecureHTTP: true };

var dashboard = new ParseDashboard({
  "apps": [{
      "serverURL": "http://192.168.29.186:1337/parse",
      "appId": "myAppId",
      "masterKey": "myMasterKey",
      "appName": "MyApp"
  }],
  "users": [{
      "user": "admin",
      "pass": "admin_password"
  }]
}, options);

// Serve the Parse API on the /parse URL prefix
app.use('/parse', api);
app.use('/dashboard', dashboard);

var httpServer = http.createServer(app);

httpServer.listen(1337, function() {
  console.log('parse-clone running on port 1337.');
});

var dashboard_server = http.createServer(app);
dashboard_server.listen(4040);

ParseServer.createLiveQueryServer(httpServer);
