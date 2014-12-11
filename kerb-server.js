var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var atob = require('atob');
var base64 = require('base64-js');



app.use(express.static(__dirname));


app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write('<html><body>Hello World</body></html>');
    res.end();
});

app.post('/', function(req, res){
    console.log('POST /');
    console.log(req);
    // add logic to put in the right krbccname
    var fileName = '/tmp/krb5cc_1000';

    // var uriEncodedString = decodeURIComponent(req.body.ticket);

    // var ticket = atob(req.body.ticket);
    // var ticket = base64.toByteArray(req.body.ticket);



    // console.log(ticket);
    // var ticket = new Buffer(req.body.ticket, 'base64').toString('ascii');
    // var fileName = '/tmp/krb5cc_1000_'+'deborahc';
    fs.writeFile(fileName, 'hi', function(err) {
    if (err) {

        console.log(err);
    } 
    else {
        // input to tell remctl where to look
        var command = 'sh ' + __dirname + '/kerb.sh ' + "'" + fileName + "'";

          exec(command, function(error, stdout, stderr) {
            // res.send(Buffer.concat(stdout));
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
