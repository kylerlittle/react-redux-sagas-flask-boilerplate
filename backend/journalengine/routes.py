from journalengine import app
from flask import request, jsonify
import itertools
from datetime import datetime
from time import gmtime, strftime
from flask_cors import cross_origin

counter = itertools.count()
moods = ['Happy', 'Sad', 'Why does 2020 suck so badly?!', 'Frustrated']

def predict_mood(text):
    return moods[len(text) % len(moods)]

@app.route('/', methods=['POST'])
@cross_origin()
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
