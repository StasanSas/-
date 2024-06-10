

function getDataFromDatabase(date, pairNumber) {
    const url = `http://localhost:8091/date/${date}/pair/${pairNumber}`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Received data:', data);
            return data;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function checkAndColorAuditoriums(dateX, pairNumber) {
    globalThis.request = {};

    getDataFromDatabase(dateX, pairNumber)
        .then(jsonInfo => {
            const busyAuditoriums = [];

            for (let info of jsonInfo) {
                busyAuditoriums.push(info["auditory"]);
                if (globalThis.request.hasOwnProperty(info["auditory"])) {
                    globalThis.request[info["auditory"]]["groupName"].push(info["groupName"].replaceAll('_', ' '));
                } else {
                    globalThis.request[info["auditory"]] = {
                        "lesson": info["lesson"],
                        "groupName": [info["groupName"].replaceAll('_', ' ')],
                        "teacherName": info["teacherName"]
                    };
                }
            }

            const auditoriumElements = document.querySelectorAll(".auditorium");

            auditoriumElements.forEach(function(auditoriumElement) {
                const auditoriumId = auditoriumElement.getAttribute("id");

                if (busyAuditoriums.includes(auditoriumId)) {
                    auditoriumElement.querySelector(".auditorium-polygon").setAttribute("fill", "red");
                } else {
                    if (SPECIAL.has(auditoriumId)) {
                        auditoriumElement.querySelector(".auditorium-polygon").setAttribute("fill", "darkkhaki");
                    } else {
                        auditoriumElement.querySelector(".auditorium-polygon").setAttribute("fill", "green");
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error while getting data from the database:', error);
        });
}