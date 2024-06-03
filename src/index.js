const SPECIAL = new Set([
    "515а", "501", "512", "520", "522", "524а", "524", "530", "534", "538", "540",
    "631", "617", "615", "613", "609", "607", "618", "620", "624", "626", "630", "632а", "634", "636", "638", "640"
]);


function getDataFromDatabase(date, pairNumber) {
    const url = `http://192.168.0.103:8091/date/${date}/pair/${pairNumber}`;

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
    // хз... пока так
    return 7;
}

function checkAndColorAuditoriums(dateX, pairNumber) {
    globalThis.request = {};

    getDataFromDatabase(dateX, pairNumber)
        .then(jsonInfo => {
            const busyAuditoriums = [];

            for (let info of jsonInfo) {
                busyAuditoriums.push(info["auditory"]);
                globalThis.request[info["auditory"]] = {
                    "lesson": info["lesson"],
                    "groupName": info["groupName"],
                    "teacherName": info["teacherName"]
                }
            }

            $(".auditorium").each(function () {
                const auditoriumId = $(this).attr("id");

                if (busyAuditoriums.includes(auditoriumId)) {
                    $(this).find(".auditorium-polygon").attr("fill", "red");
                } else {
                    if (SPECIAL.has(auditoriumId)) {
                        $(this).find(".auditorium-polygon").attr("fill", "darkkhaki");
                    } else {
                        $(this).find(".auditorium-polygon").attr("fill", "green");
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error while getting data from the database:', error);
        });
}

const date = new Date(2024, 4, 28);
const day = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
const number = ConvertToPeriod(date.getHours(), date.getMinutes())
checkAndColorAuditoriums(day, number);
document.querySelector(`#pairNumber option[value=\'${number}\']`).selected = true;


$(document).ready(function () {
    window.timerId = setInterval(checkAndColorAuditoriums, 60000);
});

// $(document).ready(function () {
//     $('.auditorium').click(function () {
//         const text = $(this).find('.auditorium-polygon').attr('description-date');
//         const message = document.createElement("div");
//         message.classList.add('my-class');
//         message.textContent = text;
//         message.style.position = "absolute";
//         message.style.top =  `${(this).getBoundingClientRect().top - 10 }px`;
//         console.log((this).getBoundingClientRect().top - 10)
//         console.log((this).getBoundingClientRect().left)
//         console.log((this).getBoundingClientRect().right)
//         message.style.left = `${((this).getBoundingClientRect().left + (this).getBoundingClientRect().right)/2  + window.scrollX}px`;
//         if (window.innerWidth <= window.innerHeight) {
//             message.style.fontSize = "12px";
//         }
//
//         message.style.background = "rgba(0, 0, 0, 0.8)";
//         message.style.color = "white";
//         message.style.padding = "10px";
//         message.style.zIndex = "1000";
//         message.style.borderRadius = "10px";
//         //        message.style.top =  `calc(67% - ${(this).getBoundingClientRect().left }px)`;
//         //         message.style.left = `${(this).getBoundingClientRect().top - 50}px`;
//
//         const element = document.querySelector('.my-class');
//         if (element !== undefined && element !== null){
//             element.remove();
//         }
//         document.body.appendChild(message);
//     });
//
// });

//$(document).click(function(event) {
    //if (!$(event.target).closest('.auditorium').length) {
        //const element = document.querySelector('.my-class');
        //if (element !== undefined && element !== null){
            //element.remove();
        //}
    //}
//});

function fillTable(table, data) {
    for (let i = 0; i < data.length; i++) {
        let row = table.insertRow();
        for (let j = 0; j < data[i].length; j++) {
            let cell = row.insertCell();
            cell.textContent = data[i][j];
        }
    }
}

$(document).ready(function() {
    $('.auditorium-polygon, .auditorium-text').click(function() {
        let auditoriumElement = this.parentNode;
        let container = document.getElementById("footer");

        console.log(globalThis.table1);

        if (globalThis.table1 !== null && globalThis.table1 !== undefined) {
            container.removeChild(globalThis.table1);
        }


        if (globalThis.table !== null && globalThis.table !== undefined) {
            container.removeChild(globalThis.table);
            container.removeChild(globalThis.spacingElement);
        }

        let data = [];
        const metadata = auditoriumElement.querySelector('metadata');
        globalThis.table = document.createElement('table');

        if (SPECIAL.has(auditoriumElement.id)) {
            const type = metadata.querySelector('type').textContent.trim();
            const description = metadata.querySelector('description').textContent.trim();

            globalThis.table.classList.add('table-special');

            data = [
                [type],
                [description]
            ];
        } else {
            const descriptionSocket = metadata.querySelector('description-socket').textContent.trim();
            const descriptionProjector = metadata.querySelector('description-projector').textContent.trim();
            const descriptionBlackboard = metadata.querySelector('description-blackboard').textContent.trim();

            globalThis.table.classList.add('table-ordinary');

            data = [
                ['Розетки', 'Проектор', 'Доска'],
                [descriptionSocket, descriptionProjector, descriptionBlackboard]
            ];
        }

        fillTable(globalThis.table, data);

        globalThis.spacingElement = document.createElement('div');

        let floorNow;
        if (document.getElementById('floor').value === '5') {
            floorNow = document.getElementById('5picture').height;
        } else {
            floorNow = document.getElementById('6picture').height;
        }

        const flag = SPECIAL.has(auditoriumElement.id) || !request.hasOwnProperty(auditoriumElement.id);

        if (window.innerWidth > window.innerHeight) {
            globalThis.spacingElement.style.height = `${floorNow + 25}px`;
        } else {
            globalThis.spacingElement.style.height = `${floorNow + (flag ? 350 : 310)}px`;
        }

        container.appendChild(globalThis.spacingElement);
        container.appendChild(globalThis.table);

        if (flag) {
            globalThis.table1 = undefined;
        } else {
            globalThis.table1 = document.createElement('table');
            globalThis.table1.classList.add('table-ordinary1');
            const info = globalThis.request[auditoriumElement.id];

            const data1 = [
                ['Дисциплина', 'Группа', 'Преподаватель'],
                [info["lesson"], info["groupName"], info["teacherName"] || '-']
            ];

            fillTable(globalThis.table1, data1);

            globalThis.table1.style.top = `${globalThis.table.getBoundingClientRect().bottom + 20}px`;

            container.appendChild(globalThis.table1);
        }

        updateTables();
    });

    $(document).click(function(event) {
        if (!$(event.target).closest('.auditorium-polygon, .auditorium-text, .table-ordinary, .table-ordinary1, .table-special').length) {
            if (globalThis.table) {
                let container = document.getElementById("footer");
                if (globalThis.table1) {
                    container.removeChild(globalThis.table1);
                }
                container.removeChild(globalThis.table);
                container.removeChild(globalThis.spacingElement);
                delete globalThis.table1;
                delete globalThis.table;
                delete globalThis.spacingElement;
            }
        }
    });
});

function updateTables() {
    if (window.innerWidth > window.innerHeight) {
        return;
    }

    const xPosition = window.scrollX + 5;

    if (globalThis.table) {
        globalThis.table.style.position = 'absolute';
        globalThis.table.style.left = `${xPosition}px`;
    }

    if (globalThis.table1) {
        globalThis.table1.style.position = 'absolute';
        globalThis.table1.style.left = `${xPosition}px`;
    }
}

window.addEventListener('scroll', updateTables);

document.addEventListener('DOMContentLoaded', function () {
    const select_weekday = document.querySelector('.select-date');
    const select_pairNumber = document.querySelector('.select-pairNumber');

    
    select_weekday.addEventListener('change', function () {
        const selectedWeekday = document.querySelector('.select-date').value;
        const selectedPairNumber = document.querySelector('.select-pairNumber').value;
        clearInterval(window.timerId);
        checkAndColorAuditoriums(selectedWeekday, selectedPairNumber);
    });

    select_pairNumber.addEventListener('change', function () {
        const selectedWeekday = document.querySelector('.select-date').value;
        const selectedPairNumber = document.querySelector('.select-pairNumber').value;
        clearInterval(window.timerId);
        checkAndColorAuditoriums(selectedWeekday, selectedPairNumber);
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


document.addEventListener('DOMContentLoaded', function() {
    let today = new Date(2024, 4, 28);
    document.getElementById('date').valueAsDate = today;

    let endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 6);

    let year = endDate.getFullYear();
    let month = endDate.getMonth() + 1 >= 10 ? endDate.getMonth() + 1 : '0' + (endDate.getMonth() + 1);
    let day = endDate.getDate() >= 10 ? endDate.getDate() : '0' + endDate.getDate();

    document.getElementById('date').min = today.toISOString().slice(0, 10);
    document.getElementById('date').max = year + '-' + month + '-' + day;
});