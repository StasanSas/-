const selectFloor = document.getElementById("floor");


document.addEventListener('DOMContentLoaded', function () {
    const selectWeekday = document.querySelector('.select-date');
    const selectPairNumber = document.querySelector('.select-pairNumber');

    selectWeekday.addEventListener('change', function () {
        clearAnimation();
        clearTableWindow();

        const selectedWeekday = document.querySelector('.select-date').value;
        const selectedPairNumber = document.querySelector('.select-pairNumber').value;
        clearInterval(window.timerId);
        checkAndColorAuditoriums(selectedWeekday, selectedPairNumber);
    });

    selectPairNumber.addEventListener('change', function () {
        clearAnimation();
        clearTableWindow();

        const selectedWeekday = document.querySelector('.select-date').value;
        const selectedPairNumber = document.querySelector('.select-pairNumber').value;
        clearInterval(window.timerId);
        checkAndColorAuditoriums(selectedWeekday, selectedPairNumber);
    });
});


function changeFloor() {
    clearAnimation();
    clearTableWindow();

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