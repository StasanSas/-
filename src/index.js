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

function getDataFromDatabase(floor) {
    return fetch("http://127.0.0.1:5000")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function ConvertToWeekday(day) {
    switch(day) {
        case 0:
            return 'ВС';
        case 1:
            return 'ПН';
        case 2:
            return 'ВТ';
        case 3:
            return 'СР';
        case 4:
            return 'ЧТ';
        case 5:
            return 'ПТ';
        case 6:
            return 'СБ';
        default:
            return 'Некорректное значение дня';
    }
}

function ConvertToPeriod(currentHour, currentMinute) {
    if ((currentHour === 9) || (currentHour === 10 && currentMinute <= 29)) {
        return 1;
    }

    if ((currentHour === 10) || (currentHour === 11) || (currentHour === 12 && currentMinute <= 9)) {
        return 2;
    }

    if ((currentHour === 12) || (currentHour === 13) || (currentHour === 14 && currentMinute <= 19)) {
        return 3;
    }

    if ((currentHour === 14) || (currentHour === 15)) {
        return 4;
    }

    if ((currentHour === 16) || (currentHour === 17 && currentMinute <= 39)) {
        return 5;
    }

    if ((currentHour === 17) || (currentHour === 18) || (currentHour === 19 && currentMinute <= 19)) {
        return 6;
    }

    if ((currentHour === 19) || (currentHour === 20)) {
        return 7;
    }

    return -1;
}

function convertJsonToArray(jsonArray) {
    return jsonArray.map(item => item.number);
}

function checkAndColorAuditoriums() {
    const date = new Date();
    const day = ConvertToWeekday(date.getDay());
    const number = ConvertToPeriod(date.getHours(), date.getMinutes())

    getDataFromDatabase(6)
        .then(busyAuditoriums => {
            const auditoriumNumbers = convertJsonToArray(busyAuditoriums);
            console.log(auditoriumNumbers);

            $(".auditorium").each(function() {
                const auditoriumId = $(this).attr("id");

                if (auditoriumNumbers.includes(auditoriumId)) {
                    $(this).find(".auditorium-polygon").attr("fill", "red");
                } else {
                    $(this).find(".auditorium-polygon").attr("fill", "green");
                }
            });
        })
        .catch(error => {
            console.error('Error while getting data from the database:', error);
        });
}

checkAndColorAuditoriums();

$(document).ready(function() {
    setInterval(checkAndColorAuditoriums, 60000);
});






$(document).ready(function () {
    $('.auditorium').click(function () {
        const text = $(this).find('.auditorium-polygon').attr('description-date');
        const objectDescription = $(".description");
        objectDescription.html(text);
        //objectDescription.css('left', `${(100 * arguments.x / originalWidth)  - 2}%`);
        //objectDescription.css('top', `${(480 * arguments.y / originalHeight)  - 60}%`);
    });
});

