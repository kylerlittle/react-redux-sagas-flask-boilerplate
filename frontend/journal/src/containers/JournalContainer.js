
import { submitJournal } from '../actions/JournalActions'
import { connect } from 'react-redux'
import Journal from '../components/Journal'

const mapStateToProps = state => {
    return {
        journalEntries: state.journalEntries,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSubmitJournalEntry: text => {
            dispatch(submitJournal(text))
        }
    }
}

const JournalContainer = connect(mapStateToProps, mapDispatchToProps)(Journal)

export default JournalContainer