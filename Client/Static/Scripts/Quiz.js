
function shuffle(a) 
{
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) 
    {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

var has_answered = false;
var answer_lookup = {};

function fetch_next_question()
{
    $("#wrong").hide();
    $("#right").hide();
    $("#next").hide();
    has_answered = false;

    $.get('/question', function(data)
    {
        $("#answers").empty();
        $("#title").html(data['question']);
        answer_lookup = {};

        let answers = shuffle(data['answers']);
        for (var i = 0; i < answers.length; i+=2)
        {
            let row = document.createElement("div");
            row.className = "row";

            for (var j = 0; j < 2; j++)
            {
                if (i + j < answers.length)
                {
                    let option = document.createElement("div");
                    let option_text = document.createElement("button");
                    
                    option.className = "col-sm-6";
                    option_text.innerHTML = answers[i + j];
                    option_text.onclick = () => { option_clicked(option_text); };
                    option.appendChild(option_text);
                    row.appendChild(option);
                    answer_lookup[option_text.innerHTML] = option_text;
                }
            }
        
            $("#answers").append(row);
        }
    });
}


function option_clicked(option)
{
    let answer = option.innerHTML;
    if (!has_answered)
    {
        if (answer == "guacamole nibba penis")
        {
            option.style.backgroundColor = "#4CAF50";
            $("#right").show();
        }
        else
        {
            option.style.backgroundColor = "#f44336";
            answer_lookup["guacamole nibba penis"].style.backgroundColor = "#4CAF50";
            $("#wrong").show();
        }
        
        $("#next").show();

        /*
        $.post("/answer", {answer: answer}).done(function(data)
        {
            if (data['correct'])
            {

            }
        });
        */

        has_answered = true;
    }
}

$(document).ready(function() 
{
    fetch_next_question();
});
