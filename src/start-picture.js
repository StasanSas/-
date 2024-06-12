const info = [
    ['pictures/KurshevAlexey.jpg', 'Куршев Алексей'],
    ['pictures/TurmukhambetovAmir.jpg', 'Турмухамбетов Амир'],
    ['pictures/GabovAnton.jpg', 'Габов Антон'],
    ['pictures/IvanovStanislav.jpg', 'Иванов Станислав']
];

const picturesContainer = document.getElementById('pictures');

info.forEach((image, index) => {
    const container = document.createElement('div');
    container.classList.add('person');

    const img = document.createElement('img');
    img.src = image[0];
    img.alt = image[1];
    img.classList.add('fadeIn');
    container.appendChild(img);

    const name = document.createElement('p');
    name.textContent = image[1];
    name.classList.add('fadeIn');
    container.appendChild(name);

    picturesContainer.appendChild(container);
});

const button = document.getElementById('linkButton');

if (localStorage.getItem('lastVisitedPage')) {
    location.href = localStorage.getItem('lastVisitedPage');
}

button.addEventListener('click', function() {
    window.location.href = this.querySelector('a').getAttribute('href');
    localStorage.setItem('lastVisitedPage', 'index-main.html');
});


