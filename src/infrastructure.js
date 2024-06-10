
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

function fillTable(table, data) {
    for (let i = 0; i < data.length; i++) {
        let row = table.insertRow();
        for (let j = 0; j < data[i].length; j++) {
            let cell = row.insertCell();
            cell.textContent = data[i][j];
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