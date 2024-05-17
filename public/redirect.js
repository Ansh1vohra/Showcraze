import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

getDocs(showsCollection).then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    const docId = doc.id;
    // Get the location menu options container
    const menuOptions = document.getElementById("menuOptions");
    // Create option element
    const option = document.createElement("span");
    option.textContent = docId; // Use document ID as option text
    option.classList.add("location-option");
    option.addEventListener("click", function () {
      selectLocation(docId); // Pass document ID to selectLocation function
    });
    menuOptions.appendChild(option); // Append the option to the menu options container
  });
});

function selectLocation(option) {
  var selectedLocationSpan = document.getElementById('selectedLocation');
  selectedLocationSpan.textContent = option;
  localStorage.setItem('location', option);
  location.reload();
}


document.addEventListener("DOMContentLoaded", function () {
  //for sticky header on scroll
  window.addEventListener('scroll', function () {
    var header = document.getElementById('header');
    var scrollPosition = window.scrollY;

    if (scrollPosition > 50) {
      header.classList.remove('bg-transparent');
      header.classList.add('bg-dark', 'fixed-top');
    } else {
      header.classList.remove('bg-dark', 'fixed-top');
      header.classList.add('bg-transparent');
    }
  });


  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  const username = localStorage.getItem('username');
  const loginButton = document.getElementById('loginButton');

  if (loggedIn) {
    const loginButton = document.getElementById("loginButton");
    // const sideMenu = document.getElementById("sidemenu");
    // const hamMenu = document.getElementById("menu");
    // const closeMenuButton = document.getElementById("closeMenu");
    loginButton.style.display = "none";
    document.getElementById("greetUser").innerText = `Hello, ${username}!`;
    /*
    const toggleSideMenu = function (event) {
      event.preventDefault();
      document.getElementById("darkOverlay").style.display="block";
      sideMenu.classList.toggle("sidemenu-hidden");
    };
    closeMenuButton.addEventListener("click", toggleSideMenu);
    hamMenu.addEventListener("click", toggleSideMenu);

    // Hide side menu when clicking outside of it
    document.addEventListener("click", function (event) {
      if (!sideMenu.contains(event.target) && event.target !== hamMenu || event.target ==closeMenuButton ) {
        document.getElementById("darkOverlay").style.display="none";
        sideMenu.classList.add("sidemenu-hidden");
      }
    });*/

    document.getElementById("logOut").addEventListener("click", function () {
      // Clear the stored user information on logout
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('username');
      //Redirect to the login page
      window.location.href = 'LoginFinal.html';

    })
  } else {
    // Handle the case when the user is not logged in
    const hamMenu = document.getElementById("HamBurger");
    hamMenu.style.display = "none";
    loginButton.innerText = 'Sign-In';
    loginButton.onclick = function () {
      window.location.href = 'LoginFinal.html';
    };
  }
  //searching in location menu

  const locationSearch = document.getElementById('locationSearch');
  const locationMenu = document.getElementById('locationMenu');
  const locationOptions = locationMenu.getElementsByTagName('span');

  // Keep track of whether the location menu is open due to input focus
  let isMenuOpen = false;

  // Show location menu on hover or when input is focused
  document.querySelector('.setLocation').addEventListener('mouseenter', function () {
    if (!locationSearch.matches(':focus')) {
      locationMenu.style.display = 'block';
      isMenuOpen = true;
    }
  });

  // Hide location menu on mouse leave only if input is not focused
  document.querySelector('.setLocation').addEventListener('mouseleave', function () {
    if (!locationSearch.matches(':focus')) {
      locationMenu.style.display = 'none';
      isMenuOpen = false;
    }
  });

  // Show location menu when input is focused
  locationSearch.addEventListener('focus', function () {
    locationMenu.style.display = 'block';
    isMenuOpen = true;
  });

  // Hide location menu on blur if not already open due to input focus
  locationSearch.addEventListener('blur', function () {
    if (!isMenuOpen) {
      locationMenu.style.display = 'none';
    }
  });

  locationSearch.addEventListener('input', function () {
    const searchTerm = locationSearch.value.toLowerCase();

    for (const option of locationOptions) {
      const optionText = option.textContent.toLowerCase();
      if (optionText.includes(searchTerm)) {
        option.style.display = 'block';
      } else {
        option.style.display = 'none';
      }
    }
  });
  const locationData = localStorage.getItem("location");
  if (locationData != null) {
    var selectedLocationSpan = document.getElementById('selectedLocation');
    selectedLocationSpan.textContent = locationData;
  }
});
