// import createContext
import { createContext, useState, useEffect } from 'react';

import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
} from '../utils/firebase/firebase.utils';

// Create the context, passing in default values as an object
// Actual storage place with actual values you want to access
export const UserContext = createContext({
  currentUser: null, // default object null
  setCurrentUser: () => null, // default empty function
});
UserContext.displayName = '###My User Context';

// Create and export the provider
// Component that wraps around its children, so any of its child can access the context
export const UserProvider = ({ children }) => {
  // construct the value we would like to access in children components
  const [currentUser, setCurrentUser] = useState(null);
  const value = { currentUser, setCurrentUser };

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        createUserDocumentFromAuth(user);
      }
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  // return context provider, passing in the value to a value property
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
