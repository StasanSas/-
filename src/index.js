const date = new Date(2024, 4, 27);
date.setHours(9, 0, 0, 0);
const day = getHyphenatedDate(date);
const number = ConvertToPeriod(date.getHours(), date.getMinutes());
checkAndColorAuditoriums(day, number);
document.querySelector(`#pairNumber option[value=\'${number}\']`).selected = true;


document.getElementById("621").scrollIntoView({ behavior: 'smooth', block: 'center' });


function ConvertToPeriod(currentHour, currentMinute) {
    switch (true) {
        case (currentHour === 9) || (currentHour === 10 && currentMinute <= 29):
            return 1;
        case (currentHour === 10) || (currentHour === 11) || (currentHour === 12 && currentMinute <= 9):
            return 2;
        case (currentHour === 12) || (currentHour === 13) || (currentHour === 14 && currentMinute <= 19):
            return 3;
        case (currentHour === 14) || (currentHour === 15):
            return 4;
        case (currentHour === 16) || (currentHour === 17 && currentMinute <= 39):
            return 5;
        case (currentHour === 17) || (currentHour === 18) || (currentHour === 19 && currentMinute <= 19):
            return 6;
        case (currentHour === 19) || (currentHour === 20):
            return 7;
        default:
            return 7;
    }
}


function getHyphenatedDate(date) {
    return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
}










