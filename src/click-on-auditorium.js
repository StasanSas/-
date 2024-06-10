
document.addEventListener('DOMContentLoaded', function() {
    const auditoriumPolygons = document.querySelectorAll('.auditorium-polygon');
    const auditoriumTexts = document.querySelectorAll('.auditorium-text');

    auditoriumPolygons.forEach(function (element) {
        element.addEventListener('click', function () {
            let auditoriumElement= this.parentNode;
            updateAuditoriumOnClick(auditoriumElement)
            // Добавьте свою логику обработки клика здесь
        });
    });

    auditoriumTexts.forEach(function (element) {
        element.addEventListener('click', function () {
            let auditoriumElement = this.parentNode;
            updateAuditoriumOnClick(auditoriumElement)
        });
    });
});

function updateAuditoriumOnClick(auditoriumElement) {
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
}

document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(event) {
        let targetElement = event.target;
        let isClickInsideElement = false;

        while (targetElement) {
            if (targetElement.classList.contains('auditorium-polygon') || targetElement.classList.contains('auditorium-text') ||
                targetElement.classList.contains('table-ordinary') || targetElement.classList.contains('table-ordinary1') ||
                targetElement.classList.contains('table-special')) {
                isClickInsideElement = true;
                break;
            }
            targetElement = targetElement.parentElement;
        }

        if (!isClickInsideElement) {
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

