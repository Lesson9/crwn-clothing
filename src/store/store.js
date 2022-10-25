import { compose, createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import logger from 'redux-logger';

// import the combined rootReducer
import { rootReducer } from './root-reducer';

const persistConfig = {
  key: 'root', // persist the whole thing
  storage, // default to localStroage
  blacklist: ['user'], // for which reducer we don't want to persist, a list of strings
};

// create a persisted reducer, using the config and root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// middlewares are small library helpers run before the action hits the reducer
// before action hits the reducer, it hits the middleware first
// could be more middlewares, [logger, middleware2, middleware3]
const middleWares = [process.env.NODE_ENV !== 'production' && logger].filter(
  Boolean
);

const composeEnhancer =
  (process.env.NODE_ENV !== 'production' &&
    window &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

// middlewares are somehing like enhancers
const composedEnhancers = composeEnhancer(applyMiddleware(...middleWares));

// create and export the store
// rootReducer: Required for generating the store
// 2nd parameter: additional default states, make it easier to test
// 3rd parameter: middlewares
export const store = createStore(
  persistedReducer, // change to the persistedReducer
  undefined,
  composedEnhancers
);

// export a persistent object which calls persistStore
export const persistor = persistStore(store);
