
$(document).ready(() => 
{
    $('#src').keyup(() => 
    {
        let src = $('#src').val()
        $('#question').html(decode_question(src))
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    })
})
