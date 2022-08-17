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
