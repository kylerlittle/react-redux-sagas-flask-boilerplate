import rootReducer from '../reducers/JournalReducer';
import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware } from 'redux'
import rootSaga from '../saga/sagas'

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware()

// Mount it on the Store
const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
);

// Then run the root saga
sagaMiddleware.run(rootSaga)

export default store;
