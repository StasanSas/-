$('.auditorium-polygon').hover(
    function () {
        $('.desc').html($(this).attr("description-date"));
    },
    function () {
        $('.desc').html("Ящеры");
    }
)

$('.auditorium-polygon').click(
    function () {
        $('.desc').html("Текст");
    }
)

function getDataFromDatabase(date, pairNumber) {
    const url = `http://localhost:8091/date/${date}/pair/${pairNumber}`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Received data:', data);
            return data;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function ConvertToWeekday(day) {
    switch (day) {
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

function checkAndColorAuditoriums(dateX = "2024-04-26", pairNumber = 1) {
    const date = new Date();
    const day = ConvertToWeekday(date.getDay());
    const number = ConvertToPeriod(date.getHours(), date.getMinutes())

    getDataFromDatabase(dateX, pairNumber)
        .then(jsonInfo => {
            const busyAuditoriums = [];

            for (let info of jsonInfo) {
                busyAuditoriums.push(info["auditory"]);
            }

            $(".auditorium").each(function () {
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

$(document).ready(function () {
    window.timerId = setInterval(checkAndColorAuditoriums, 60000);
});

$(document).ready(function () {
    $('.auditorium').click(function () {
        const text = $(this).find('.auditorium-polygon').attr('description-date');
        const message = document.createElement("div");
        message.classList.add('my-class');
        message.textContent = text;
        message.style.position = "absolute";
        message.style.top = `${(this).getBoundingClientRect().top - 50}px`;
        message.style.left = `${(this).getBoundingClientRect().left}px`;
        message.style.background = "rgba(0, 0, 0, 0.5)";
        message.style.color = "white";
        message.style.padding = "10px";
        message.style.zIndex = "1000";

        const element = document.querySelector('.my-class');
        if (element !== undefined && element !== null){
            element.remove();
        }
        document.body.appendChild(message);
    });
    
});

$(document).click(function(event) {
    if (!$(event.target).closest('.auditorium').length) {
        const element = document.querySelector('.my-class');
        if (element !== undefined && element !== null){
            element.remove();
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const admitButton = document.querySelector('.admit');

    admitButton.addEventListener('click', function () {
        const selectedWeekday = document.querySelector('.select-weekday').value;
        const selectedPairNumber = document.querySelector('.select-pairNumber').value;
        const selectedFloor = document.querySelector('.select-floor').value;

        clearInterval(window.timerId);
        checkAndColorAuditoriums("2024-04-25", 6);
    });
});

document.getElementById("floor").addEventListener("change", function () {
    const selectedMap = this.value;
    const elementsMap = document.querySelectorAll(".scheme");

    for (let elementMap of elementsMap) {
        elementMap.style.display = 'none';
        elementMap.style.position = "absolute";
        if (selectedMap === elementMap.id) {
            elementMap.style.display = 'block';
            elementMap.style.position = "absolute";
        }
    }
});



