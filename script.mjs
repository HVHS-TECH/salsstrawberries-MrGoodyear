//**************************************************************/
// script.mjs
// Generalised firebase routines
// Written by <Your Name Here>, Term 2 202?
//
// All variables & function begin with fb_  all const with FB_
// Diagnostic code lines have a comment appended to them //DIAG
/**************************************************************/
const COL_C = 'white';	    // These two const are part of the coloured 	
const COL_B = '#CD7F32';	//  console.log for functions scheme
console.log('%c fb_io.mjs',
            'color: blue; background-color: white;');

/**************************************************************/
// Import all external constants & functions required
/**************************************************************/
// Import all the methods you want to call from the firebase modules

import { initializeApp } 
    from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

import { getDatabase, set, get, ref}
    from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut}
    from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const FB_GAMECONFIG = {
    apiKey: "AIzaSyD_zaegg9mreIzZMm1V6pCdM2ZZAYOwdsU",
    authDomain: "goodyear-test-2025.firebaseapp.com",
    databaseURL: "https://goodyear-test-2025-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "goodyear-test-2025",
    storageBucket: "goodyear-test-2025.firebasestorage.app",
    messagingSenderId: "373465310863",
    appId: "1:373465310863:web:ec156cfaa84e6d552572fa",
    measurementId: "G-QM7VMFCBJX"
};

// Initialize Firebase
const FB_GAMEAPP = initializeApp(FB_GAMECONFIG);
const FB_GAMEDB  = getDatabase(FB_GAMEAPP);

console.info(FB_GAMEDB);

/**************************************************************/
// EXPORT FUNCTIONS
// List all the functions called by code or html outside of this module
/**************************************************************/

var currentUser = null;
var userId = null;
var emailTemplate = "";

//logs user into database
function fb_authenticate() {
    const AUTH = getAuth();
    const PROVIDER = new GoogleAuthProvider();
    // The following makes Google ask the user to select the account
    PROVIDER.setCustomParameters({
        prompt: 'select_account'
    });
    signInWithPopup(AUTH, PROVIDER).then((result) => {
        currentUser = result.user;
        userId = currentUser.uid;
        console.log("Accepted Log In")
    })
    .catch((error) => {
        console.log("Denied Log In")
    });
}
export { fb_authenticate };

//writes form info to database
function fb_write() {
    if (!currentUser) {
        alert("You must be logged in to submit the form.");
        return;
    }

    var name = document.getElementById("name").value;
    var favoriteFruit = document.getElementById("favoriteFruit").value;
    var fruitQuantity = document.getElementById("fruitQuantity").value;

    // Add additional fields here as needed
    
    const dbReference= ref(FB_GAMEDB, 'users/' + userId);
    set(dbReference, {
        Name: name,
        FavoriteFruit: favoriteFruit,
        FruitQuantity: fruitQuantity
    }).then(() => {
        console.log("Write successful!")
    }).catch((error) => {
        console.log("Error Writing")
    });
}
export { fb_write };

// Displays email undernearth the form
function email_view(){
    if(!currentUser){
        alert("You must be logged in to view email.");
    }
    else{
        //calls read and waits for promise to return before changing email text
        fb_read().then((fb_data) => {
            emailTemplate = `
                <div style="background: #fff0f5; border: 1px solid #ccc; padding: 1rem; border-radius: 8px;">
                    <p>Kia ora ${fb_data.Name},</p>
                    <p>Thank you for joining us at Sal’s Strawberry Saloon (and other fruit products)! We're thrilled to have you as a customer!</p>
                    <p>Based on your preferences, we’ll be sending you personalized recommendations for tasty and healthy treats made with the freshest fruit — especially those ${fb_data.FavoriteFruit} we heard you love!</p>
                    <p>At the moment, we want to offer you a deal to get fresh ${fb_data.FavoriteFruit} ${fb_data.FruitQuantity}x a week!!</p>
                    <p>Ngā mihi nui,</p>
                    <p><em>The Sal’s Strawberry Saloon Team</em></p>
                </div>`
            document.getElementById("emailOutput").innerHTML = emailTemplate;
        }).catch((error) => {
            console.log("error")
        });
    }
}
export { email_view };

//Reads database and returns user data
function fb_read() {
    const dbReference= ref(FB_GAMEDB, 'users/' + userId);
    return get(dbReference).then((snapshot) => {
        var fb_data = snapshot.val();
        if (fb_data != null) {
            console.log(fb_data)
            return(fb_data)
        } else {
            console.log("data is blank")
        }
    }).catch((error) => {
        throw error
    });
}
export { fb_read };

/**************************************************************/
// END OF CODE
/**************************************************************/