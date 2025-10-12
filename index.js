const btn = document.getElementById('btn');
const movieDetail = document.getElementById('movie-detail');

// Watchlist functions
function getWatchlist() {
    const watchlist = localStorage.getItem('watchlist');
    return watchlist ? JSON.parse(watchlist) : [];
}

function saveToWatchlist(movie) {
    const watchlist = getWatchlist();
    // Check if movie already exists
    if (!watchlist.find(m => m.imdbID === movie.imdbID)) {
        watchlist.push(movie);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }
}

function removeFromWatchlist(imdbID) {
    let watchlist = getWatchlist();
    watchlist = watchlist.filter(m => m.imdbID !== imdbID);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
}

function isInWatchlist(imdbID) {
    const watchlist = getWatchlist();
    return watchlist.some(m => m.imdbID === imdbID);
}

btn.addEventListener('click', async () => {
    const searchTerm = document.getElementById('search-box').value;
    
    // First, search for movies
    const searchResponse = await fetch(`http://www.omdbapi.com/?s=${searchTerm}&apikey=248ff6b`);
    const searchData = await searchResponse.json();
    
    console.log(searchData);
    movieDetail.innerHTML = `<h2>Search Results</h2>`;
    
    // Get detailed info for the first 5 movies
    const movies = searchData.Search.slice(0, 5);
    
    for (let movie of movies) {

        const detailResponse = await fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=248ff6b&plot=full`);
        const data = await detailResponse.json();
        
        const inWatchlist = isInWatchlist(data.imdbID);
        const buttonText = inWatchlist ? 'Remove from Watchlist' : '+ Watchlist';
        
        // Create a movie card element
        const movieCard = document.createElement('div');
        movieCard.className = 'movie';
        movieCard.innerHTML = `
            <img src="${data.Poster}" alt="movie-poster">
            <div class="movie-info">
                <div class="title-row">
                    <h3>${data.Title}</h3>
                    <span class="rating"> rating: ${data.imdbRating}</span>
                </div>
                <div class="meta-row">
                    <span>${data.Runtime}</span>
                    <span>${data.Genre}</span>
                    <button class="watchlist-btn">${buttonText}</button>
                </div>
                <p class="plot">${data.Plot}</p>
            </div>
        `;
        
        const watchlistBtn = movieCard.querySelector('.watchlist-btn');
        watchlistBtn.addEventListener('click', function() {
            if (this.textContent.includes('Remove')) {
                removeFromWatchlist(data.imdbID);
                this.textContent = '+ Watchlist';
            } else {
                saveToWatchlist(data);
                this.textContent = 'Remove from Watchlist';
            }
        });
        
        movieDetail.appendChild(movieCard);
    }
});