const movieDetail = document.getElementById('movie-detail');

// Watchlist functions
function getWatchlist() {
    const watchlist = localStorage.getItem('watchlist');
    return watchlist ? JSON.parse(watchlist) : [];
}

function removeFromWatchlist(imdbID) {
    let watchlist = getWatchlist();
    watchlist = watchlist.filter(m => m.imdbID !== imdbID);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    // Reload the page to show updated list
    displayWatchlist();
}

function displayWatchlist() {
    const watchlist = getWatchlist();
    
    if (watchlist.length === 0) {
        movieDetail.innerHTML = `
            <div style="text-align: center; padding: 2em;">
                <h2>Your watchlist is empty</h2>
                <p>Add some movies from the <a href="index.html">search page</a></p>
            </div>
        `;
        return;
    }
    
    movieDetail.innerHTML = '';
    
    watchlist.forEach(data => {
        movieDetail.innerHTML += `
            <div class="movie">
                <img src="${data.Poster}" alt="movie-poster">
                <div class="movie-info">
                    <div class="title-row">
                        <h3>${data.Title}</h3>
                        <span class="rating">rating: ${data.imdbRating}</span>
                    </div>
                    <div class="meta-row">
                        <span>${data.Runtime}</span>
                        <span>${data.Genre}</span>
                        <button class="watchlist-btn remove-btn" data-id="${data.imdbID}">Remove from Watchlist</button>
                    </div>
                    <p class="plot">${data.Plot}</p>
                </div>
            </div>
        `;
    });
    
    // Add event listeners to remove buttons
    attachRemoveListeners();
}

function attachRemoveListeners() {
    const removeBtns = document.querySelectorAll('.remove-btn');
    removeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const imdbID = this.getAttribute('data-id');
            removeFromWatchlist(imdbID);
        });
    });
}

// Load watchlist when page loads
displayWatchlist();
