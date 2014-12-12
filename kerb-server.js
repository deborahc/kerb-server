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
    console.log(req.body.ticket, 'ticket');
    var uriEncodedString = decodeURIComponent(req.body.ticket);

    // TODO: Try sending / receiving without URL encoding
    var ticket = atob(uriEncodedString);

    var buffer = new Buffer(uriEncodedString, 'base64').toString('ascii');

    console.log(buffer, 'buffer');
    console.log(ticket, 'ticket');

    // var ticket = base64DecToArr(ticket);
    console.log('ticket', ticket);

    //from mozilla
    function b64ToUint6 (nChr) {

      return nChr > 64 && nChr < 91 ?
          nChr - 65
        : nChr > 96 && nChr < 123 ?
          nChr - 71
        : nChr > 47 && nChr < 58 ?
          nChr + 4
        : nChr === 43 ?
          62
        : nChr === 47 ?
          63
        :
          0;

    }

    function base64DecToArr (sBase64, nBlocksSize) {

      var
        sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""), nInLen = sB64Enc.length,
        nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2, taBytes = new Uint8Array(nOutLen);

      for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
        nMod4 = nInIdx & 3;
        nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
        if (nMod4 === 3 || nInLen - nInIdx === 1) {
          for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
            taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
          }
          nUint24 = 0;

        }
      }

      return taBytes;
    }




    // var ticket = base64.toByteArray(req.body.ticket);


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
    fs.writeFile(fileName, buffer, function(err) {
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
