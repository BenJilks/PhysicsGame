
function processLogin(data)
{
    if (data['status'] != 0)
    {
        console.log("Error: " + data['status']);
        return;
    }

    $.cookie("uid", data['uid']);
    window.location.href = "/dashboard";
}

function login()
{
    let username = $("#l_username").val();
    let pwd = $("#l_pwd").val();
    $.post("/login", {username: username, pwd: pwd})
        .done(function(rawdata)
    {
        let data = JSON.parse(rawdata);
        processLogin(data);
    });
}

function register()
{
    let username = $("#r_username").val();
    let pwd = $("#r_pwd").val();
    let pwd_conf = $("#r_pwd_conf").val();
    $.post("/register", {username: username, pwd: pwd, pwd_conf: pwd_conf})
        .done(function(rawdata)
    {
        let data = JSON.parse(rawdata);
        processLogin(data);
    });
}
