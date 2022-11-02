import { initializeApp } from 'firebase/app';

import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyByaHyfLS2D05K_SOe57deT-eQM60gQXDk',
  authDomain: 'crwn-clothing-db-85214.firebaseapp.com',
  projectId: 'crwn-clothing-db-85214',
  storageBucket: 'crwn-clothing-db-85214.appspot.com',
  messagingSenderId: '1052994562017',
  appId: '1:1052994562017:web:50e091b49d69a850aa94a0',
};

const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

export const auth = getAuth(firebaseApp);

export const signInWIthGooglePopup = () =>
  signInWithPopup(auth, googleProvider);

export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, googleProvider);

// create the database to our console
export const db = getFirestore();

// create the function to add collections
// collectionKey: e.g. 'categories'
// objectsToAdd: json objects data
export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  // get or create a collection reference with the name of collectionKey
  const collectionRef = collection(db, collectionKey);

  // create a batch instance
  const batch = writeBatch(db);

  // for each object data in our json data
  objectsToAdd.forEach((object) => {
    // create a document for each object with the object.title as the key/name
    const docRef = doc(collectionRef, object.title.toLowerCase());

    // set the object into each document in firebase
    batch.set(docRef, object);
  });

  // fire the transaction
  await batch.commit();
  console.log('done');
};

export const getCategoriesAndDocuments = async () => {
  // get the collection reference
  const collectionRef = collection(db, 'categories');

  // generate a query from this collection
  const q = query(collectionRef);

  // get snapshot of the query
  const querySnapshot = await getDocs(q);

  // access the different document snapshots, individual document
  // and transform to our desired data model
  return querySnapshot.docs.map((docSnapshot) => docSnapshot.data());
};

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInfo = {}
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, 'users', userAuth.uid);
  const userSnapShot = await getDoc(userDocRef);

  if (!userSnapShot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInfo,
      });
    } catch (err) {
      console.log('error creating the user', err.message);
    }
  }

  return userSnapShot;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutAuthUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

// convert from an observable listener into a promise based function call
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (userAuth) => {
        unsubscribe();
        resolve(userAuth);
      },
      reject
    );
  });
};
