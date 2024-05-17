import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);


// Initialize Email.js with your service ID
emailjs.init({
    publicKey: 'Wlwh7-xUasxAs3Jid'
})
        
// Function to send an email
function sendEmail(tomail, msg) {
    return new Promise((resolve, reject) => {
        // Define email parameters
        var emailParams = {
            to_email: tomail,
            message: msg
        };

        // Send the email
        emailjs.send('service_ssznf28', 'template_k0odk1p', emailParams)
            .then(function(response) {
                console.log('Email sent successfully:', response);
                resolve(true);
            })
            .catch(function(error) {
                console.error('Email failed to send:', error);
                reject(false);
            });
    });
}



//login with google
const lgnGoogleButton = document.getElementById("logInWithGoogle");

lgnGoogleButton.addEventListener("click", function (event) {
    event.preventDefault();

    document.getElementById("loading").style.display = "block";    
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('username', user.displayName);
            addUserToFirestore(user);
        })
        .catch((error) => {
            document.getElementById("loading").style.display = "none";
            console.error("Error signing in with Google", error.message);
        })        
});

function addUserToFirestore(user) {
    const usersRef = doc(db, "Users", user.email);
    const userData = {
        Name: user.displayName,
        email: user.email,
    };

    setDoc(usersRef, userData)
        .then(() => {
            console.log("User added to Firestore successfully");
            document.getElementById("loading").style.display = "none";
            window.location.href='index.html';
        })
        .catch((error) => {
            console.error("Error adding user to Firestore", error);
        });
}



function generateOTP() {
  const min = 1000;
  const max = 9999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getName(email){
  const parts = email.split("@");
    
  const name = parts[0];
    
  return name;
}


const emailForm=document.getElementById('emailForm');

emailForm.addEventListener('submit', function(event){
    event.preventDefault();

    document.getElementById("loading").style.display = "block";

    var email=document.getElementById('email').value;
    var otp = generateOTP();
    var name = getName(email);
    const usersRef = doc(db, "Users", email);
    const userData = {
        email:email,
        OTP:otp,
        UserName:name,
        Verfied:false
    };
    var mess=`Your OTP for Authentication is :${otp}`;

    sendEmail(email, mess)
        .then((status) => {
            // Email sent successfully
            setDoc(usersRef, userData)
                .then(() => {
                    document.getElementById("loading").style.display = "none";
                //make OTP visible and hide email textfield
                document.getElementById("otp").style.display = "block";
                document.getElementById("email").style.display = "none";
                var otpMsg = document.getElementById("otpMsg");
                otpMsg.innerText=`otp has sent to ${email}, enter that OTP here.`;
                var otpButton=document.getElementById("otpButton");
                document.getElementById("emailButton").style.display="none";

                otpButton.style.display="block";

                otpButton.addEventListener("click",function(event){
                    event.preventDefault();

                    const input1 = document.getElementById("input1").value;
                    const input2 = document.getElementById("input2").value;
                    const input3 = document.getElementById("input3").value;
                    const input4 = document.getElementById("input4").value;

                    const concatenatedValue = input1 + input2 + input3 + input4;

                    const enteredOTP = parseInt(concatenatedValue, 10);

                    if (otp==enteredOTP){
                        document.getElementById("loading").style.display = "block";
                        const usersRef = doc(db, "Users", email);
                        const userData = {
                            email:email,
                            OTP:otp,
                            UserName:name,
                            Verfied:true
                        };
                        setDoc(usersRef, userData)
                        .then(() => {
                            localStorage.setItem('loggedIn', 'true');
                            localStorage.setItem('username', name);
                            window.location.href='index.html';
                        }).catch((error) => {
                            console.error("Error adding user to Firestore", error);
                        });
                    }else{
                        var warn = document.getElementById('warning2');
                        warn.style.display="block";
                    }
                })

                })
                .catch((error) => {
                    console.error("Error adding user to Firestore", error);
                });
            })
            .catch((error) => {
                // Email failed to send
                console.error("Error sending email", error);
                document.getElementById('warning1').style.display = "block";
                document.getElementById("loading").style.display = "none";
            });
    });
/*
    const emailStatus = sendEmail(email,mess);
    setDoc(usersRef, userData)
        .then(() => {
            console.log("User added to Firestore successfully"); 
            if (emailStatus == true){
                document.getElementById("loading").style.display = "none";
                //make OTP visible and hide email textfield
                document.getElementById("otp").style.display = "block";
                document.getElementById("email").style.display = "none";
                var otpMsg = document.getElementById("otpMsg");
                otpMsg.innerText=`otp has sent to ${email}, enter that OTP here.`;
                var otpButton=document.getElementById("otpButton");
                document.getElementById("emailButton").style.display="none";

                otpButton.style.display="block";

                otpButton.addEventListener("click",function(event){
                    event.preventDefault();

                    const input1 = document.getElementById("input1").value;
                    const input2 = document.getElementById("input2").value;
                    const input3 = document.getElementById("input3").value;
                    const input4 = document.getElementById("input4").value;

                    const concatenatedValue = input1 + input2 + input3 + input4;

                    const enteredOTP = parseInt(concatenatedValue, 10);

                    if (otp==enteredOTP){
                        document.getElementById("loading").style.display = "block";
                        const usersRef = doc(db, "Users", email);
                        const userData = {
                            email:email,
                            OTP:otp,
                            UserName:name,
                            Verfied:true
                        };
                        setDoc(usersRef, userData)
                        .then(() => {
                            localStorage.setItem('loggedIn', 'true');
                            localStorage.setItem('username', name);
                            window.location.href='index.html';
                        }).catch((error) => {
                            console.error("Error adding user to Firestore", error);
                        });
                    }else{
                        var warn = document.getElementById('warning2');
                        warn.style.display="block";
                    }
                })
            } else{
                document.getElementById('warning1').style.display="block";
                document.getElementById("loading").style.display = "none";
            } 
        })
        .catch((error) => {
            console.error("Error adding user to Firestore", error);
        });
    })
*/
//OTP ENTER

const inputs = document.getElementById("inputs");
const otpButton = document.getElementById("otpButton");

inputs.addEventListener("input", function (e) {
    const target = e.target;
    const val = target.value;
 
    if (isNaN(val)) {
        target.value = "";
        return;
    }
 
    if (val != "") {
        const next = target.nextElementSibling;
        if (next) {
            next.focus();
        }
    }
});
 
inputs.addEventListener("keyup", function (e) {
    const target = e.target;
    const key = e.key.toLowerCase();
 
    if (key == "backspace" || key == "delete") {
        target.value = "";
        const prev = target.previousElementSibling;
        if (prev) {
            prev.focus();
        }
        return;
    }
    if (key === "enter" || key === "return") {
        e.preventDefault();
        otpButton.click();
    }
});
