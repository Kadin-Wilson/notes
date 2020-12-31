import * as LS from './localStorage.js';

class Note {
    constructor(title, body) {
        this.title = title;
        this.body = body;
    }

    // return clone of the note
    static copy(note) {
        return new Note(note.title, note.body);
    }
}

// thrown when attempting to use an invalid index
class NoteIndexError extends Error {
    constructor(message) {
        super(message);
        this.name='NoteIndexError';
    }
}


// ugly way to get unique strings
function getIndexGenerator() {
    function* generateIndex() {
        let index = 0;
        
        while (true) {
            yield String(index++);
        }
    }

    const generator = generateIndex();

    return function () { return generator.next().value };
}
const getIndex = getIndexGenerator();


// create a new note
// return it's index
function add(title, body) {
    let noteIndex = getIndex();
    LS.set(noteIndex, new Note(title, body));
    
    return noteIndex;
}

// take a note's index
// return copy of the note
function get(index) {
    if (!LS.has(index)) throw new NoteIndexError('Invalid Index');

    return LS.get(index);
}

// take a note's index and new content
// replace the note with the new content
// return old note
function replace(index, title, body) {
    if (!LS.has(index)) throw new NoteIndexError('Invalid Index');

    let newNote = new Note(title, body);
    let oldNote = LS.get(index);
    LS.set(index, newNote);

    return oldNote;
}

// take a note's index
// destroy the note
// return the destroyed note
function remove(index) {
    if (!LS.has(index)) throw new NoteIndexError('Invalid Index');

    let note = LS.get(index);
    LS.remove(index);

    return note;
}

// run the given function for every key
function load(func) {
    for (let i = 0; i < localStorage.length; ++i) {
        func(localStorage.key(i));
    }
}

export {add, get, replace, remove, load};
