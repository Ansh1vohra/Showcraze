//setting up the location menu adding location from database
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
var locationSet = ref(db, 'Shows');

get(locationSet).then((snapshot) => {
  if (snapshot.exists()) {
    const data = snapshot.val();
    // Get the location menu options container
    const menuOptions = document.getElementById("menuOptions");
    // Clear previous options
    menuOptions.innerHTML = "";
    // Loop through the data and create option elements
    Object.keys(data).forEach((location) => {
        const option = document.createElement("span");
        option.textContent = location; // Assuming 'name' is the property containing the location name
        option.classList.add("location-option"); // Add a class to the option element
        option.addEventListener("click", function() {
            selectLocation(location); // Call selectLocation function with the clicked location name
        });
        menuOptions.appendChild(option); // Append the option to the menu options container
    });
  }
});

function selectLocation(option) {
  var selectedLocationSpan = document.getElementById('selectedLocation');
  selectedLocationSpan.textContent = option;
  localStorage.setItem('location', option);
}

document.addEventListener("DOMContentLoaded", function () {
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  const username = localStorage.getItem('username');
  const loginButton = document.getElementById('loginButton');

  if (loggedIn) {
    const loginButton = document.getElementById("loginButton");
    const sideMenu = document.getElementById("sidemenu");
    const hamMenu = document.getElementById("menu");
    const closeMenuButton = document.getElementById("closeMenu");
    loginButton.style.display = "none"; 
    document.getElementById("greetUser").innerText = `Hello, ${username}!`;
    const toggleSideMenu = function (event) {
      event.preventDefault();
      /*
      const blurElements = document.querySelectorAll('.blur-content');
      for (const element of blurElements) {
        element.classList.toggle('blurred');
      }*/
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
    });

    document.getElementById("logOut").addEventListener("click", function () {
      // Clear the stored user information on logout
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('username');
      //Redirect to the login page
      window.location.href = 'LoginFinal.html';

    })
  } else {
    // Handle the case when the user is not logged in
    const hamMenu = document.getElementById("menu");
    hamMenu.style.display="none";
    loginButton.innerText = 'Login';
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
});
