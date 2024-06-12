function getDataFromDatabase(date, pairNumber) {
    const url = `http://192.168.0.103:8091/date/${date}/pair/${pairNumber}`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}