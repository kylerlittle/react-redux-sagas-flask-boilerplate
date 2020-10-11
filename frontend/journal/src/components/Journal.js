import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table'

class Journal extends React.Component {
    constructor(props) {
        super(props);
        // Create a reference so we can get this data to submit into our form
        this.formText = React.createRef();
    }

    /**
     * Helper function to render journal form
     */
    renderJournalForm() {
        return <Form>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Journal Entry</Form.Label>
                <Form.Control type="text" placeholder="Write your thoughts." ref={this.formText} />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={(e) => {
                // Critical to prevent default behavior - otherwise, default behavior will cause re-render and you lose your data
                e.preventDefault();

                // Callback to submit journal entry
                this.props.onSubmitJournalEntry(this.formText.current.value);
            }}>
                Submit
            </Button>
        </Form>;
    }

    /**
     * Helper function to format journal entries
     */
    formatJournalEntries() {
        return this.props.journalEntries.map((journalEntry) => {
            return <tr key={journalEntry.id}>
                <td>{journalEntry.timeCreated}</td>
                <td>{journalEntry.text}</td>
                <td>{journalEntry.mood}</td>
            </tr>
        })
    }

    /**
     * Helper function to render journal entries
     */
    renderJournalEntries() {
        return <Table striped={true} bordered={true} hover>
            <thead>
                <tr>
                    <th>Date Created</th>
                    <th>Text</th>
                    <th>Predicted Mood</th>
                </tr>
            </thead>
            <tbody>
                {this.formatJournalEntries()}
            </tbody>
        </Table>;
    }

    /**
     * Render function
     */
    render() {
        return <>
            {this.renderJournalForm()}
            <br />
            {this.renderJournalEntries()}
        </>;
    }
}

/**
 * Define prop types. I'd recommend using TypeScript over doing this.
 */
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

export default Journal;
