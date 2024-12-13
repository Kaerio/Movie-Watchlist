const apiKey = '4ba758d6'
const searchInput = document.getElementById('search-input')
const searchBtn = document.getElementById('search-btn')
const searchResult = document.getElementById('search-result')

function getMovieList(input){
    fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${input}&type=movie&r=json`)
        .then(res => res.json())
            .then(function(data){
                // console.log(data)
                if(data.Response === "True"){
                    searchResult.innerHTML = ""
                    searchResult.classList.remove('empty')
                    searchResult.classList.add('full')

                    renderMovieListHtml(data)
                   
                }
                else{
                    searchResult.innerHTML = `
                        <div class="error">
                            <p>Unable to find what you’re looking for. </br>
                            Please try another search.</p>
                        </div>`
                        
                } 
            })
}

function renderMovieListHtml(movieList){
    movieList.Search.forEach(function(movie){
        console.log(movie)
        fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}&plot=short&r=json`)
            .then(res => res.json())
                .then(function(data){
                    // console.log(data)
                    searchResult.innerHTML += `
                        <div class="movie-container">
                            <div class="img-container">
                                <img src="${data.Poster === "N/A" ? "/images/no-poster.jpg" : data.Poster}" alt="Movie Poster">
                            </div>
                            <div class="description">
                                <div class="text-container">
                                    <h2>${data.Title}</h2>
                                    <span class="score" aria-label="movie rating">
                                        <i class="fa-solid fa-star" aria-hidden="true"></i>
                                        ${data.imdbRating}
                                    </span>
                                </div> 
                                
                                <div class="text-container">
                                    <span class="runtime">${data.Runtime}</span>

                                    <span>${data.Genre}</span>

                                    <div data-div="${movie.imdbID}">
                                        ${renderAddToWatchlistBtn(movie.imdbID)}
                                        
                                    </div>
                                </div>

                                <p>${data.Plot}</p>
                            </div>
                        </div>`
                })
    })
}

function getWatchlist(){
    let watchlist = localStorage.getItem("watchlist")
    if(watchlist){
        watchlist = JSON.parse(watchlist)
    }
    else {
        watchlist = []
    }
    console.log(watchlist);
    return watchlist
}

function renderAddToWatchlistBtn(movieId){
    let watchlist = getWatchlist()
    if(watchlist.includes(movieId)){
        return `<span class="in-watchlist" >
                    ✓ Watchlist
                </span>`
    }
    else{
        return `<button class="add-to-watchlist" id="add-to-watchlist-btn" data-movie-id="${movieId}">
                                                            <i class="fa-solid fa-circle-plus"></i>
                                                            Watchlist
                                                        </button>`
    }
}

function addToWatchlist(movieId){
    let watchlist = getWatchlist()
    watchlist.push(movieId)
    localStorage.setItem("watchlist", JSON.stringify(watchlist))
    console.log(watchlist);
}


searchBtn.addEventListener('click', function(e){
    const input = searchInput.value
    getMovieList(input)
})

document.addEventListener('click', function(e){
    const target = e.target.closest('#add-to-watchlist-btn')

    if(target){
        const movieId = target.dataset.movieId
        addToWatchlist(movieId)
        //change btn into "✓ in watchlist"
        let divToUpdate = document.querySelector(`[data-div='${movieId}']`)
        divToUpdate.innerHTML = `
                <span class="in-watchlist" >
                    ✓ in watchlist
                </span>`
    }
})
