"use strict";
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
const showsCollection = collection(db, 'Shows');
const moviesCollection = collection(db, 'Movies');


function setDetailsToHTML(mvData){
    let movHeading=document.getElementById('heading');
    let movGenre=document.getElementById('Genre');
    let movDuration=document.getElementById('Duration');
    let movDirector=document.getElementById('Director');
    let movLanguage=document.getElementById('Language');
    let movSynopsis=document.getElementById('Synopsis');
    let movDirect=document.getElementById('direct');
    let movWriter=document.getElementById('writer');
    let movProducer=document.getElementById('producer');
    let movStars=document.getElementById('stars');
    let movbackgrnd=document.getElementById('movBackgrnd');
    let movPoster=document.getElementById('poster');

    movHeading.innerText=mvData.Mname;
    movGenre.innerText=mvData.Genre;
    movDuration.innerText=mvData.duration;
    movDirector.innerText=`Directed by - ${mvData.Director}`;
    movLanguage.innerText=mvData.Languages;
    movSynopsis.innerText=mvData.synopsis;
    movDirect.innerText=`Directed by - ${mvData.Director}`;
    movWriter.innerText=`Written by - ${mvData.Writers}`;
    movProducer.innerText=`Producers - ${mvData.Producers}`;
    movStars.innerText=`Starring - ${mvData.Stars}`;
    movbackgrnd.style.backgroundImage = `linear-gradient(to right,rgb(28, 28, 28),rgba(28, 28, 28, 0.904),rgba(23, 23, 23, 0.498)), url(${mvData.background})`;
    movPoster.src=mvData.poster;
}

let movieId=0;

function setMovieDetails(mname){
    getDocs(moviesCollection).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var movieData = doc.data();
            if (mname == movieData.Mname){
                setDetailsToHTML(movieData);
                movieId=doc.id;
                console.log(movieId);
            }
        });
    }).catch((error) => {
        console.error("Error getting data:", error);
    });
}

async function checkMovAvailability(movLocation) {
    try {
        const movIds = [];
        const docSnapshot = await getDocs(showsCollection);
        docSnapshot.forEach((doc) => {
            if (doc.id == movLocation) {
                var movieData = doc.data();
                Object.keys(movieData).forEach((movId) => {
                    movIds.push(movId);
                });
            }
        });

        const button = document.getElementById('bookNow');
        if (movIds.includes(movieId)) {
            button.disabled = false;
        } else {
            button.disabled = true;
            button.innerText = 'Not available at your location';
            button.style.backgroundColor = 'grey';
        }
    } catch (error) {
        console.error("Error getting data:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const movLocation=localStorage.getItem('location');
    const mvName=localStorage.getItem('Movie');
    if (mvName != null){
        setMovieDetails(mvName);
    }
    if (movLocation!=null){
        checkMovAvailability(movLocation);
    }
    const bookButton=document.getElementById('bookNow');
    bookButton.addEventListener('click', function(){
        window.location.href='showdetails.html';
    })
})