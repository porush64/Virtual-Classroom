import firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-vzXmaacxDH5g1ozx8mzmBYpEaT1lA6Y",
  authDomain: "virtual-classroom-286fd.firebaseapp.com",
  projectId: "virtual-classroom-286fd",
  storageBucket: "virtual-classroom-286fd.appspot.com",
  messagingSenderId: "178240767623",
  appId: "1:178240767623:web:ffa648c89d37150a0eda22",
  measurementId: "G-FTVW2BGH7P",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export { auth, provider, storage };
export default db;
