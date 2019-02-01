
/*
$(document).ready(function() 
{
    let popup = $("#popup")[0];

    popup.onmouseout = function() 
    {
        popup.style.display = "none";
    };

    $(".hover").mouseover(function(event) 
    {
        let name = event.currentTarget;
        popup.innerHTML = name.innerHTML + "'s information here";

        popup.style.left = event.originalEvent.clientX + "px";
        popup.style.top = event.originalEvent.clientY + "px";
        popup.style.display = "block";
    });
});
*/

$("#leaderboard-data").ready(function() 
{
    // Request data from server
    $.get("/leaderboard?page=0", function(data) 
    {
        for (var i = 0; i < data.length; i++)
        {
            // Create new row elements
            var row = document.createElement("tr");
            var username = document.createElement("td");
            var score = document.createElement("td");
            var rank = document.createElement("td");
    
            // Fill the row with data
            var user = data[i];
            username.innerHTML = user['username'];
            score.innerHTML = user['score'];
            rank.innerHTML = user['rank'];
            row.appendChild(username);
            row.appendChild(score);
            row.appendChild(rank);
    
            // Add it to the leaderboard
            $("#leaderboard-data").append(row);
        }
    }).fail(function() 
    {
        $("#error").show();
    });
});

function logout()
{
    $.get('/logout', function(data)
    {
        if (data['status'] == 0)
        {
            document.cookies = "uid=";
            window.location.href = "/";
        }
    });
}
