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

const language=localStorage.getItem("Language");
const movLocation=localStorage.getItem('location');
const mvName=localStorage.getItem('Movie');
const mvDate = localStorage.getItem('MovieDate');

function langSelect(){
  document.getElementById('langContainer').style.display='none';
}
function selectLang(){
  document.getElementById('langContainer').style.display='flex';
}
function setLanguage(lang){
  document.getElementById('langBttn').innerText = lang;
}

function setDetailsToHTML(mvData){
  let movHeading=document.getElementById('heading');
  let movbackgrnd=document.getElementById('movBackgrnd');

  movHeading.innerText=mvData.Mname;
  movbackgrnd.style.backgroundImage = `linear-gradient(to right,rgb(28, 28, 28),rgba(28, 28, 28, 0.904),rgba(23, 23, 23, 0.498)), url(${mvData.background})`;
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
      const languages = [];
      const dates = [];
      const theaters = [];
      const timings = [];
      const docSnapshot = await getDocs(showsCollection);
      docSnapshot.forEach((doc) => {
          if (doc.id == movLocation) {
              var movieData = doc.data();
              Object.keys(movieData).forEach((movId) => {
                  movIds.push(movId);
                  if (movId==movieId){
                    var langData = movieData[movId];
                    Object.keys(langData).forEach((lang) =>{
                      languages.push(lang);
                      if (lang == language){
                        var dateData = movieData[movId][lang];
                        Object.keys(dateData).forEach((date) =>{
                          dates.push(date);
                          if (mvDate == date){
                            var theaterData = movieData[movId][lang][date];
                            Object.keys(theaterData).forEach((theater) => {
                              theaters.push(theater);
                              var timeData = movieData[movId][lang][date][theater];
                              Object.keys(timeData).forEach((timing)=>{
                                timings.push(timing);
                              })
                            })
                          }
                        })
                      }
                    })
                  }
              });
          }
      });
      console.log(languages);
      console.log(dates);
      console.log(theaters);
      console.log(timings);
  } catch (error) {
      console.error("Error getting data:", error);
  }
}
document.addEventListener('DOMContentLoaded', function() {
  if (mvName != null){
      setMovieDetails(mvName);
  }
  if (movLocation!=null){
    checkMovAvailability(movLocation);
  }

  if (language!=null){
    setLanguage(language);
  }else{
    setLanguage("Language");
  }
  
})