# react-redux-sagas-flask-boilerplate



## Description
This is a basic tutorial and boilerplate code on how to set up a web application using React, Redux, Sagas, and Flask. The backend can be swapped with any other technology (e.g. django, Spring, Node.js), but Flask is great for conceptual understanding. We'll make a very very very simplified journaling app.

#### User Scenarios
1. I, the user, can type into a textbox as a journal entry, hit "Enter", and have the information saved.
1. When I, the user, save my journal entry, I will be able to view it in a list of other journal entries and see other information about the journal entry. Specifically, I can see the time created and my predicted mood.

#### Application Data Flow
1. Type journal entry + hit enter.
1. Frontend processes request asynchronously as Redux-Saga.
1. Text is sent to Flask Backend.
1. Backend processes text and constructs a JournalEntry object that has the datetime created, the text, the predicted mood, and an identifier.
1. Backend returns the object.
1. Frontend receives JournalEntry object.
1. Frontend updates Redux Store, adding JournalEntry Object to list of entries.
1. Redux triggers updates to React components because store has been updated.
1. User sees new journal entry in list.



## Requirements
- npm v6.14.8+
- Node.js v12.19.0+
- python 3+



## Tutorial
In this section, we're going to set up a basic frontend that will send a request to our Flask backend and display the results. We also want to use React and Redux in our frontend, so we'll start by designing this. Then, we'll move on to connecting our backend using Sagas.

### Set Up Basic Frontend App Structure
```
cd frontend
npm init # initialize the frontend app, name the app `journal`
npm install @reduxjs/toolkit
npx create-react-app journal --template redux
cd journal # go into the app
npm start # fire it up
```
Head on over to http://localhost:3000/ and make sure your app is running okay.


Now let's set up a slightly better structure with better software engineering patterns.
```
cd src
mkdir components reducers actions containers
touch components/Journal.js reducers/JournalReducer.js containers/JournalContainer.js actions/JournalActions.js
rm -rf features
```

Now, because this is a tutorial, let's be lazy and use bootstrap to design our components.
```
npm install react-bootstrap bootstrap
```

Then add the following line to your `index.js` or `src/App.js` file:
```javascript
import 'bootstrap/dist/css/bootstrap.min.css';
```

Great. Now we can use bootstrap for our components.

### Set Up Data Flow + Components
Here are your components
#### `components/Journal.js`
The goal is to create a component that has an input textbox and renders journal entries. Without any knowledge of Redux, you design a React Component that can do these things. This means your props (data you pass to your component) will be something like:
```javascript
Journal.propTypes = {
    onSubmitJournalEntry: PropTypes.func.isRequired,
    journalEntries: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            timeCreated: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
            mood: PropTypes.string.isRequired,
        }).isRequired
    ).isRequired,
};
```

#### `actions/JournalActions.js`
Actions are payloads of information that send data from your application to your store. They are the only source of information for the store. You send them to the store using store.dispatch(). In our case, we will have one action: a `submitJournal` action which will have a text payload and a type.
```javascript
// Action Types
export const SUBMIT_JOURNAL = 'SUBMIT_JOURNAL';

// Action Creators
export function submitJournal(text) {
    return {
        type: SUBMIT_JOURNAL,
        text,
    }
}
```

#### `reducers/JournalReducer.js`
Reducers specify how the application's state changes in response to actions sent to the store. In this case, we need to specify how the state should change in response to a `submitJournal` action.
```javascript
const initialState = {
    journalEntries: [],
};

function journalReducer(state = initialState, action) {
    switch (action.type) {
        case SUBMIT_JOURNAL:
            // Stub code
            return { ...state, journalEntries: {
                ...state.journalEntries,
                text: action.text,
                ...
            }];
        default:
            return state;
    }
};
```

#### `containers/JournalContainer.js`
The cool part about Redux is that the `Journal.js` component is independent of the application state (data). We will now connect our Redux store (application state/data) to our component.

You define `mapDispatchToProps` and `mapStateToProps` to specify callbacks and props you want to pass to your component. In this file, you have access to the Redux Store. Connect them using
```javascript
const JournalContainer = connect(mapStateToProps, mapDispatchToProps)(Journal)
```

#### `app/store.js`
Now, we need to ensure our application specifies its reducers
```javascript
export default configureStore({
  reducer: journalReducer,
});
```



