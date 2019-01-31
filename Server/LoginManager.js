const sqlite3 = require('sqlite3');

class LoginManager
{
    Connect(databasePath = undefined)
    {
        if(databasePath == undefined)
        {
            this.database = new sqlite3.Database(":memory:", (err) => 
            {
                if(err)
                {
                    console.error("Login manager error:");
                    console.error(err.message);
                }
                else
                {
                    console.log(
                        "Login manager connected to memory-based database"
                    );
                }
            });
        }
        else
        {
            this.database = new sqlite3.Database(databasePath, (err) => 
            {
                if (err) 
                {
                    console.error("Login manager error:");
                    console.error(err.message);
                }
                else
                {
                    console.log(
                        "Login manager connected to file-based database"
                    );
                }
            });
        }
    }

    Disconnect()
    {
        this.database.close((err) => 
        {
            if(err)
            {
                console.error("Login manager error:");
                console.error(err.message);
            }
            else
            {
                console.log("Closed connection to user database");
            }
        });
    }
}

module.exports = 
{
    LoginManager
}