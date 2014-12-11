var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var atob = require('atob');
var base64 = require('base64-js');
var busboy = require('connect-busboy');




app.use(express.static(__dirname));
app.use(busboy()); 


app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write('<html><body>Hello World</body></html>');
    res.end();
});

// app.post('/', function(req, res) {
//     var fstream;
//     req.pipe(req.busboy);
//     req.busboy.on('file', function (fieldname, file, filename) {
//         console.log("Uploading: " + filename); 
//         fstream = fs.createWriteStream(__dirname + '/files/' + filename);
//         file.pipe(fstream);
//         fstream.on('close', function () {
//             res.redirect('back');
//         });
//     });
// });

app.post('/', function(req, res){
    console.log('POST /');
    console.log(req);
    // add logic to put in the right krbccname
    var fileName = '/tmp/krb5cc_1000';

    var uriEncodedString = decodeURIComponent(req.body.ticket);

    var ticket = atob(uriEncodedString);
    // var ticket = base64.toByteArray(req.body.ticket);
    console.log(req, 'req');


    // var fstream;
    // req.pipe(req.busboy);
    // req.busboy.on('file', function (fieldname, file, filename) {
    //     var fileName = '/tmp/krb5cc_1000';
    //     console.log("Uploading: " + fileName); 
    //     fstream = fs.createWriteStream();
    //     file.pipe(fstream);
    //     fstream.on('close', function () {
    //         // call the remctl stuff


    //         var command = 'sh ' + __dirname + '/kerb.sh ' + "'" + fileName + "'";

    //         exec(command, function(error, stdout, stderr) {
    //             // res.send(Buffer.concat(stdout));
    //             res.writeHead(200, {'Content-Type': 'text/html'});
    //             res.write(stdout);

    //             res.end('bye');

    //             console.log('stdout: ' + stdout);
    //             console.log('stderr: ' + stderr);
    //             if (error !== null) {
    //                 res.send(500); // if the script fails, send 500
    //                 console.log('exec error: ' + error);
    //             }
    //         });
    //     });
    // });


    // console.log(ticket);
    // var ticket = new Buffer(req.body.ticket, 'base64').toString('ascii');
    // var fileName = '/tmp/krb5cc_1000_'+'deborahc';
    fs.writeFile(fileName, ticket, function(err) {
    if (err) {

        console.log(err);
    } 
    else {
        // input to tell remctl where to look
        var command = 'sh ' + __dirname + '/kerb.sh ' + "'" + fileName + "'";

          exec(command, function(error, stdout, stderr) {
            // res.send(Buffehtr.concat(stdout));
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
