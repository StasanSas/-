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
    img.classList.add('fadeIn');
    img.style.animationDelay = `0.5s`;
    container.appendChild(img);

    const name = document.createElement('p');
    name.textContent = image[1];
    name.classList.add('fadeIn');
    name.style.animationDelay = `0.5s`;
    container.appendChild(name);

    picturesContainer.appendChild(container);
});

const button = document.getElementById('linkButton');

button.addEventListener('click', function() {
    window.location.href = this.querySelector('a').getAttribute('href');
});