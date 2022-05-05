
// dicts for download resources
starwarMovies = undefined;
urlToMovies = {};
movieToStarships = {};
starshipsInfo = {};

// home page resources: get all films
fetch('https://swapi.dev/api/films/')
    .then(response => response.json())
    .then(movies => showMovies(movies.results));

// function that call showMovies with global starwarMovies variable (used for 'back' button)
function showMovies_(event) {
    showMovies(starwarMovies);
}

// display movies
function showMovies(movies) {
    // check for saving data. to prevent multiple download
    isNew = false;
    // save movies
    if (starwarMovies == undefined) {
        starwarMovies = movies;
        isNew = true;
        movies.forEach(movie => {
            urlToMovies[movie.url] = movie;
        });
    }

    // set header and bottom section texts
    const downDiv = document.querySelector('#down-section');
    downDiv.innerHTML = '';
    const headerDiv = document.querySelector('#upper-section');
    const headerElement = document.createElement('header');
    headerDiv.innerHTML = '📺 Starwar Movies! ✨';
    headerDiv.append(headerElement);

    // change main section style
    const div = document.querySelector('#main-section');
    div.className = "section";
    const rightDiv = document.querySelector('#left-section');
    rightDiv.innerHTML = "";
    const leftDiv = document.querySelector('#right-section');
    leftDiv.innerHTML = "";

    // create text and button for each move
    movies.forEach(movie => {
        // html text
        const movieText = document.createElement('p');
        movieText.innerText = '🎬 Episode ' + movie.episode_id + ':   ' + movie.title + ' | ' + movie.release_date;
        leftDiv.append(movieText);

        // button
        const btn = document.createElement('button');
        btn.innerHTML = "starships " + movie.episode_id;
        btn.value = movie.episode_id;
        btn.style.textDecoration = "underline";
        btn.addEventListener('click', showStarships_);
        rightDiv.append(btn);

        // download each movie starships information for later
        if (isNew) {
            movieToStarships[movie.episode_id] = movie.starships;
            movie.starships.forEach(
                starship => {
                    setStarshipInfo(starship);
                });
        }
    });

}

// download and set starship information with starship url
function setStarshipInfo(starship) {
    if (starshipsInfo[starship] == undefined) {
        fetch(starship)
            .then(response => response.json())
            .then(info => {
                starshipsInfo[starship] = info;
            })
            .catch(err => {
                console.log(err);
            });
    }
}

// call showStarships with page number 0 as default (show first starships page)
function showStarships_(event) {
    showStarships(event.target.value, 0);
}

// call showStarships with specific page number in button.value (click on page number)
function showStarships_p(event) {
    let s = event.target.value.split(" ")
    showStarships(s[0], s[1]);
}

// show starships list in left div as pages
function showStarships(movieEpisodeId, pageNum) {
    // check resource download is complete
    if (Object.keys(starshipsInfo).length != 36) {
        console.log("WARNING: resources (starships info) are not fully downloaded!");
        // return 0;
    }

    // set text and styles 
    const div = document.querySelector('#main-section');
    div.className = "section-starship";
    const upDiv = document.querySelector('#upper-section');
    upDiv.innerHTML = '🛸 Starships';
    const rightDiv = document.querySelector('#left-section');
    rightDiv.innerHTML = "";// = 'choose starship to view info';
    const leftDiv = document.querySelector('#right-section');
    leftDiv.innerHTML = "";

    // create back to moives button
    const backBtn = document.createElement('button');
    backBtn.innerHTML = "🔙 Back to Movies";
    backBtn.style.textDecoration = "underline";
    backBtn.value = "";
    backBtn.addEventListener('click', showMovies_);
    backBtn.style.float = 'right';
    upDiv.append(backBtn);

    // create starships array as buttons
    starships = movieToStarships[movieEpisodeId];
    fullShowList = [];
    starships.forEach(
        starshipUrl => {
            starship = starshipsInfo[starshipUrl];

            if (starship == undefined) {
                console.log("ERROR: undefined starship! reload page to download resources again", starshipUrl);
            }
            else {
                const btn = document.createElement('button');
                btn.innerHTML = "🚀 " + starship.name;
                btn.value = starshipUrl;
                btn.addEventListener('click', showStarshipInfo);
                fullShowList.push(btn);
            }
        });

    // add starships to leftDiv for show in pages
    pageSize = 5;
    showList = fullShowList.slice(pageNum * pageSize, (pageNum * pageSize) + pageSize);
    if (showList.length == 0) {
        console.log("ERROR: invalid page number for starships view!");
    }
    else {
        showList.forEach(element => {
            leftDiv.append(element);
        });
    }

    // add pagination text and numbers
    const downDiv = document.querySelector('#down-section');
    downDiv.innerHTML = '';
    const pageText = document.createElement('p');
    pageText.innerHTML = "📜 Pages: ";
    pageText.style.display = "inline-block";
    pageText.style.textDecoration = "underline";
    downDiv.append(pageText);
    // page numbers as buttons
    for (let i = 0; i <= parseInt((fullShowList.length - 1) / pageSize); i++) {
        const btn = document.createElement('button');
        btn.innerHTML = i + 1;
        btn.value = movieEpisodeId + " " + i;
        btn.addEventListener('click', showStarships_p);
        btn.style.margin = "5px";
        if (i == pageNum){
            btn.style.textDecoration = "underline";
        }
        downDiv.append(btn);
    }

}

// show starship info at rightDiv
function showStarshipInfo(event) {
    // clear rightDiv
    const rightDiv = document.querySelector('#left-section');
    rightDiv.innerHTML = '';

    starship = starshipsInfo[event.target.value];

    // set info
    const p = document.createElement('p')
    films = "";
    starship.films.forEach(film => {
        films = films + ', ' + urlToMovies[film].title;
    });
    films = films.slice(2);
    brs = "<br>✨ "
    p.innerHTML = "✨ name: " + starship.name
        + brs + "model: " + starship.model
        + brs + "manufacturer: " + starship.manufacturer
        + brs + "length: " + starship.length
        + brs + "crew: " + starship.crew
        + brs + "passengers: " + starship.passengers
        + brs + "cargo capacity: " + starship.cargo_capacity
        + brs + "MGLT: " + starship.MGLT
        + brs + "starship class: " + starship.starship_class
        + brs + "films: " + films;
        p.className = "p2";

    rightDiv.append(p);
}


