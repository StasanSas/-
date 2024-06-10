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

    for (let i = 0; i < datalist.options.length; i++) {
        if (datalist.options[i].value.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) {
            groupInput.value = datalist.options[i].value;
            break;
        }
    }
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