
function fetch_next_question()
{
    $.get('/question', function(data)
    {
        let answers = data['answers'];
        $("#title").html(data['question']);
        
        $("#answers").empty();
        for (var i = 0; i < answers.length(); i+=2)
        {
            let row = document.createElement("div");
            row.className = "row";

            for (var j = 0; j < 2; j++)
            {
                if (i + j < answers.length())
                {
                    let option = document.createElement("div");
                    let option_text = document.createElement("button");
                    
                    option.className = "col-sm-6";
                    option_text.innerHTML = answers[i + j];
                    option.appendChild(option_text);
                    row.appendChild(option);
                }
            }
        
            $("#answers").append(row);
        }
    });
}
