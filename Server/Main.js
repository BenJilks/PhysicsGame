
var {Server} = require("./Server");
var {LoginManager} = require("./LoginManager");

function main()
{
    var s = new Server();
    s.Start();

    var lm = new LoginManager();
    // lm.Connect("UserData.db");
    // lm.LoginUser("steven", "password123");
    // lm.Disconnect();
}

main(); 
