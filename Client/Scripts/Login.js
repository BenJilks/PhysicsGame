
function login()
{
    let username = $("#l_username").val();
    let pwd = $("#l_pwd").val();
    $.post("/login", {mode: "login", username: username, pwd: pwd})
        .done(function(rawdata)
    {
        let data = JSON.parse(rawdata);
        if (data['status'] != 0)
            console.log("Error: " + data['status']);
        else
            window.location.href = "/dashboard";
    });
}

function register()
{
    let username = $("#r_username").val();
    let pwd = $("#r_pwd").val();
    let pwd_conf = $("#r_pwd_conf").val();
    $.post("/login", {mode: "register", username: username, pwd: pwd, pwd_conf: pwd_conf})
        .done(function(rawdata)
    {
        let data = JSON.parse(rawdata);
        if (data['status'] != 0)
            console.log("Error: " + data['status']);
        else
            window.location.href = "/dashboard";
    });
}
