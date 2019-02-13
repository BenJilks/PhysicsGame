
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

function hide_popups()
{
    $('.popup').hide();
    $('#update-error').hide();
}

function show_popup(id)
{
    hide_popups();
    $('#' + id).show();
}

function update_info()
{
    let new_name = $("#update-name").val();
    let old_pass = $("#update-old-pass").val();
    let new_pass = $("#update-new-pass").val();
    let new_pass_conf= $("#update-new-pass-conf").val();

    console.log(username, ", ", new_name);
    if (new_name != username || new_pass != "")
    {
        if (new_pass != new_pass_conf)
        {
            $("#update-error text").html("Password does not match confirmation");
            $("#update-error").show();
            return;
        }

        $.post("/update_info", {name:new_name, 
            old_pass:old_pass, new_pass:new_pass})
            .done(function(data)
        {
            if (data['error'] != 0)
            {
                if (data['error'] == 1)
                    $("#update-error text").html("Old password incorrect");
                else
                    $("#update-error text").html("Invalid username");

                $("#update-error").show();    
                return;
            }
            hide_popups();
        });

        return;
    }
    hide_popups();
}
