
// Action Types
export const SUBMIT_JOURNAL = 'SUBMIT_JOURNAL';
export const UPDATE_JOURNAL_ENTRIES = 'UPDATE_JOURNAL_ENTRIES';

// Action Creators
export function submitJournal(text) {
    return {
        type: SUBMIT_JOURNAL,
        text,
    }
}
export function updateJournalEntries(journalEntry) {
    return {
        type: UPDATE_JOURNAL_ENTRIES,
        journalEntry
    }
}