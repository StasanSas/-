const SPECIAL = new Set([
    "515а", "501", "512", "520", "522", "524а", "524", "530", "534", "538", "540",
    "631", "617", "615", "613", "609", "607", "618", "620", "624", "626", "630", "632а", "634", "636", "638", "640"
]);


const date = new Date(2024, 4, 27);
const day = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
const number = ConvertToPeriod(date.getHours(), date.getMinutes())
checkAndColorAuditoriums(day, number);
document.querySelector(`#pairNumber option[value=\'${number}\']`).selected = true;

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

$(document).ready(function () {
    window.timerId = setInterval(checkAndColorAuditoriums, 60000);
});

window.addEventListener('scroll', updateTables);





