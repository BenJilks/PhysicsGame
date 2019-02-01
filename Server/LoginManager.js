const sqlite3 = require('sqlite3');
const crypto = require('crypto');

class LoginManager
{
    constructor()
    {
        this.loggedInUsers = {};
    }

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


        let createTables = 
        `
            CREATE TABLE IF NOT EXISTS UsersLoginData(
                Username VARCHAR(20) PRIMARY KEY NOT NULL,
                Password VARCHAR(20) NOT NULL,
                Salt VARCHAR(20) NOT NULL
            );

            CREATE TABLE IF NOT EXISTS UsersGameData(
                FOREIGN KEY(Username) REFERENCES UsersLoginData(Username)
                Password VARCHAR(20) NOT NULL,
                Salt VARCHAR(20) NOT NULL
            );
        `;

        this.database.run(createTables);
    }

    CheckUserExists(username, callback)
    {
        let getUser = "SELECT * FROM UsersLoginData WHERE username = ?";
        this.database.get(getUser, [username], (err, row)=>
        {
            if(err){console.error(err);}
            else if(!row) callback(false);
            else if(row.Username == username) callback(true);
        });
    }


    AddUser(username, password, callback)
    {
        let hash = crypto.createHash("sha256");
        let salt = (Math.random().toString(36).substring(2, 15) + 
                    Math.random().toString(36).substring(2, 15)).toString();
        hash.update(password + salt)
        password = hash.digest("hex");

        let addUser = 
        `
            INSERT INTO UsersLoginData(Username, Password, Salt)
            VALUES(?,?,?)
        `;
        this.database.run(addUser, [username, password, salt], (err) =>
        {
            if(err)
            {
                console.error("Could not add user");
                console.error(err);
            }
            else
            {
                let uid = (Math.random().toString(36).substring(2, 15) + 
                        Math.random().toString(36).substring(2, 15)).toString();
                this.loggedInUsers[uid] = username;
                callback(uid);
            }
        });
    }

    LoginUser(username, password, callback)
    {
        let getUser = "SELECT * FROM UsersLoginData WHERE Username = ?";
        this.database.get(getUser, [username], (err, row)=>
        {
            if(err){console.error(err);}
            else if(!row)
            {
                console.log("no results");
                callback(undefined);
            }
            else {
                console.log("username exists");
                console.log(row);

                let hash = crypto.createHash("sha256");
                let salt = row.Salt;
                hash.update(password + salt);
                password = hash.digest("hex");

                console.log("GOT PASSWORD");
                console.log(password);

                if(password == row.Password)
                {
                    let uid = (Math.random().toString(36).substring(2, 15) + 
                        Math.random().toString(36).substring(2, 15)).toString();
                    console.log("Correct Password");
                    this.loggedInUsers[uid] = username;
                    callback(uid);
                }
                else
                {
                    console.log("Incorrect Password");
                    callback(undefined);
                }
            }
        });


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