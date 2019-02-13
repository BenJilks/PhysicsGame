var {Server} = require("./Server");
var {LoginManager} = require("./LoginManager");
var {QuestionManager} = require("./QuestionManager");

function main()
{
    var s = new Server();
    var lm = new LoginManager();
    var qm = new QuestionManager();
    lm.Connect("UserData.db");
    qm.Connect("Questions.db");
    
    s.Start(lm, qm);
}

main(); 
