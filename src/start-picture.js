
const findPairButton = document.querySelector('.button-close');
findPairButton.addEventListener('click', () => {
    document.location.replace('index-main.html');
});

document.addEventListener('DOMContentLoaded', function() {
    const screenWidth = document.body.clientWidth;
    const auditoriumPolygons = document.querySelectorAll('img');


    auditoriumPolygons.forEach(function (element) {
        element.style.width = `${screenWidth * 0.25}px`;
        element.style.height = `auto`;
    });

});

window.addEventListener('resize', function(event) {
    const screenWidth = document.body.clientWidth;
    const auditoriumPolygons = document.querySelectorAll('img');


    auditoriumPolygons.forEach(function (element) {
        element.style.width = `${screenWidth * 0.25}px`;
        element.style.height = `auto`;
    });
});

