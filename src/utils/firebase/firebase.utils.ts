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
  NextOrObserver,
  User,
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
  QueryDocumentSnapshot,
} from 'firebase/firestore';

import { Category } from '../../store/categories/category.types';

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

export type ObjectToAdd = {
  title: string;
};

// create the function to add collections
// collectionKey: e.g. 'categories'
// objectsToAdd: json objects data

// #1
export const addCollectionAndDocuments = async <T extends ObjectToAdd>(
  collectionKey: string,
  objectsToAdd: T[]
): Promise<void> => {
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

// #2
export const getCategoriesAndDocuments = async (): Promise<Category[]> => {
  // get the collection reference
  const collectionRef = collection(db, 'categories');

  // generate a query from this collection
  const q = query(collectionRef);

  // get snapshot of the query
  const querySnapshot = await getDocs(q);

  // access the different document snapshots, individual document
  // and transform to our desired data model
  return querySnapshot.docs.map(
    (docSnapshot) => docSnapshot.data() as Category
  );
};

//# 3
export type AdditionalInfo = {
  displayName?: string;
};

export type UserData = {
  displayName: string;
  email: string;
  createdAt: Date;
};

export const createUserDocumentFromAuth = async (
  userAuth: User, // use firebase provided type
  additionalInfo = {} as AdditionalInfo
): Promise<QueryDocumentSnapshot<UserData> | void> => {
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
    } catch (error) {
      console.log('error creating the user', error);
    }
  }

  return userSnapShot as QueryDocumentSnapshot<UserData>;
};

// #4
export const createAuthUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

// #5
export const signInAuthUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutAuthUser = async () => await signOut(auth);

// #6
export const onAuthStateChangedListener = (callback: NextOrObserver<User>) =>
  onAuthStateChanged(auth, callback);

// #7
// convert from an observable listener into a promise based function call
export const getCurrentUser = (): Promise<User | null> => {
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
