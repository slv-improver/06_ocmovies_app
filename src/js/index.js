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
const popup = document.querySelector('#popup');
const exit = document.querySelector('#close-popup');
const movieInfoDiv = document.querySelector('#info');
const movieInfoList = [
    'genres',
    'date_published',
    'rated',
    'imdb_score',
    'directors',
    'actors',
    'duration',
    'countries',
    'worldwide_gross_income',
    'long_description'
]


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

/**
 * Callback.
 * Make the popup visible and display infos in their place
 * @param {Object} movieInfo Information on the film that has been clicked
 */
function displayPopup(movieInfo) {
    document.body.style.overflow = 'hidden';
    popup.style.zIndex = 1;
    movieInfoDiv.style.height = '80vh';
    document.querySelector('#popup-title').textContent = movieInfo.title;
    document.querySelector('img[alt="Movie poster"]').src = movieInfo.image_url;
    for (info of movieInfoList) {
        if (movieInfo[info] == null || movieInfo[info] == 'Not rated or unkown rating') {
            movieInfo[info] = 'Non connu';
        }
        if (info != 'actors') {
            document.querySelector(`#${info}`).textContent = movieInfo[info];
        } else {
            let actorsUl = document.querySelector(`#${info}`);
            //  Loop on actors and create <li> for each one
            for (actor of movieInfo[info]) {
                let li = document.createElement('li');
                li.textContent = actor;
                actorsUl.appendChild(li);
            }
        }
    }
}

/**
 * Callback.
 * Make the popup invisble
 * @param {object} event The element of the DOM the user clicked on
 */
function closePopup(event) {
    event.stopPropagation();
    if (event.target == event.currentTarget) {
        document.body.style.overflow = 'scroll';
        setTimeout(() => {
            popup.style.zIndex = -10;
        }, 2000);
        movieInfoDiv.style.height = '0vh';
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
            parentElt.addEventListener('click', () => {
                displayPopup(movie);
            });
        });
        defineBg(parentElt, data.image_url);
    })
    .catch(error => console.log('Error: \n' + error));
}

function slideLeft(slider) {
    slider.appendChild(slider.firstChild);
}

function slideRight(slider) {
    slider.insertBefore(slider.lastChild, slider.firstChild);
}

/**
 * Create a slider inside an element.
 * Add popup on all slides.
 * @param {HTMLElement} parentElt The section that will contain the slider
 * @param {String} url The API URL that gives the movies
 */
function createSlider(parentElt, title, url) {
    getJSON(url)
    .then((json) => {
        let slideHeight = ''
        let h2 = document.createElement('h2');
        h2.textContent = title;
        app.insertBefore(h2, parentElt);
        let slider = parentElt.querySelector('.slider');
        for (let result of json.results) {
            let elt = document.createElement('div');
            elt.classList.add('slide');
            elt.classList.add('overlay');
            defineBg(elt, result.image_url);
            elt.addEventListener('click', () => {
                getJSON(result.url)
                .then((movie) => {
                    displayPopup(movie);
                })
            })
            slider.appendChild(elt);
            slideHeight = `${elt.clientWidth*1.46}px`;
            elt.style.height = slideHeight;
        }
        let leftArrow = parentElt.querySelector('.toleft');
        leftArrow.addEventListener('click', () => slideLeft(slider));
        let rightArrow = parentElt.querySelector('.toright');
        rightArrow.addEventListener('click', () => slideRight(slider));
        slider.style.height = slideHeight;
        parentElt.style.height = slideHeight;
    })
    .catch(error => console.log('Error: \n' + error));
}

createHero(featuredMovie, movies + bestMovies);
createSlider(topRatedMovies, 'Films les mieux notés', movies + bestMovies + numberOfData + 7);
for (section of categorySections) {
    createSlider(
        section,
        section.id,
        movies + bestMovies + category + section.id + numberOfData + 7);
}
popup.addEventListener('click', closePopup);
exit.addEventListener('click', closePopup);
