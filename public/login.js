import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js"
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth, sendPasswordResetEmail,  signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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
const analytics = getAnalytics(app);
const db = getDatabase(app);
const auth = getAuth(app);

const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
signupBtn.onclick = (() => {
    loginForm.style.marginLeft = "-50%";
    loginText.style.marginLeft = "-50%";
});
loginBtn.onclick = (() => {
    loginForm.style.marginLeft = "0%";
    loginText.style.marginLeft = "0%";
});


//login logic
document.getElementById("loginForm").addEventListener('submit', function (e) {
  e.preventDefault();

  document.getElementById("loading").style.display = "block";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const usersRef = ref(db, 'user');

  get(usersRef).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();

      const user = Object.values(data).find(user => user.email === email);//checking for emails in DB

      if (user) {
        const userName = user.username;
        const userPassword = user.password;


        if (userPassword == password) {
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('username', userName);
          window.location.href = 'index.html';//redirect to home page
        } else {//incorrect password
          document.getElementById("loading").style.display = "none";
          document.getElementById("warning").textContent = "Incorrect Password!";
          document.getElementById("password").style.borderColor = "red";
        }
      } else {//user not found
        document.getElementById("loading").style.display = "none";
        document.getElementById("warning").textContent = "User Not Found, Sign Up Now!";
        myDiv.textContent = "User Not Found, Sign Up Now!";
      }
    } else {
      document.getElementById("loading").style.display = "none";
      console.log("No data available");
    }
  }).catch((error) => {
    console.error("Error getting data:", error);
    document.getElementById("loading").style.display = "none";
  });
})


//OTP Generation
function generateOTP() {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Forgot password


document.getElementById("forgotPasswordLink").addEventListener('click', function (e) {
  e.preventDefault();

  document.getElementById("loading").style.display = "block";

  const email = document.getElementById("email").value;

  if (email) {
    const otp = generateOTP();//otp generated
    console.log(otp);
    const usersRef = ref(db, 'user');

    // Check if the email is already registered
    get(usersRef).then((snapshot) => {
      if (snapshot.exists()) {
        
        const data = snapshot.val();

        const user = Object.values(data).find(user => user.email === email);

        if (user) {
          const name=user.username;
          const userRef = ref(db, 'user/' + name);
          // Retrieve existing user data
          get(userRef).then((userSnapshot) => {
            const userData = userSnapshot.val();
            // Update the OTP field
            userData.OTP = otp;
            // Set the entire user data back to the database
            set(userRef, userData).then(() => {
              Email.send({
                  Host : "smtp.elasticemail.com",
                  Username : "anshvohra1@gmail.com",
                  Password : "B865DAAD6512C1A86E9FCAFE887B0A74030F",
                  To : `${email}`,
                  From : "anshvohra1@gmail.com",
                  Subject : "OTP for Show Craze Project",
                  Body : `OTP for Password reset is : ${otp}`
              }).then(
                message => alert(message)
              );
              document.getElementById("loading").style.display = "none";
            });
          });
        } else {
          document.getElementById("loading").style.display = "none";
          document.getElementById("warning").textContent = "User Not Found, Sign Up Now!";
        }
      }
    })
  } else {
    document.getElementById("loading").style.display = "none";
    document.getElementById("warning").textContent = "Enter your email !";
    document.getElementById("email").style.borderColor = "red";
  }
});

// for sign up
document.getElementById("signupForm").addEventListener('submit', function (e) {
  e.preventDefault();

  document.getElementById("loading").style.display = "block";

  const name = document.getElementById("userName").value;
  const email = document.getElementById("newEmail").value;
  const password = document.getElementById("newPass").value;
  const cnf = document.getElementById("cnfPass").value;

  if (password != cnf) {
    document.getElementById("warning2").textContent = "Passwords does not match.";
    document.getElementById("loading").style.display = "none";
    return; // Stop form submission
  } else {
    const usersRef = ref(db, 'user');

    // Check if the email is already registered
    get(usersRef).then((snapshot) => {
      if (snapshot.exists()) {

        const data = snapshot.val();

        const emailAlreadyExists = Object.values(data).some(user => user.email === email);

        if (emailAlreadyExists) {
          document.getElementById("warning2").textContent = "Email is already registered. Please use a different email.";
          document.getElementById("loading").style.display = "none";
        } else {
          // Email is not registered, proceed with sign-up
          const userRef = ref(db, 'user/' + name);
          set(userRef, {
            username: name,
            email: email,
            password: password,
          }).then(() => {
            const userName = name;
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('username', userName);
            alert("Sign-Up Success.");
            window.location.href = 'index.html';
          }).catch((error) => {
            document.getElementById("loading").style.display = "none";
            console.error("Error signing up:", error);
          });
        }
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error("Error getting data:", error);
    });
  }
});

//sign in with google
const myButton = document.getElementById("logInWithGoogle");

myButton.addEventListener("click", function () {

    document.getElementById("loading").style.display = "block";    
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('username', user.displayName);
            const email = user.email;
            const name = user.displayName;
            const usersRef = ref(db, 'user');

            get(usersRef).then((snapshot) => {
                const data = snapshot.val();

                if (data) {
                    const user = Object.values(data).find(user => user.email === email);

                    if (user) {
                        console.log("Welcome");
                        window.location.href = 'index.html';
                    } else {
                        const userRef = ref(db, 'user/' + name);
                        set(userRef, {
                            username: name,
                            email: email,
                        }).then(() => {
                            console.log("New user added to the database");
                            window.location.href = 'index.html';
                        }).catch((error) => {
                            console.error("Error adding new user to the database", error.message);
                        });
                    }
                }
            }).catch((error) => {
                document.getElementById("loading").style.display = "none";
                console.error("Error checking user data in the database", error.message);
            });
        })
        .catch((error) => {
            document.getElementById("loading").style.display = "none";
            console.error("Error signing in with Google", error.message);
        })        
});