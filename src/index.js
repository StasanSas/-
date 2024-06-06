const SPECIAL = new Set([
    "515а", "501", "512", "520", "522", "524а", "524", "530", "534", "538", "540",
    "631", "617", "615", "613", "609", "607", "618", "620", "624", "626", "630", "632а", "634", "636", "638", "640"
]);

const PREFIXES = ["МЕН", "МЕНМ", "УГИ", "УГИМ", "НМТМ", "Ино"];


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
                if (globalThis.request.hasOwnProperty(info["auditory"])) {
                    globalThis.request[info["auditory"]]["groupName"].push(info["groupName"].replaceAll('_', ' '));
                } else {
                    globalThis.request[info["auditory"]] = {
                        "lesson": info["lesson"],
                        "groupName": [info["groupName"].replaceAll('_', ' ')],
                        "teacherName": info["teacherName"]
                    };
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
                [info["lesson"], info["groupName"].join(', '), info["teacherName"] || '-']
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

function clearAnimation() {
    if (globalThis.auditoriumSVG) {
        globalThis.auditoriumSVG.classList.remove('flashing-border');
        delete globalThis.auditoriumSVG;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const select_weekday = document.querySelector('.select-date');
    const select_pairNumber = document.querySelector('.select-pairNumber');

    
    select_weekday.addEventListener('change', function () {
        clearAnimation();

        const selectedWeekday = document.querySelector('.select-date').value;
        const selectedPairNumber = document.querySelector('.select-pairNumber').value;
        clearInterval(window.timerId);
        checkAndColorAuditoriums(selectedWeekday, selectedPairNumber);
    });

    select_pairNumber.addEventListener('change', function () {
        clearAnimation();

        const selectedWeekday = document.querySelector('.select-date').value;
        const selectedPairNumber = document.querySelector('.select-pairNumber').value;
        clearInterval(window.timerId);
        checkAndColorAuditoriums(selectedWeekday, selectedPairNumber);
    });
});

const selectFloor = document.getElementById("floor");


function changeFloor() {
    clearAnimation();

    const selectedMap = selectFloor.value;
    const elementsMap = document.querySelectorAll(".scheme");

    for (let elementMap of elementsMap) {
        elementMap.style.display = 'none';
        elementMap.style.position = "absolute";
        if (selectedMap === elementMap.id) {
            elementMap.style.display = 'block';
            elementMap.style.position = "absolute";
        }
    }
}

selectFloor.addEventListener("change", changeFloor);


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


const popup = document.getElementById('popup');
const overlay = document.createElement('div');

const closePopup = () => {
    popup.style.display = 'none';
    overlay.style.display = 'none';
};

document.addEventListener('DOMContentLoaded', function() {
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);

    const findPairButton = document.querySelector('.find-pair-button');
    const popupCloseButton = document.querySelector('.popup-close');

    findPairButton.addEventListener('click', () => {
        popup.style.display = 'block';
        overlay.style.display = 'block';

        const options = document.querySelectorAll('#groupsList option');

        options.forEach(function(option) {
            option.hidden = false;
        });
    });

    popupCloseButton.addEventListener('click', closePopup);
    overlay.addEventListener('click', closePopup);
});

const groupInput = document.getElementById('groupInput');
const datalist = document.getElementById('groupsList');

groupInput.addEventListener('input', function() {
    const input = this.value;
    const options = document.querySelectorAll('#groupsList option');

    options.forEach(function(option) {
        option.hidden = option.value.toLowerCase().indexOf(input.toLowerCase()) === -1;
    });
});


groupInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        findBestFit();
    }
});

function findBestFit() {
    const inputValue = groupInput.value.toLowerCase();

    for (const prefix of PREFIXES) {
        if (inputValue.startsWith(prefix)) {
            return;
        }
    }

    for (let i = 0; i < datalist.options.length; i++) {
        if (datalist.options[i].value.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) {
            groupInput.value = datalist.options[i].value;
            break;
        }
    }
}


function addClickableRow(table, auditorium, info) {
    const row = document.createElement('tr');
    const auditoriumCell = document.createElement('td');
    const lessonCell = document.createElement('td');
    const teacherCell = document.createElement('td');

    if (auditorium !== 'Аудитория') {
        row.classList.add('clickable-row');
    }

    auditoriumCell.textContent = auditorium;
    lessonCell.textContent = info["lesson"];
    teacherCell.textContent = info["teacherName"] || '-';

    row.appendChild(auditoriumCell);
    row.appendChild(lessonCell);
    row.appendChild(teacherCell);

    table.appendChild(row);
}


function addRow(table, info) {
    const row = document.createElement('tr');
    const infoCell = document.createElement('td');
    infoCell.textContent = info;
    infoCell.colSpan = 3;

    row.appendChild(infoCell);
    table.appendChild(row);
}


function showAuditorium(auditorium) {
    if (auditorium.startsWith('6')) {
        selectFloor.value = '6';
    } else {
        selectFloor.value = '5';
    }

    changeFloor();

    globalThis.auditoriumSVG = document.getElementById(auditorium);
    globalThis.auditoriumSVG.classList.add('flashing-border');

    globalThis.auditoriumSVG.scrollIntoView({ behavior: 'smooth', block: 'center' });
}


document.getElementById('apply-button').addEventListener('click', () => {
    const group = groupInput.value;

    if (group === '' || !Array.from(datalist.options).map(option => option.value).includes(group)) {
        alert('Пожалуйста, введите группу правильно!');
        return;
    }

    if (globalThis.tableWindow) {
        popup.removeChild(globalThis.tableWindow);
        delete globalThis.tableWindow;
    }

    globalThis.tableWindow = document.createElement('table');
    globalThis.tableWindow.classList.add('table-window');
    globalThis.tableWindow.style.marginTop = '30px';

    addClickableRow(globalThis.tableWindow, 'Аудитория', {
        "lesson": 'Дисциплина',
        "teacherName": 'Преподаватель'
    });

    let found = false;
    Object.entries(globalThis.request).forEach(([auditorium, info]) => {
        if (info["groupName"].includes(group)) {
            found = true;
            addClickableRow(globalThis.tableWindow, auditorium, info);
        }
    });

    if (!found) {
        addRow(globalThis.tableWindow, 'У Вашей группы сейчас нет пар!');
    } else {
        globalThis.tableWindow.addEventListener('click', (event) => {
            if (event.target.parentNode && event.target.parentNode.children[0]) {
                const auditoriumClicked = event.target.parentNode.children[0].textContent;
                closePopup();
                showAuditorium(auditoriumClicked);
            }
        });
    }

    popup.appendChild(globalThis.tableWindow);
});