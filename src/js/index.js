const api = 'http://127.0.0.1:8000/api/v1/';
const movies = api + 'titles/';
const bestMovies = '?sort_by=-imdb_score,-votes'
const category = '&genre=';
const numberOfData = '&page_size=';

// Get sections from the DOM
const app = document.querySelector('#app');
const featuredMovie = document.querySelector('#featured-movie');
const topRatedMovies = document.querySelector('#top-rated-movies');
const categorySections = document.querySelectorAll('.category');


/**
 * Get limited data from URL.
 * @param {String} url URL from OCMovies-API
 * @param {Number} limit Limit number of retrieved data
 * @return {JSON} JSON Object movie(s)
 */
 async function getJSON(url) {
    const response = await fetch(url);
    // Control the response from server is between 200-299
    if (response.ok) {
        const json = await response.json();
        return json;
    }
}

// Define DOM element's background
function defineBg(elt, bgUrl) {
    elt.style.backgroundImage = `url(${bgUrl})`
}

/**
 * Insert information of the movie inside the Hero section
 * @param {HTMLElement} parentElt The section that will contain movie info
 * @param {object} object Movie Title Detail object
 */
function createHeroContent(parentElt, object) {
    const title = document.createElement('h1');
    title.textContent = object.title;
    const button = document.createElement('button');
    button.textContent = 'En savoir plus';
    const description = document.createElement('p');
    description.textContent = object.description;
    const column = document.createElement('div');
    column.classList.add('info');
    column.appendChild(title);
    column.appendChild(button);
    column.appendChild(description);
    parentElt.appendChild(column);
}

/**
 * Create the first section of the page
 * with the featured movie from the API
 * @param {HTMLElement} parentElt The section that will contain movie info
 * @param {String} url The API URL that gives the featured movie
 */
function createHero(parentElt, url) {
    getJSON(url + numberOfData + 1)
    .then((json) => {
        const data = json.results[0];
        // Get data from movie URL
        getJSON(data.url)
        .then((movie) => {
            createHeroContent(parentElt, movie);
        });
        defineBg(parentElt, data.image_url);
    })
    .catch(error => console.log('Error: \n' + error));
}

/**
 * Create a slider inside an element
 * @param {HTMLElement} parentElt The section that will contain the slider
 * @param {String} url The API URL that gives the movies
 * @param {Number} numberOfSlides Define how many slides in the slider
 */
function createSlider(parentElt, title, url, numberOfSlides) {
    getJSON(url, numberOfSlides)
    .then((json) => {
        let h2 = document.createElement('h2');
        h2.textContent = title;
        app.insertBefore(h2, parentElt);
        for (let result of json.results) {
            let elt = document.createElement('div');
            elt.classList.add('slide');
            defineBg(elt, result.image_url);
            parentElt.appendChild(elt);
        }
    })
    .catch(error => console.log('Error: \n' + error));
}

createHero(featuredMovie, movies + bestMovies);
createSlider(topRatedMovies, 'Films les mieux notés', movies + bestMovies + numberOfData + 7);
for (slider of categorySections) {
    createSlider(
        slider,
        slider.id,
        movies + bestMovies + category + slider.id + numberOfData + 7);
}
