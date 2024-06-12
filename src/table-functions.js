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