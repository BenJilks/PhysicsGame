
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

function fetch_next_question()
{
    $.get('/question', function(data)
    {
        $("#answers").empty();
        $("#title").html(data['question']);
        
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
                }
            }
        
            $("#answers").append(row);
        }
    });
}

function option_clicked(option)
{
    alert(option.innerHTML);
}

$(document).ready(function() 
{
    fetch_next_question();
});
