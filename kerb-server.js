var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

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
    console.dir(req.body.ticket);
    // add logic to put in the right krbccname
    var fileName = "/tmp/" + "krb5cc_1000_test";
    fs.writeFile(fileName, req.body.ticket, function(err) {
    if(err) {

        console.log(err);
    } else {
    	console.log('hello herror');

  		var command = 'sh ' + __dirname + '/kerb.sh' req.body.kerb_location;
  		console.log(command, 'command');

		exec(command, function(error, stdout, stderr) {
  			// res.send(Buffer.concat(stdout));
  			res.writeHead(200, {'Content-Type': 'text/html'});
  			res.write(stdout);

			res.end('thanks');

		    console.log('stdout: ' + stdout);
		    console.log('stderr: ' + stderr);
		    if (error !== null) {
  				res.send(500); // when the script fails, generate a Server Error HTTP response

		        console.log('exec error: ' + error);
		    }
		});

  	}
    
    // then force the xvm stuff to happen 
}); 

});
app.listen(8080);
