
const searchInputEl = document.getElementById("search-input");
const emptyPlaceHolderEl = document.getElementById("empty-placeholder");
const emptySearchBarMsg = document.getElementById("empty-search-bar-msg");
const mainEl = document.getElementById("main");
const moviesList = document.getElementById("movies");
let myWatchlistArr = [];
if (!JSON.parse(sessionStorage.getItem("myArr"))) {
  let jsonData = JSON.stringify(myWatchlistArr);
  sessionStorage.setItem("myArr", jsonData);
}


document.addEventListener("click", function (e) {
  if (e.target.id == "search-movie-btn") {
    getSearchResults();
  }
});

function addItemToWatchlist(imdbID) {
  let jsonData = sessionStorage.getItem("myArr");
  myWatchlistArr = JSON.parse(jsonData);
  myWatchlistArr.unshift(imdbID);
  jsonData = JSON.stringify(myWatchlistArr);
  sessionStorage.setItem("myArr", jsonData);
}


function getMovieHtml(movieDetail, operation) {
  return `
            <div class="movie">
                <div>
                    <img class="movie-img" src="${movieDetail.Poster}" alt="${
    movieDetail.Title
  } poster">
                </div>
                <div class="movie-details">
                    <div class="movie-title">
                        <h2>${movieDetail.Title}</h2>
                        <span>⭐${movieDetail.imdbRating}</span>
                    </div>
                    <div class="movie-description">
                        <span>${movieDetail.Runtime}</span>
                        <span>${movieDetail.Genre}</span>
                        <button 
                          id="${movieDetail.imdbID}-${operation}" 
                          class="add-watchlist-btn "
                        >
                          ${operation == "add" ? "Watchlist" : "Remove"}
                          <i 
                            id="${movieDetail.imdbID}-${operation}-icon"
                            class="blinking ${
                              operation == "add" ? "fa-solid fa-plus" : ""
                            } plus"
                          >
                            ${operation == "sub" ? "➖" : ""}
                          </i>

                        </button>
                    </div>
                    <p class="large-movie-des">${movieDetail.Plot}</p>
                </div>
            </div>
            <p class='small-movie-des hide'>${movieDetail.Plot}</p>
            <hr>
          `;
}

function getSearchResults() {
  const searchKeyWord = searchInputEl.value;
  searchInputEl.placeholder = "Searching...";
  getMovieList(searchKeyWord);
  searchInputEl.value = "";
}

function getMovieDetail(imdbID) {
  return new Promise((resolve, reject) => {
    fetch(`https://www.omdbapi.com/?plot=short&i=${imdbID}&apikey=cfae198d`)
      .then((res) => res.json())
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

function getMovieList(searchKeyWord) {
  emptyPlaceHolderEl.classList.add("hide");
  const apikey = "cfae198d";
  let movieHTML = "";
  moviesList.innerHTML = "";

  fetch(`https://www.omdbapi.com/?apikey=${apikey}&s=${searchKeyWord}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.Response == "False") {
        throw data.Error;
      } else {
        mainEl.classList.remove("center-ele");
        emptySearchBarMsg.classList.add("hide");
        return data.Search;
      }
    })
    .then((movieList) => {
      let searchMovieList = movieList.map((ele) => ele.imdbID);
      for (let i = 0; i < movieList.length; i++) {
        fetch(
          `https://www.omdbapi.com/?plot=short&i=${movieList[i].imdbID}&apikey=cfae198d`
        )
          .then((res) => res.json())
          .then((movieDetail) => {
            return getMovieHtml(movieDetail, "add");
          })
          .then((movieHTML) => (moviesList.innerHTML += movieHTML))
          .then(() => {
              document.addEventListener("click", function (e) {
                if (e.target.id == `${searchMovieList[i]}-add`) {
                  let imdbID = e.target.id.slice(0, -4)
                  let icon = document.getElementById(`${imdbID}-add-icon`)
                  icon.classList.remove('fa-plus')
                  icon.classList.add('fa-check')
                  addItemToWatchlist(imdbID);
                } 
              });
          })
          .catch((err) => console(err));
      }
    })
    .catch((err) => {
      moviesList.innerHTML = "";
      mainEl.classList.add("center-ele");
      emptySearchBarMsg.classList.remove("hide");
    })
    .then(() => {
      searchInputEl.placeholder = "Search for a movie";
    });
}

export {getMovieHtml, getMovieDetail };
