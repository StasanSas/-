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

function getDataFromDatabase(fileName, day, number) {
    return new Promise((resolve, reject) => {
        if (number === -1) {
            resolve([]);
        } else {
            $.ajax({
                url: fileName,
                dataType: 'text',
                success: function(data) {
                    const lines = data.split('\n');
                    const result = [];
                    lines.forEach((line, index) => {
                        const rowInfo = line.split(' ');
                        const weekday = rowInfo[1];
                        const period = Number(rowInfo[2]);

                        if (day === weekday && number === period) {
                            result.push(rowInfo[3]);
                        }
                    });
                    resolve(result);
                },
                error: function(xhr, status, error) {
                    console.error('Error fetching data from database:', error);
                    reject(error);
                }
            });
        }
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

function checkAndColorAuditoriums() {
    const date = new Date();
    const day = ConvertToWeekday(date.getDay());
    const number = ConvertToPeriod(date.getHours(), date.getMinutes())

    getDataFromDatabase('database.txt', day, number)
        .then(busyAuditoriums => {
            $(".auditorium").each(function() {
                const auditoriumId = $(this).attr("id");

                if (busyAuditoriums.includes(auditoriumId)) {
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

