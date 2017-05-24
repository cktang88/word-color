var express = require('express'),
    app = express(),
    port = 8000;


var server = require('http').Server(app);

//serves all static files in /public
app.use(express.static(__dirname + '/public'));

server.listen(port, function() {
    console.log('Listening on port ' + port)
});
