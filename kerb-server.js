var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var exec = require('child_process').exec;
var pythonShell = require('python-shell');

var crypto = require('crypto');
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
    var xvm_command = req.body.command;
    var xvm_machine_name = req.body.machine || ''
    var token = crypto.randomBytes(32).toString('hex');
    console.log('token is', token);
    var fileName = '/tmp/krb5cc_' +token;
    var uriEncodedString = decodeURIComponent(req.body.ticket);

    // TODO: Try sending / receiving without URL encoding
    // var buffer = atob(uriEncodedString);

    var buffer = new Buffer(uriEncodedString, 'base64').toString('ascii');
    fs.writeFile(fileName, buffer, function(err) {
    if (err) {
        res.send(500);
        console.log(err);
    } 
    else {
        var options = {
            args: [fileName, xvm_command, xvm_machine_name],  
            scriptPath: '/home/deborahc/Documents/school/Fall_2014/6.858/proj/kerb-server/'

        };

        script_location = 'remctl-xvm.py'
        pythonShell.run(script_location, options, function (err, results) {
            if (err) {
                res.send(500); // if the script fails, send 500
                throw err;
            }
          // results is an array consisting of messages collected during execution
            console.log('results: %j', results);
            console.log(results.join());
            output_to_app = results.join();
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(output_to_app)
            res.end('bye');
        });


        // // input to tell remctl where to look
        // var command = 'sh ' + __dirname + '/kerb.sh ' + "'" + fileName + "'";
        //   exec(command, function(error, stdout, stderr) {
        //     res.writeHead(200, {'Content-Type': 'text/html'});
        //     res.write(stdout);
        //     res.end('bye');
        //     console.log('stdout: ' + stdout);
        //     console.log('stderr: ' + stderr);
        //     if (error !== null) {
        //         res.send(500); // if the script fails, send 500
        //         console.log('exec error: ' + error);
        //     }
        // });

        }
    }); 
});
app.listen(8080);
