import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js"

const firebaseConfig = {
    apiKey: "AIzaSyBheg3mCBc3I3-EMJMI7BVNwf2rvXiCRw8",
    authDomain: "anshvohra.firebaseapp.com",
    databaseURL: "https://anshvohra-default-rtdb.firebaseio.com",
    projectId: "anshvohra",
    storageBucket: "anshvohra.appspot.com",
    messagingSenderId: "685034793590",
    appId: "1:685034793590:web:4b0ed242457bfd97648d57",
    measurementId: "G-KXTVJKTF91"
};

function redirectToMvdescPage() {
  window.location.href = 'mvdesc.html';
}

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
var moviesRef = ref(db, 'Movies');

function displayAllMovies() {
    get(moviesRef).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          var movieData = childSnapshot.val();
          addMovieToContainer(movieData);
        });
      } else {
        console.log("No data available");
      }
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
      redirectToMvdescPage();
    };

    var movieImage = document.createElement('img');
    movieImage.src = movieData.poster;
    movieImage.alt = movieData.Mname;

    var movieTitle = document.createElement('h2');
    movieTitle.textContent = movieData.Mname;

    var movieGenre = document.createElement('p');
    movieGenre.textContent = movieData.Genre;

    // Append elements to the movie container
    movieElement.appendChild(movieImage);
    movieElement.appendChild(movieTitle);
    movieElement.appendChild(movieGenre);

    movieContainer.appendChild(movieElement);
  }

  displayAllMovies();

  //for sticky header on scroll
  window.addEventListener('scroll', function() {
    var header = document.querySelector('header');
    var scrollPosition = window.scrollY;

    if (scrollPosition > 50) {
        header.classList.add('sticky-header', 'animation');
    } else {
        header.classList.remove('sticky-header', 'animation');
    }
});

// Add this script to handle smooth appearance of the sticky header
document.addEventListener('DOMContentLoaded', function() {
    var header = document.querySelector('header');
    var headerHeight = header.clientHeight;

    window.addEventListener('scroll', function() {
        var scrollPosition = window.scrollY;

        if (scrollPosition > headerHeight) {
            header.style.transition = 'background-color 0.3s ease-in-out'; // Adjust the transition duration as needed
        } else {
            header.style.transition = 'none';
        }
    });
});
