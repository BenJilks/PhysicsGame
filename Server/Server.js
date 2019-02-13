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

    Start(loginManager, questionManager)
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
            if(req.cookies == undefined)
            {
                this.SendPage({},"Client/Pages/Login.html",res);
            }
            else
            {
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

        app.get("/Logout", (req,res)=>
        {
            res.setHeader('Content-Type', 'application/json');
            if(req.cookies == undefined)
            {
                res.send(JSON.stringify({status: 0}));
            }
            else
            {
                loginManager.loggedInUsers[req.cookies.uid] = undefined;
                res.send(JSON.stringify({status: 0}));
            }
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
                    let user = loginManager.loggedInUsers[req.cookies.uid];
                    this.SendPage(
                    {
                        name: user.username,
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
                    loginManager.LoginUser(
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
            res.setHeader('Content-Type', 'application/json');
            loginManager.CheckUserExists(req.body.username, (exists) =>
            {
                if(!exists)
                {
                    loginManager.AddUser(
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

        app.get("/Quiz", (req, res) =>
        {
            this.SendPage({},"Client/Pages/Quiz.html",res);
        });

        app.get("/question", (req, res)=>
        {

            if(req.cookies == undefined ||
                req.cookies.uid == undefined ||
                loginManager.loggedInUsers[req.cookies.uid] == undefined
            )
            {
                this.SendPage({},"Client/Pages/Login.html",res);
            }
            else
            {
                let user = loginManager.loggedInUsers[req.cookies.uid];
                console.log("USER: "+user.username);

                if(user.currentQuestion == undefined)
                {
                    questionManager.GetRandomQuestion((data)=>{
                        console.log(data);
                        user.currentQuestion = data.QuestionId;
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify(
                        {
                            question: data.Question,
                            answers : JSON.parse(data.Answers)
                        }
                        ));
                    });
                }
                else
                {
                    questionManager.GetQuestionById(
                        user.currentQuestion,
                        (data) =>
                        {
                            console.log(data);
                            user.currentQuestion = data.QuestionId;
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify(
                            {
                                question: data.Question,
                                answers : JSON.parse(data.Answers),
                            }));
                        }
                    );
                }

            }



            
        });

        app.post("/answer", (req, res)=>
        {
            if(req.cookies == undefined ||
                req.cookies.uid == undefined ||
                loginManager.loggedInUsers[req.cookies.uid] == undefined
            )
            {
                this.SendPage({},"Client/Pages/Login.html",res);
            }
            else
            {
                let user = loginManager.loggedInUsers[req.cookies.uid];

                if(user.currentQuestion == undefined)
                {
                    this.SendPage({},"Client/Pages/Dashboard.html",res);
                }
                else
                {
                    console.log("USER: "+user.username);
                    questionManager.GetQuestionById(
                        user.currentQuestion,
                        (data) =>
                        {
                            user.currentQuestion = undefined;
                            console.log("BODY")
                            console.log(req.body);
                            console.log(data);
                            if(req.body.answer != undefined && 
                                req.body.answer == data.correctAnswer)
                            {
                                // TODO add points
                            }
    
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify(
                            {
                                correct:data.CorrectAnswer
                            }));
    
                        }
                    );
                }

            }
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
