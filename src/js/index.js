const api = 'http://127.0.0.1:8000/api/v1/';
const movies = api + 'titles/';
const bestMovies = '?sort_by=-imdb_score,-votes'
const category = '&genre=';
const category1 = category + 'Sport';
const category2 = category + 'Action';
const category3 = category + 'Animation';
const numberOfData = '&page_size='

// Get sections from the DOM
const app = document.querySelector('#app');
const featuredMovie = document.querySelector('#featured-movie');
const topRatedMovies = document.querySelector('#top-rated-movies');
const categorySection1 = document.querySelector('#category__1');
const categorySection2 = document.querySelector('#category__2');
const categorySection3 = document.querySelector('#category__3');


/**
 * Get limited data from URL.
 * @param {String} url URL from OCMovies-API
 * @param {Number} limit Limit number of retrieved data
 * @return {Array}
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
 * Create the first section of the page
 * with the featured movie from the API
 * @param {HTMLElement} parentElt The section that will contain movie info
 * @param {String} url The API URL that gives the featured movie
 */
function createHero(parentElt, url) {
    getJSON(url + numberOfData + 1)
    .then((json) => {
        const data = json.results[0];
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
            defineBg(elt, result.image_url);
            parentElt.appendChild(elt);
        }
    })
    .catch(error => console.log('Error: \n' + error));
}

createHero(featuredMovie, movies + bestMovies);
createSlider(topRatedMovies, 'Films les mieux notés', movies + bestMovies + numberOfData + 7);
createSlider(categorySection1, 'Sport', movies + bestMovies + category1 + numberOfData + 7);
createSlider(categorySection2, 'Action', movies + bestMovies + category2 + numberOfData + 7);
createSlider(categorySection3, 'Animation', movies + bestMovies + category3 + numberOfData + 7);
