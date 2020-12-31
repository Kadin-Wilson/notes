// notes maps index -> note
// note: note object from class Note
// index: unique Symbol
const notes = new Map();

class Note {
    constructor(title, body) {
        this.title = title;
        this.body = body;
    }

    // return clone of the note
    copy() {
        return new Note(this.title, this.body);
    }
}

// thrown when attempting to use an invalid index
class NoteIndexError extends Error {
    constructor(message) {
        super(message);
        this.name='NoteIndexError';
    }
}



// create a new note
// return it's index
function add(title, body) {
    let noteIndex = Symbol('noteIndex');
    notes.set(noteIndex, new Note(title, body));
    
    return noteIndex;
}

// take a note's index
// return copy of the note
function get(index) {
    if (!notes.has(index)) throw new NoteIndexError('Invalid Index');

    return notes.get(index).copy();
}

// take a note's index and new content
// replace the note with the new content
// return old note
function replace(index, title, body) {
    if (!notes.has(index)) throw new NoteIndexError('Invalid Index');

    let newNote = new Note(title, body);
    let oldNote = notes.get(index);
    notes.set(index, newNote);

    return oldNote;
}

// take a note's index
// destroy the note
// return the destroyed note
function delete(index) {
    if (!notes.has(index)) throw new NoteIndexError('Invalid Index');

    let note = notes.get(index);
    notes.delete(index);

    return note;
}

export {add, get, replace, delete};
