import * as Notes from './notes.js';


// load saved notes
Notes.load(addNote);

// set initial active note
let activeNote = null;
if(document.querySelector('.note'))
    makeActiveNote.call(document.querySelector('.note'));

let saveBtn = document.querySelector('.save');
saveBtn.addEventListener('click', save);

let deleteBtn = document.querySelector('.delete');
deleteBtn.addEventListener('click', remove);

let addBtn = document.querySelector('.add');
addBtn.addEventListener('click', newNote);

// either create a new note or update active note's content
function save() {
    if(activeNote === null) { // if a note is currently active
        let {title, body} = getContent();
        let index = Notes.add(title, body);
        makeActiveNote.call(addNote(index)); // build a note element & set as active
    }
    else { // if a note is active
        let {title, body} = getContent();
        Notes.replace(activeNote.noteIndex, title, body);
        updateNote();
    }
}

// remove the currently active note
function remove() {
    if (activeNote === null) return; // can't remove nonexistent note

    Notes.remove(activeNote.noteIndex);
    
    // find note to pass Active to
    let adjacentNote = activeNote.nextElementSibling;
    if (adjacentNote && !adjacentNote.classList.contains('note')) 
        adjacentNote = activeNote.previousElementSibling;

    activeNote.remove();
    onOverflow();

    if (adjacentNote)
        makeActiveNote.call(adjacentNote);
    else
        newNote();
}

// takes a note index and returns a constructed note element
function addNote(index) {
    let {title, body} = Notes.get(index);

    // build note element
    let noteElm = document.createElement('div');
    noteElm.classList.toggle('note');

    let titleElm = document.createElement('h2');
    titleElm.textContent = title;
    let bodyElm = document.createElement('p');
    bodyElm.textContent = body;

    noteElm.append(titleElm, bodyElm);
    noteElm.noteIndex = index;

    // add to document
    document.querySelector('.note_list').prepend(noteElm);

    noteElm.addEventListener('click', makeActiveNote);
    
    onOverflow();

    return noteElm;
}

// updates the note element for the currently active note
function updateNote() {
    let {title, body} = Notes.get(activeNote.noteIndex);

    activeNote.querySelector('h2').textContent = title;
    activeNote.querySelector('p').textContent = body;
}

// clear out the active note so we can make a new note
function newNote() {
    setContent('', '');

    if (activeNote !== null) activeNote.classList.remove('active'); // style for active note
    activeNote = null;
}

// takes 'this' object and makes it active note
function makeActiveNote() {
    if (activeNote !== null) activeNote.classList.remove('active'); // style for active note
    activeNote = this;
    activeNote.classList.add('active'); // style for active note

    let {title, body} = Notes.get(this.noteIndex);
    setContent(title, body);
}

// get content from our inputs
function getContent() {
    let titleInputElm = document.querySelector('input');
    let bodyInputElm = document.querySelector('textarea');

    let title = titleInputElm.value || 'Title Your Note';
    let body = bodyInputElm.value || 'Type your note here.';

    return {title, body};
}

// set the content in the input fields
function setContent(title, body) {
    let titleInputElm = document.querySelector('input');
    let bodyInputElm = document.querySelector('textarea');

    titleInputElm.value = title;
    bodyInputElm.value = body;
}

// reposition the add button if note_list is overflowing
function onOverflow() {
    let noteList = document.querySelector('.note_list');

    if (noteList.scrollHeight > noteList.clientHeight
            && !document.querySelector('.button_container')) { 
        let btnContainer = document.createElement('div');
        btnContainer.classList.add('button_container');

        noteList.parentNode.append(btnContainer);
        btnContainer.append(addBtn);
    }

    else if (noteList.scrollHeight <= noteList.clientHeight
            && document.querySelector('.button_container')) { 
        noteList.append(addBtn);
        document.querySelector('.button_container').remove();
    }

}
