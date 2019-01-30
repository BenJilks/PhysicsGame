
$(document).ready(function() {
    let popup = $("#popup")[0];

    popup.onmouseout = function() {
        popup.style.display = "none";
    };

    $(".hover").mouseover(function(event) {
        let name = event.currentTarget;
        popup.innerHTML = name.innerHTML + "'s information here";

        popup.style.left = event.originalEvent.clientX + "px";
        popup.style.top = event.originalEvent.clientY + "px";
        popup.style.display = "block";
    });
});