### Connecting Frontend with Backend Using Sagas
Once we're sure data is flowing correctly, let's connect our front-end to our backend using sagas. Our saga will be responsible for retrieving data from the backend! Let's start by setting up a very very very simple backend.



### Set Up the Backend
In this section, we'll set up a basic backend with Flask that will have a single endpoint and handle requests from the frontend.
```
cd backend
python3 -m venv venv # create virtual environment
source venv/bin/activate # activate virtual environment
pip install flask
```

Now let's set up a very very simple Flask app.
```
mkdir journalengine
echo "from flask import Flask\n\napp = Flask(__name__)\n\nfrom journalengine import routes\n" > journalengine/__init__.py
echo "from journalengine import app\n" > journalengine/__main__.py
echo "from journalengine import app\n\n@app.route('/')\n@app.route('/index')\ndef index():\n    return 'Hello, World!'\n" > journalengine/routes.py
export FLASK_APP=journalengine
```

Now make sure it runs.
```
flask run
```

Now, let's quickly make a route that will create our `JournalEntry` object from the user. We'll accept a payload with text, and return a payload with text, date, id, and mood.
```python
@app.route('/', methods=['POST'])
def index():
    if request.method == 'POST':
        # Get journal entry text JSON
        journal_entry_text = request.json['text']
        
        # Create JournalEntry Object
        journal_entry = {
            'id': next(counter),
            'timeCreated': strftime("%I:%M:%S %p", gmtime()),
            'text': journal_entry_text,
            'mood': predict_mood(journal_entry_text)
        }
        
        # Return as JSON
        return jsonify(journal_entry)
    else:
        return 'ERROR - only accepting POST requests'
```

Lastly, because we're running the frontend and backend on two different ports, we'll have to enable CORS.
```
pip install flask-cors
```

Wrap your request handler (index functin) with the `@cross_origin()` decorator and where you instantiated your Flask app, add the following immediately below:
```python
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
```

### Set Up Sagas
Back in `frontend/journal/src`, let's add our Saga middleware.
```
npm install --save redux-saga
mkdir saga
touch saga/sagas.js
```

Update your `store.js` file to look like:
```javascript
import journalReducer from '../reducers/JournalReducer';
import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware } from 'redux'
import rootSaga from '../saga/sagas'

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware()

// Mount it on the Store
const store = createStore(
  journalReducer,
  applyMiddleware(sagaMiddleware)
);

// Then run the root saga
sagaMiddleware.run(rootSaga)

export default store;
```

Note, you will need to create a `rootSaga` in `sagas.js`

Let this be:
```javascript
function* handleSubmitJournal(action) {}
function* watchForJournalActions() {
    yield takeLatest(SUBMIT_JOURNAL, handleSubmitJournal);
}

export default function* rootSaga() {
    yield all([watchForJournalActions()]);
}
```

The syntax may look weird... but it's actually quite simple. `yield all` says to wait for all Sagas in the list you pass it to complete. `takeLatest` inside `watchForJournalActions` forks a saga task in the background anytime `SUBMIT_JOURNAL` pattern is matched and uses `handleSubmitJournal` as the callback. In this way, it's constantly waiting. Next, let's write that handler.

```javascript
function* handleSubmitJournal(action) {
    // Action contains journal entry
    const journalText = _.pick(action, 'text');

    // Send to backend
    const journalEntry = yield fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(journalText)
    })
    .then(response => response.json());

    // Update Redux Store
    yield put({ type: UPDATE_JOURNAL_ENTRIES, journalEntry });
}
```

Note - in order to update the Redux Store, I created a new action. Since the `SUBMIT_JOURNAL` action is now being handled by the Saga, we can ignore it in our reducer. Your reducer should now look like:
```javascript
function journalReducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_JOURNAL_ENTRIES:
            return {
                ...state,
                journalEntries: [...state.journalEntries, action.journalEntry],
            };
        case SUBMIT_JOURNAL:
        default:
            return state;
    }
};
```

Awesome! We should be good to go.

## Closing Thoughts
This is just a demo for proof-of-concept and to hopefully teach y'all a few new technologies. In practice, you'd probably want to implement things differently. For instance, you would almost certainly prefer to have your journal entries stored in the backend; otherwise, they will not persist.