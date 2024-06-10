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

function clearAnimation() {
    if (globalThis.auditoriumSVG) {
        globalThis.auditoriumSVG.classList.remove('flashing-border');
        delete globalThis.auditoriumSVG;
    }
}