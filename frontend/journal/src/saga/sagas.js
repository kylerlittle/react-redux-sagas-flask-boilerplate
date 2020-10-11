import { all, put, takeLatest } from 'redux-saga/effects';
import _ from 'lodash';

import {SUBMIT_JOURNAL, UPDATE_JOURNAL_ENTRIES} from '../actions/JournalActions'

const endpoint = 'http://localhost:5000'

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

function* watchForJournalActions() {
    yield takeLatest(SUBMIT_JOURNAL, handleSubmitJournal);
}

export default function* rootSaga() {
    yield all([watchForJournalActions()]);
}