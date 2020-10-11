import {
    SUBMIT_JOURNAL,
    UPDATE_JOURNAL_ENTRIES
} from '../actions/JournalActions'

const initialState = {
    journalEntries: [],
};

function rootReducer(state = initialState, action) {
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

export default rootReducer;