class requestJsonData {
    constructor(filterOption = {}) {
        this.filter = Object.assign({
            year: "",
            min_year: "",
            max_year: "",
            imdb_score: "",
            imdb_score_min: "",
            imdb_score_max: "",
            title: "",
            title_contains: "",
            genre: "",
            genre_contains: "",
            sort_by: "",
            director: "",
            director_contains: "",
            writer: "",
            writer_contains: "",
            actor: "",
            actor_contains: "",
            country: "",
            country_contains: "",
            lang: "",
            lang_contains: "",
            company: "",
            company_contains: "",
            rating: "",
            rating_contains: "",
        }, filterOption)

        this.rootApi = "http://localhost:8000/api/v1/titles/"
        this.buildRequest()
    }

    buildRequest() {
        this.filterString = "?format=json"
        for (const [key, value] of Object.entries(this.filter)) {
            if (value === "") { continue }
            this.filterString += "&" + key + "=" + value
        }
    }

    orderBy(champ = "", reverse = false) {
        if (reverse === true) {
            champ = "-" + champ
        }
        this.filter.sort_by = champ
        this.buildRequest()
    }

    async fetchData(nb_results = 5) {
        let tmpData = await fetchUrl(this.rootApi + this.filterString)
        let data = tmpData
        let maxItem = tmpData.count
        while ((data.results.length < nb_results) && (data.results.length < maxItem)) {
            tmpData = await fetchUrl(tmpData.next)
            data.next = tmpData.next
            tmpData.results.forEach(value => data.results.push(value))
        }
        return data
    }
}

class requestDataFromUrl {
    constructor(url) {
        this.url = url
    }

    async fetch() {
        let response = await fetch(this.url)
        let data = await response.json()
        return data
    }

    async fetchData(nb_results = 5) {
        let data = await this.fetch()
        let maxItem = data.count
        while ((data.results.length < nb_results) && (data.results.length < maxItem)) {
            let tmpData = await this.fetch(tmpData.next)
            data.next = tmpData.next
            tmpData.results.forEach(value => data.results.push(value))
        }
        return data
    }
}

/**
 * revoie une liste contenant l'ensemble des films ayant le meilleur score imdb dans la categorie specifie
 * @Param {string} genre selection des film avec le meilleur score selon imdb filtre par genres
 * @return {list} liste des films avec le meilleur score imdb  
 */
async function getTopImdbScore(genre = "") {
    let request = new requestJsonData({
        genre: genre,
        sort_by: "-imdb_score"
    })
    let tmpData = await request.fetchData()

    let data = []
    let bestScore = tmpData.results[0]["imdb_score"]

    let topRankedFilmCollected = false
    while (topRankedFilmCollected === false) {
        let nextPageUrl = tmpData.next
        tmpData.results.forEach(element => data.push(element))

        if (tmpData.results[tmpData.results.length - 1]["imdb_score"] === bestScore) {
            let nextPageRequest = new requestDataFromUrl(nextPageUrl)
            tmpData = await nextPageRequest.fetch()
        } else {
            topRankedFilmCollected = true
        }
    }

    for (var i = data.length - 1; i > 0; i--) {
        if (data[i]["imdb_score"] !== bestScore) {
            delete data[i]
        }
    }

    return data
}

/**
    * renvoie le meilleur film selon imdb et le publique
    * @param {string} genre meilleur film selon par catégorie
    * @return {object} fiche du meilleur film
    */
async function getBestToAllMovie(genre = "") {
    let topImdbScore = getTopImdbScore(genre)

    topImdbScore.then((response) => {
        console.log("get best movie")

        response.forEach((element, index) => {
            console.log(index)
            console.log(element)
            let elementDetailedPageRequest = new requestDataFromUrl(element["url"])
            console.log("boucle forEach")
            let test = []
            elementDetailedPageRequest.fetch().then((info) => test[index] = info)
        })
        console.log("sortie get best movie")
        response.sort((a, b) => a["avg_vote"] - b["avg_vote"])
        console.log(response)
        return response
    })
}
// async function getBestToAllMovie(genre = "") {
//     let topImdbScore = await getTopImdbScore(genre)
//     console.log(topImdbScore)
//     /*var test = replaceBasicByDetailledFilmInfo(topImdbScore)
// */
//     var test = []
//     topImdbScore.forEach(async (element, index) => {
//         console.log(element.url)
//         let elementDetailedPageRequest = new requestDataFromUrl(element.url)
//         test[index] = await elementDetailedPageRequest.fetch()
//     })
//     test.sort((a, b) => a.avg_vote - b.avg_vote)
//     console.log(test)
//     console.log('test0 : ' + test[0])
//     return test
// }

getBestToAllMovie().then((bestMovie) => {
    console.log("best movie")
    console.log(bestMovie)
    let bestMovieRequest = new requestDataFromUrl(bestMovie.url)
    let bestMovieData = bestMovieRequest.fetch()
    console.log(bestMovieData)
    bestMovieData.then((response) => {
        console.log(response)
    })
})

/**
    * @param {array} inputList
    * @return {array}
    */
async function replaceBasicByDetailledFilmInfo(inputList) {
    inputList.forEach(async (element, index) => {
        let elementDetailedPageRequest = new requestDataFromUrl(element.url)
        inputList[index] = await elementDetailedPageRequest.fetch()
    })
    return inputList
}

/**
    * importe des données de test depuis moch_data
    * @returns 
    */
async function fetchMochData() {
    let response = await fetch("./mock_data.json")
    let data = await response.json()
    return data
}

/**
    * @param {URL} url adresse de la requete
    * @return {data}
    */
async function fetchUrl(url) {
    let response = await fetch(url)
    let data = await response.json()
    return data
}

function close_modal(id_modal) {
    var modal = document.getElementById(id_modal)
    var modal_container = modal.querySelector(".modal_container")
    // retire les éléments de l'ancienne fenêtre modal
    while (modal_container.firstChild) {
        modal_container.removeChild(modal_container.firstChild);
    }
    // passe la fenêtre en masqué
    modal.classList.toggle("active")
}
/**
    * 
    * @param {string} str_date date au format YYYY-MM-DD
    * @returns {string} date au format DD/MM/YYYY
    */
async function formatDate(input_date) {
    const year = input_date.split("-")[0]
    const month = input_date.split("-")[1]
    const day = input_date.split("-")[2]
    const d = new Date(year, month, day)

    const str_date = ('0' + d.getDate()).slice(-2)
    const str_month = ('0' + (d.getMonth() + 1)).slice(-2)
    const str_year = d.getFullYear()
    const output_date = `${str_date}/${str_month}/${str_year}`
    return output_date
}

// récupération de la fenêtre modal
var modal = document.getElementById("filmSheet");

// ferme la fenetre quand l'utilisateur clique partout ailleurs
window.addEventListener("click", function (event) {
    if (event.target == modal) {
        close_modal("filmSheet")
        //modal.classList.toggle("active")
        // console.log("modal close")
    }
})

/**
    * Best Movie 
    */
// let bestMovieData = getBestToAllMovie().then(response => {
//     let bestMovieElement = document.getElementById("featured-movie")
//     // console.log(response)
//     bestMovieElement.querySelector(".title").innerHTML = response.title
//     bestMovieElement.querySelector("img").src = response.image_url
//     bestMovieElement.querySelector(".long_description").innerHTML = response.long_description
// })
