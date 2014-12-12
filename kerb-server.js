var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var exec = require('child_process').exec;

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write('<html><body>Hello 6.858!</body></html>');
    res.end();
});

app.post('/', function(req, res){
    var fileName = '/tmp/krb5cc_1000';
    var uriEncodedString = decodeURIComponent(req.body.ticket);

    // TODO: Try sending / receiving without URL encoding
    // var buffer = atob(uriEncodedString);

    var buffer = new Buffer(uriEncodedString, 'base64').toString('ascii');

    // console.log(buffer, 'buffer');
    // console.log(ticket, 'ticket');

    // var ticket = base64DecToArr(ticket);
    console.log('buffer', buffer);
    fs.writeFile(fileName, buffer, function(err) {
    if (err) {
        res.send(500);
        console.log(err);
    } 
    else {
        // input to tell remctl where to look
        var command = 'sh ' + __dirname + '/kerb.sh ' + "'" + fileName + "'";
          exec(command, function(error, stdout, stderr) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(stdout);
            res.end('bye');
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                res.send(500); // if the script fails, send 500
                console.log('exec error: ' + error);
            }
        });

        }
    }); 
});
app.listen(8080);
