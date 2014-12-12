var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var pythonShell = require('python-shell');
var crypto = require('crypto');

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Handle GET requests with simple Hello message
app.get('/', function(req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write('<html><body>Hello 6.858!</body></html>');
    res.end();
});

// Handle POST requests
// Writes the ticket from the client to a file, with a random file name
// 
app.post('/', function(req, res){
    var xvm_command = req.body.command;
    var xvm_machine_name = req.body.machine || ''
    var token = crypto.randomBytes(32).toString('hex');
    var fileName = '/tmp/krb5cc_' + token;
    var uriEncodedString = decodeURIComponent(req.body.ticket);
    var buffer = new Buffer(uriEncodedString, 'base64').toString('ascii');
    fs.writeFile(fileName, buffer, function(err) {
    if (err) {
        res.send(500);
        console.log(err);
    } 
    else {
        var options = {
            args: [fileName, xvm_command, xvm_machine_name],  
            scriptPath: '/home/panda/kerb-server/'
        };

        script_location = 'remctl-xvm.py'
        // run python script that handles remctl commands
        pythonShell.run(script_location, options, function (err, results) {
            if (err) {
                res.send(500); // if the script fails, send 500
                throw err;
            }
            // results is an array consisting of messages collected during execution
            output_to_app = results.join();
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(output_to_app)
            res.end('bye');
            });
        }
    }); 
});
app.listen(8080);
