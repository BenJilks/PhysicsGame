"use strict";

var fs = require("fs");
var express = require("express");
var handlebars = require("handlebars");

class Server
{    
    constructor(port = 4200)
    {
        this.port = port;
    }

    Start()
    {
        var app = express();
        app.use(express.static('Client'));
        console.log("Starting server");

        app.get("/", (res, req) => this.ServeMain(res, req));

        app.listen(this.port, () =>
            console.log(`Listening on port ${this.port}!`));
    };

    SendPage(data, path, res)
    {
        fs.readFile(path, 
            function(error, source)
            {
                if(error){SendPage({}, "Client/Pages/404.html", res);}
                else
                {
                    if(path.endsWith('.html'))
                    {
                        var template = handlebars.compile(source.toString());
                        var outHTML = template(data);
                        res.send(outHTML);
                    }
                }
            }
        );
    }

    ServeMain(req, res)
    {

        var data = 
        {
            title : "Rota system"
        };

        this.SendPage(data, "Client/Pages/main.html", res);
    }

    
}

function ReadFile(path)
{
    console.log("HERE");
    var source;

    fs.readFileSync(path, (err, data) => 
    {
        console.log("HERE2");
        source = data;
        console.log(data);
    });

    return source;
}

var s = new Server();
s.Start();

module.exports = 
{
    Server
}
