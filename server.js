// server.js
// where your node app starts

// init
// setup express for handling http requests
var express = require("express");
var app = express();
app.use(express.static('public')); // http://expressjs.com/en/starter/static-files.html
app.listen(3000);
console.log('Listening on port 3000');

// render the file at `views/index.html`
app.get("/", function (request, response) {
  try {
    response.sendFile(__dirname + '/views/index.html');
  } catch (err) {
    handleError(err, response);
  }
});

// show this message to visitors if something goes wrong
function handleError(err, response) {
  response.status(500);
  response.send(
    "<html><head><title>Internal Server Error!</title></head><body><pre>"
    + JSON.stringify(err, null, 2) + "</pre></body></pre>"
  );
}


