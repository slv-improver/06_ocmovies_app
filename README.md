# OCMovies-APP

## Description

This web site retrieves information from the API in order to display it on the web page.

The expectations are to display best movie information in a Hero section and a 7 images slider in 4 sections.
All images display pop-up with full movie information when clicked.

The site could match with the following [mockup](https://user.oc-static.com/upload/2020/09/08/15995700268489_image1.png)

## Run the API

This project use the local API cloned by the following command :
`git clone https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR.git`

In the API root folder, run: 
1. `pipenv shell` to activate environnement
2. `pipenv run python manage.py runserver` to start Django server

Now you can open the [index.html](./index.html) in your favorite browser

## W3C validation

The index.html file has no Errors.
It has 5 Warnings because there is no heading inside sections.