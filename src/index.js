$('.auditorium-polygon').hover(
    function (){
        $('.desc').html($(this).attr("description-date"));
    },
     function() {
         $('.desc').html("Ящеры");
    }
)

$('.auditorium-polygon').click(
    function (){
        $('.desc').html("Текст");
    }
)