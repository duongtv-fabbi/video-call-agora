import firebase from "firebase";
import "firebase/firestore";

console.log(firebase)
var config = {
    apiKey: "AIzaSyBhc-lZ8XBSMZXy8jSyQqe9oKxk0biY8jc",
    authDomain: "chat-test-4969b.firebaseapp.com",
    databaseURL: "https://chat-test-4969b.firebaseio.com",
    projectId: "chat-test-4969b",
    storageBucket: "chat-test-4969b.appspot.com",
    messagingSenderId: "864076461266",
};

var fire = firebase.initializeApp(config);
export default fire;