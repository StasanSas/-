let tableEquipment, tableDiscipline, spacingElement, flag;


function updateTables() {
    if (window.innerWidth > window.innerHeight) {
        return;
    }

    const xPosition = window.scrollX + 5;

    if (tableEquipment) {
        tableEquipment.style.position = 'absolute';
        tableEquipment.style.left = `${xPosition}px`;
    }

    if (tableDiscipline) {
        tableDiscipline.style.position = 'absolute';
        tableDiscipline.style.left = `${xPosition}px`;
    }
}


function getHeight() {
    let floorNow;
    if (document.getElementById('floor').value === '5') {
        floorNow = document.getElementById('5picture').height;
    } else {
        floorNow = document.getElementById('6picture').height;
    }

    return floorNow;
}


function changeSpace(floorNow) {
    if (window.innerWidth > window.innerHeight) {
        spacingElement.style.height = `${floorNow + 25}px`;
    } else {
        spacingElement.style.height = `${floorNow + (flag ? 350 : 310)}px`;
    }
}


function deletePrevious(container) {
    if (tableDiscipline !== null && tableDiscipline !== undefined) {
        container.removeChild(tableDiscipline);
    }

    if (tableEquipment !== null && tableEquipment !== undefined) {
        container.removeChild(tableEquipment);
        container.removeChild(spacingElement);
    }
}


document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.auditorium-polygon, .auditorium-text').forEach(function(element) {
        element.addEventListener('click', function() {
            clearAnimation();

            let auditoriumElement = this.parentNode;
            let container = document.getElementById('footer');

            deletePrevious(container);

            let data = [];
            const metadata = auditoriumElement.querySelector('metadata');
            tableEquipment = document.createElement('table');

            if (SPECIAL.has(auditoriumElement.id)) {
                const type = metadata.querySelector('type').textContent.trim();
                const description = metadata.querySelector('description').textContent.trim();

                tableEquipment.classList.add('table-special');

                data = [
                    [type],
                    [description]
                ];
            } else {
                const descriptionSocket = metadata.querySelector('description-socket').textContent.trim();
                const descriptionProjector = metadata.querySelector('description-projector').textContent.trim();
                const descriptionBlackboard = metadata.querySelector('description-blackboard').textContent.trim();

                tableEquipment.classList.add('table-ordinary');

                data = [
                    ['Розетки', 'Проектор', 'Доска'],
                    [descriptionSocket, descriptionProjector, descriptionBlackboard]
                ];
            }

            fillTable(tableEquipment, data);

            spacingElement = document.createElement('div');
            flag = SPECIAL.has(auditoriumElement.id) || !request.hasOwnProperty(auditoriumElement.id);
            changeSpace(getHeight());

            container.appendChild(spacingElement);
            container.appendChild(tableEquipment);

            if (flag) {
                tableDiscipline = undefined;
            } else {
                tableDiscipline = document.createElement('table');
                tableDiscipline.classList.add('table-ordinary1');
                const info = request[auditoriumElement.id];

                const data1 = [
                    ['Дисциплина', 'Группа', 'Преподаватель'],
                    [info['lesson'], info['groupName'].join(', '), info['teacherName'] || '-']
                ];

                fillTable(tableDiscipline, data1);

                tableDiscipline.style.top = `${tableEquipment.getBoundingClientRect().bottom + 20}px`;

                container.appendChild(tableDiscipline);
            }

            updateTables();
        });
    });
});


document.addEventListener('click', function(event) {
    if (!event.target.closest('.auditorium-polygon, .auditorium-text, .table-ordinary, .table-ordinary1, .table-special')) {
        if (tableEquipment) {
            let container = document.getElementById('footer');
            if (tableDiscipline) {
                container.removeChild(tableDiscipline);
            }
            container.removeChild(tableEquipment);
            container.removeChild(spacingElement);
            tableDiscipline = undefined;
            tableEquipment = undefined;
            spacingElement = undefined;
        }
    }
});


window.addEventListener('scroll', updateTables);

window.addEventListener('resize', function() {
    let floorNow = getHeight();

    if (!spacingElement) {
        return;
    }

    changeSpace(floorNow);

    if (tableDiscipline) {
        tableDiscipline.style.top = `${tableEquipment.getBoundingClientRect().bottom + 20}px`;
    }
});