const PREFIXES = ["МЕН", "МЕНМ", "УГИ", "УГИМ", "НМТМ", "Ино"];
const popup = document.getElementById('popup');
const overlay = document.createElement('div');
const groupInput = document.getElementById('groupInput');
const datalist = document.getElementById('groupsList');
let tableWindow, auditoriumSVG;

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


function showAuditorium(auditorium) {
    if (auditorium.startsWith('6')) {
        selectFloor.value = '6';
    } else {
        selectFloor.value = '5';
    }

    changeFloor();

    auditoriumSVG = document.getElementById(auditorium);
    auditoriumSVG.classList.add('flashing-border');

    auditoriumSVG.scrollIntoView({ behavior: 'smooth', block: 'center' });
}


function clearTableWindow() {
    if (tableWindow) {
        popup.removeChild(tableWindow);
        tableWindow = undefined;
    }
}


document.getElementById('apply-button').addEventListener('click', () => {
    const group = groupInput.value;

    if (group === '' || !Array.from(datalist.options).map(option => option.value).includes(group)) {
        alert('Пожалуйста, введите группу правильно!');
        return;
    }

    clearTableWindow();

    tableWindow = document.createElement('table');
    tableWindow.classList.add('table-window');
    tableWindow.style.marginTop = '30px';

    addClickableRow(tableWindow, 'Аудитория', {
        "lesson": 'Дисциплина',
        "teacherName": 'Преподаватель'
    });

    let found = false;
    Object.entries(request).forEach(([auditorium, info]) => {
        if (info["groupName"].includes(group)) {
            found = true;
            addClickableRow(tableWindow, auditorium, info);
        }
    });

    if (!found) {
        addRow(tableWindow, 'У Вашей группы сейчас нет пар!');
    } else {
        tableWindow.addEventListener('click', (event) => {
            if (event.target.parentNode && event.target.parentNode.children[0]) {
                const auditoriumClicked = event.target.parentNode.children[0].textContent;
                closePopup();
                showAuditorium(auditoriumClicked);
            }
        });
    }

    popup.appendChild(tableWindow);
});


document.addEventListener('DOMContentLoaded', function() {
    const resetButton = document.getElementById('reset-button');
    const groupInput = document.getElementById('groupInput');

    resetButton.addEventListener('click', function() {
        groupInput.value = '';
    });
});


function clearAnimation() {
    if (auditoriumSVG) {
        auditoriumSVG.classList.remove('flashing-border');
        auditoriumSVG = undefined;
    }
}