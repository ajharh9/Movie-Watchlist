import {getMovieHtml, getMovieDetail} from './index.js';

let myWatchlistArr = JSON.parse(sessionStorage.getItem("myArr"));
const WatchlistMovies = document.getElementById("WatchlistMovies");
const emptyPlaceHolderEl = document.getElementById("empty-placeholder");
const mainEl = document.getElementById("main");
let WatchlistmovieHTML = "";

// function removeItemFromoWatchlist(imdbID) {
//     let jsonData = sessionStorage.getItem("myArr");
//     myWatchlistArr = JSON.parse(jsonData);
//     const index = myWatchlistArr.indexOf(imdbID)
//     myWatchlistArr.splice(index,1);
//     jsonData = JSON.stringify(myWatchlistArr);
//     sessionStorage.setItem("myArr", jsonData);
//     getWatchlistMovieList()
// }

// function getMovieHtml(movieDetail) {
//   return `
//             <div class="movie">
//                 <div>
//                     <img class="movie-img" src="${movieDetail.Poster}" alt="${movieDetail.Title} poster">
//                 </div>
//                 <div class="movie-details">
//                     <div class="movie-title">
//                         <h2>${movieDetail.Title}</h2>
//                         <span>⭐${movieDetail.imdbRating}</span>
//                     </div>
//                     <div class="movie-description">
//                         <span>${movieDetail.Runtime}</span>
//                         <span>${movieDetail.Genre}</span>
//                         <button id=${movieDetail.imdbID} onclick=removeItemFromoWatchlist('${movieDetail.imdbID}') class="add-watchlist-btn ">Remove<i class="blinking fa-solid plus">➖</i></button>
//                     </div>
//                     <p class="large-movie-des">${movieDetail.Plot}</p>
//                 </div>
//             </div>
//             <p class='small-movie-des hide'>${movieDetail.Plot}</p>
//             <hr>
//           `;
// }



// function getMovieDetail(imdbID) {
//   return new Promise((resolve, reject) => {
//     fetch(`https://www.omdbapi.com/?plot=short&i=${imdbID}&apikey=cfae198d`)
//       .then((res) => res.json())
//       .then((res) => resolve(res))
//       .catch((err) => reject(err));
//   });
// }


for (let ele of myWatchlistArr) {
  document.addEventListener('click', function (e) {
    if (e.target.id == `${ele}-sub`) {
      removeItemFromoWatchlist(e.target.id.slice(0, -4));
    }
  })
}

function removeItemFromoWatchlist(imdbID) {
  let jsonData = sessionStorage.getItem("myArr");
  myWatchlistArr = JSON.parse(jsonData);
  const index = myWatchlistArr.indexOf(imdbID);
  myWatchlistArr.splice(index, 1);
  jsonData = JSON.stringify(myWatchlistArr);
  sessionStorage.setItem("myArr", jsonData);
  reloadPage();
}

async function getWatchlistMovieList() {
  WatchlistMovies.innerHTML = ""
  emptyPlaceHolderEl.classList.add("hide");
  mainEl.classList.remove("center-ele");
  let movieHTML = "";
  for (let i = 0; i < myWatchlistArr.length; i++) {
    // data.Search.forEach((movie) => {
    const movieDetail = await getMovieDetail(myWatchlistArr[i]);
    movieHTML += getMovieHtml(movieDetail, 'sub');
  }
  WatchlistMovies.innerHTML += movieHTML;
}

function reloadPage() {
  getWatchlistMovieList();  
}

reloadPage();

let jsonData = JSON.stringify(myWatchlistArr);
sessionStorage.setItem("myArr", jsonData);
