import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: "AIzaSyBhc-lZ8XBSMZXy8jSyQqe9oKxk0biY8jc",
  authDomain: "chat-test-4969b.firebaseapp.com",
  databaseURL: "https://chat-test-4969b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-test-4969b",
  storageBucket: "chat-test-4969b.appspot.com",
};
const firebaseApp = initializeApp(config);
const db = getFirestore(firebaseApp);
export default { db };
