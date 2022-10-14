import { combineReducers, createStore, compose, applyMiddleware } from "redux";
import { persistStore, persistReducer } from 'redux-persist';
import immutableTransform from 'redux-persist-transform-immutable';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import AsyncStorage from '@react-native-community/async-storage';

import eventReducer from './events';
import sourcesReducer from './sources';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];
if (__DEV__ === true) {
  middlewares.push(createLogger({ collapsed: true }))
}

const reducers = combineReducers({
    eventReducer: eventReducer,
    sourcesReducer: sourcesReducer
});

const persistConfig = {
    transforms: [immutableTransform()],
    key: 'root',
    storage: AsyncStorage,
    blacklist: [
      
    ],
    whitelist: [
      'eventReducer',
      'sourcesReducer'
    ],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = compose(applyMiddleware(...middlewares))(createStore)(persistedReducer);
export const persistor = persistStore(store);