"use strict";

var fs = require("fs");
var express = require("express");
var cookieParser = require('cookie-parser')
var handlebars = require("handlebars");

class Server
{    
    constructor(port = 4200)
    {
        this.port = port;
    }

    Start(loginManager)
    {
        this.loginManager = loginManager;
        var app = express();
        app.use(express.static('Client/Static'));
        app.use(express.json());
        app.use(cookieParser());
        app.use(express.urlencoded());
        console.log("Starting server");

        app.get("/",(req,res)=>this.SendPage({},"Client/Pages/Index.html",res));
        app.get("/Login", (req,res)=>
        {
            this.SendPage({},"Client/Pages/Login.html",res);
        });

        app.get("/Dashboard", (req,res)=>
        {
            if(req.cookies == undefined)
            {
                this.SendPage({},"Client/Pages/Login.html",res);
            }
            else
            {
                console.log(req.cookies);
                if(loginManager.loggedInUsers[req.cookies.uid] != undefined)
                {
                    this.SendPage(
                    {
                        name: loginManager.loggedInUsers[req.cookies.uid],
                        score: "6969",
                        rank: "weed gang master",
                        answered : "420",
                        correct : "421",
                        tonextrank: "weed",
                        nextrank: "weed gang master 2: despacito edition"
                    },"Client/Pages/Dashboard.html",res);
                }
                else
                {
                    this.SendPage({},"Client/Pages/Login.html",res);
                }
            }
        });
        
        app.post("/Login", (req,res)=>
        {
            res.setHeader('Content-Type', 'application/json');
            loginManager.CheckUserExists(req.body.username, (exists) =>
            {
                if(exists)
                {
                    let uid = loginManager.LoginUser(
                        req.body.username,req.body.password, (uid) =>
                        {
                            if(uid)
                            {
                                res.send(JSON.stringify({status: 0,uid : uid}));
                            }
                            else res.send(JSON.stringify({status: 2}));
                        }
                    );
                }
                else res.send(JSON.stringify({status: 1}));
            });
        });

        app.post("/Register", (req,res)=>
        {
            console.log("Register Post");
            console.log(req.body);
        });

        //Keep as the last route
        app.get('*', (req, res)=>this.SendPage({},"Client/Pages/404.html",res));

        app.listen(this.port, () =>
            console.log(`Listening on port ${this.port}!`));
    };

    SendPage(data, path, res)
    {
        fs.readFile(path, 
            function(error, source)
            {
                if(error){this.SendPage({}, "Client/Pages/404.html", res);}
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

module.exports = 
{
    Server
}
