const SPECIAL = new Set([
    "515а", "501", "512", "520", "522", "524а", "524", "530", "534", "538", "540",
    "631", "617", "615", "613", "609", "607", "618", "620", "624", "626", "630", "632а", "634", "636", "638", "640"
]);
let request;


function checkAndColorAuditoriums(dateX, pairNumber) {
    request = {};

    getDataFromDatabase(dateX, pairNumber)
        .then(jsonInfo => {
            const busyAuditoriums = [];

            for (let info of jsonInfo) {
                busyAuditoriums.push(info["auditory"]);
                if (request.hasOwnProperty(info["auditory"])) {
                    request[info["auditory"]]["groupName"].push(info["groupName"].replaceAll('_', ' '));
                } else {
                    request[info["auditory"]] = {
                        "lesson": info["lesson"],
                        "groupName": [info["groupName"].replaceAll('_', ' ')],
                        "teacherName": info["teacherName"]
                    };
                }
            }

            const auditoriums = document.querySelectorAll('.auditorium');

            auditoriums.forEach(auditorium => {
                const auditoriumId = auditorium.getAttribute('id');

                if (busyAuditoriums.includes(auditoriumId)) {
                    auditorium.querySelector('.auditorium-polygon').setAttribute('fill', 'red');
                } else {
                    if (SPECIAL.has(auditoriumId)) {
                        auditorium.querySelector('.auditorium-polygon').setAttribute('fill', 'darkkhaki');
                    } else {
                        auditorium.querySelector('.auditorium-polygon').setAttribute('fill', 'green');
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error while getting data from the database:', error);
        });
}