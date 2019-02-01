var {Server} = require("./Server");
var {LoginManager} = require("./LoginManager");

function main()
{
    var s = new Server();
    var lm = new LoginManager();
    lm.Connect("UserData.db");
    s.Start(lm);
}

main(); 
