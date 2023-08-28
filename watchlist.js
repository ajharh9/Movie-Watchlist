import {getMovieHtml, getMovieDetail} from './index.js';

let myWatchlistArr = JSON.parse(sessionStorage.getItem("myArr"));
const WatchlistMovies = document.getElementById("WatchlistMovies");
const emptyPlaceHolderEl = document.getElementById("empty-placeholder");
const mainEl = document.getElementById("main");
let WatchlistmovieHTML = "";


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
  if(myWatchlistArr.length != 0){
    emptyPlaceHolderEl.classList.add("hide");
    mainEl.classList.remove("center-ele");
  }
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
