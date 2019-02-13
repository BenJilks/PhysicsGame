
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
var answer_name_lookup = {};

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

        let answers = data['answers'];
        for (var i = 0; i < answers.length; i++)
            answer_lookup[answers[i]] = i;
        answers = shuffle(answers);

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
                    let index = i + j;
                    let real_index = answer_lookup[answers[index]];
                    
                    option.className = "col-sm-6";
                    option_text.innerHTML = answers[index];
                    option_text.onclick = () => { option_clicked(option_text, real_index); };
                    option.appendChild(option_text);
                    row.appendChild(option);
                    answer_name_lookup[real_index] = option_text;
                }
            }
        
            $("#answers").append(row);
        }
    });
}

function option_clicked(option, index)
{
    if (!has_answered)
    {
        $.post("/answer", {answer: index}).done(function(data)
        {
            if (data['correct'] == index)
            {
                option.style.backgroundColor = "#4CAF50";
                $("#right").show();
            }
            else
            {
                option.style.backgroundColor = "#f44336";
                answer_name_lookup[data['correct']].style.backgroundColor = "#4CAF50";
                $("#wrong").show();
            }
            $("#next").show();
        });

        has_answered = true;
    }
}

$(document).ready(function() 
{
    fetch_next_question();
});
