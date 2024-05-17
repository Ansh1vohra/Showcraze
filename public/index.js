import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyBQ4cIMHkbS2AzjijfoJG07zDrBS6jZoWM",
  authDomain: "avmovieprj.firebaseapp.com",
  databaseURL: "https://avmovieprj-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "avmovieprj",
  storageBucket: "avmovieprj.appspot.com",
  messagingSenderId: "526265405646",
  appId: "1:526265405646:web:3dfa2d42efc9deddabc09f",
  measurementId: "G-BCJWW90BDF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const moviesCollection = collection(db, 'Movies');
const showsCollection = collection(db, 'Shows');

function displayAllMovies() {
  getDocs(moviesCollection).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          var movieData = doc.data();
          addMovieToContainer(movieData);
      });
  }).catch((error) => {
      console.error("Error getting data:", error);
  });
}

function displayMoviesAccToLocation(movLocation) {
  const moviesContainer = document.getElementById('movieContainer');
  moviesContainer.innerHTML = ""; // Clear existing movies
  const movIds=[];
  getDocs(showsCollection).then((docSnapshot) => {
    docSnapshot.forEach ((doc) => {
        if (doc.id==movLocation){
          var movieData = doc.data();
          Object.keys(movieData).forEach((movId) => {
            movIds.push(movId);
          });
          getDocs(moviesCollection).then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                if (movIds.includes(doc.id)) { // Check if the movie ID exists in movIds array
                    const movieData = doc.data();
                    addMovieToContainer(movieData);
                }                 
              });
          }).catch((error) => {
              console.error("Error getting data:", error);
          });
        }
    });
  }).catch((error) => {
      console.error("Error getting data:", error);
  });
}

function addMovieToContainer(movieData) {
      var movieContainer = document.getElementById('movieContainer');
      var movieElement = document.createElement('div');
      movieElement.className = 'movie';
      movieElement.onclick = function() {
      localStorage.setItem('Movie', movieData.Mname);
      window.location.href = 'mvdesc.html';
    };

    var movieImage = document.createElement('img');
    movieImage.src = movieData.poster;
    movieImage.alt = movieData.Mname;

    var movieTitle = document.createElement('b');
    movieTitle.textContent = movieData.Mname;

    var movieGenre = document.createElement('p');
    movieGenre.textContent = movieData.Genre;

    // Append elements to the movie container
    movieElement.appendChild(movieImage);
    movieElement.appendChild(movieTitle);
    movieElement.appendChild(movieGenre);
    movieContainer.appendChild(movieElement);

}

function setMoviesAccToLocation(){
  var Loct=localStorage.getItem("location");
    if (Loct==null){
      displayAllMovies();
    }else{
      displayMoviesAccToLocation(Loct);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setMoviesAccToLocation();
});
