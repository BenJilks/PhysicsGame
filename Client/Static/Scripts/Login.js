
let login_error_lookup = 
[
    "No error",
    "Could not find user",
    "Incorrect password"
];

let register_error_lookup = 
[
    "No error",
    "A user with that name already exists",
    "Password does not match confirmation"
];

function processLogin(data, error_lookup)
{
    if (data['status'] != 0)
    {
        $("#error-msg").html(error_lookup[data['status']]);
        $("#error").show();
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
        processLogin(data, login_error_lookup);
    });
}

function register()
{
    let username = $("#r_username").val();
    let pwd = $("#r_pwd").val();
    let pwd_conf = $("#r_pwd_conf").val();
    if (pwd != pwd_conf)
    {
        $("#error-msg").html(register_error_lookup[2]);
        $("#error").show();
        return;
    }

    $.post("/register", {username: username, password: pwd})
        .done(function(data)
    {
        processLogin(data, register_error_lookup);
    });
}

$(document).ready(function()
{
    $(".login").keyup(function(event)
    {
        event.preventDefault();
        if (event.keyCode == 13)
            login();
    });
    
    $(".register").keyup(function(event)
    {
        event.preventDefault();
        if (event.keyCode == 13)
            register();
    });    
});
