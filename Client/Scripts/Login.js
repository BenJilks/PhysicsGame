
function processLogin(data)
{
    console.log(data);
    if (data['status'] != 0)
    {
        console.log("Error: " + data['status']);
        return;
    }

    document.cookie = "uid=" + data['uid'];
    window.location.href = "/Dashboard";
}

function login()
{
    let username = $("#l_username").val();
    let pwd = $("#l_pwd").val();
    $.post("/login", {username: username, password: pwd})
        .done(function(data)
    {
        processLogin(data);
    });
}

function register()
{
    let username = $("#r_username").val();
    let pwd = $("#r_pwd").val();
    let pwd_conf = $("#r_pwd_conf").val();
    $.post("/register", {username: username, password: pwd, password_conf: pwd_conf})
        .done(function(data)
    {
        processLogin(data);
    });
}
