# OCMovies-APP

## Description

This web site retrieves information from the API in order to display it on the web page.

The expectations are to display best movie information in a Hero section and a 7 images slider in 4 sections.
All images display pop-up with full movie information when clicked.

The site could match with the following [mockup](https://user.oc-static.com/upload/2020/09/08/15995700268489_image1.png):
<figure><img src="https://user.oc-static.com/upload/2020/09/08/15995700268489_image1.png" alt="Trulli"><figcaption align="center">Mockup</figcaption></figure>

## Run the API

This project use the local API cloned by the following command :
`git clone https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR.git`

This project use the local API cloned by the following command :
`git clone https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR.git`

In the API root folder, run: 
1. Install project dependencies with `pipenv install` 
2. Create and populate project database with `pipenv run python manage.py create_db`
3. Run the server with `pipenv run python manage.py runserver`

The base API URL is [http://localhost:8000/](http://localhost:8000/) and the data is accessible at [http://localhost:8000/api/v1/titles](http://localhost:8000/api/v1/genres) for movies and [http://localhost:8000/api/v1/titles](http://localhost:8000/api/v1/genres) for genres.

Now you can open the [index.html](./index.html) in your favorite browser

For subsequent launchesof the API, run:
1. `pipenv shell` to activate environnement
2. `pipenv run python manage.py runserver` to start Django server

## W3C validation

The index.html file has no Errors.
It has 5 Warnings because there is no heading inside sections.
