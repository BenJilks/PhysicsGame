const sqlite3 = require('sqlite3');

class QuestionManager
{
    Connect(databasePath = undefined)
    {
        if(databasePath == undefined)
        {
            this.database = new sqlite3.Database(":memory:", (err) => 
            {
                if(err)
                {
                    console.error("Question manager error:");
                    console.error(err.message);
                }
                else
                {
                    console.log(
                        "Question manager connected to memory-based database"
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
                    console.error("Question manager error:");
                    console.error(err.message);
                }
                else
                {
                    console.log(
                        "Question manager connected to file-based database"
                    );
                }
            });
        }


        let createTables = 
        `
            CREATE TABLE IF NOT EXISTS Questions(
                QuestionId INTEGER PRIMARY KEY NOT NULL,
                Question TEXT,
                Answers TEXT,
                Points INTEGER,
                CorrectAnswer INTEGER
            );
        `;
        

        this.database.run(createTables);
    }

    GetRandomQuestion(callback)
    {
        let getRandomQ = 
        `
            SELECT column FROM table
            ORDER BY RAND()
            LIMIT 1
        `;

        this.database.get(getRandomQ, [], (err, row)=>
        {
            if(err){console.error(err);}
            else callback(row);
        });
    }

    AddQuestion(question, answers, points, correctAnswerId)
    {
        let addQuestion = 
        `
            INSERT INTO Questions(
                QuestionId, Question, Answers, Points, CorrectAnswer)

            VALUES(?,?,?,?,?)
        `;

        let countItems = 
        `
            SELECT COUNT(*)
            FROM Questions
        `;

        this.database.get(countItems, (err, row) => 
        {
            let itemID = row["COUNT(*)"];


            this.database.run(addQuestion, [
                itemID, 
                question, 
                JSON.stringify({answers}).slice(11, -1), 
                points, 
                correctAnswerId
            ]);
            console.log(row);
        });
    }

    Disconnect()
    {
        this.database.close((err) => 
        {
            if(err)
            {
                console.error("Question manager error:");
                console.error(err.message);
            }
            else
            {
                console.log("Closed connection to question database");
            }
        });
    }
}

module.exports = 
{
    QuestionManager
}