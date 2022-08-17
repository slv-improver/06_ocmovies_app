const api = 'http://127.0.0.1:8000/api/v1';
const movies = api + '/titles';
const categories = api + '/genres';
const bestMovies = '?sort_by=-imdb_score,-votes'
const numberOfData = '&page_size='

// Get sections from the DOM
const app = document.querySelector('#app');
const featuredMovie = document.querySelector('#featured-movie');
const topRatedMovies = document.querySelector('#top-rated-movies');
const category1 = document.querySelector('#category__1');
const category2 = document.querySelector('#category__2');
const category3 = document.querySelector('#category__3');


/**
 * Get limited data from URL.
 * @param {String} url URL from OCMovies-API
 * @param {Number} limit Limit number of retrieved data
 * @return {Array}
 */
 async function getJSON(url, limit) {
    const response = await fetch(url + numberOfData + limit);
    // Control the response from server is between 200-299
    if (response.ok) {
        const json = await response.json();
        return json.results;
    }
}

// Define DOM element's background
function defineBg(elt, bgUrl) {
    elt.style.backgroundImage = `url(${bgUrl})`
}
