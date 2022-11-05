import { compose, createStore, applyMiddleware, Middleware } from 'redux';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import logger from 'redux-logger';
// import thunk from 'redux-thunk';
import createSagaMiddleware from '@redux-saga/core';

// import the rootSaga
import { rootSaga } from './root-saga';

// import the combined rootReducer
import { rootReducer } from './root-reducer';

// #1
export type RootState = ReturnType<typeof rootReducer>;

// #2
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

// #4 import PersistConfig type from redux-persist
// extend the PersistConfig type
// narrow down thru an intersection that the whitelist can only contain an array of keys of the RootState
type ExtendedPersistConfig = PersistConfig<RootState> & {
  whitelist: (keyof RootState)[];
};
// type the persistConfig
const persistConfig: ExtendedPersistConfig = {
  key: 'root', // persist the whole thing
  storage, // default to localStroage
  // blacklist: ['user'], // for which reducer we don't want to persist, a list of strings
  whitelist: ['cart'],
};

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// create a persisted reducer, using the config and root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// middlewares are small library helpers run before the action hits the reducer
// before action hits the reducer, it hits the middleware first
// could be more middlewares, [logger, middleware2, middleware3]

// #3 import type Middleware from redux
// use type predicate functions
// if a middleware passes the truthiness check inside the filter, is will be left to use
// if it doesn't pass the check, means it's not a middleware type, it will get filtered out
const middleWares = [
  process.env.NODE_ENV !== 'production' && logger,
  sagaMiddleware,
].filter((middleware): middleware is Middleware => Boolean(middleware));

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

// after the store is created, tell the sagaMiddleware to run
sagaMiddleware.run(rootSaga);

// export a persistent object which calls persistStore
export const persistor = persistStore(store);
