var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');


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
    fs.writeFile("/tmp/test", req.body.ticket, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
    // then force the xvm stuff to happen 
}); 
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('thanks');
});
app.listen(8080);
