const addTitle = document.getElementById("addTitle");
const addText = document.getElementById("addText");
const addNoteButton = document.getElementById("addNote");
const notesDiv = document.getElementById("notes");
const deletedNotesDiv = document.getElementById("deletedNotes");
const archivedNotesDiv = document.getElementById("archivedNotes");

localStorage.removeItem("deletedNotes");
localStorage.removeItem("archivedNotes");

showNotes();

function addNotes() {
  let notes = localStorage.getItem("notes");
  if (notes === null) {
    notes = [];
  } else {
    notes = JSON.parse(notes);
  }

  if (addText.value == "") {
    alert("Add your note");
    return;
  }

  const noteObj = {
    title: addTitle.value,
    text: addText.value,
    reminder: null,
  };

  const addReminder = document.getElementById("addReminder").value;
  noteObj.reminder = addReminder ? new Date(addReminder).toISOString() : null;

  addTitle.value = "";
  addText.value = "";
  notes.push(noteObj);
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();
}

function showNotes() {
  let notesHTML = "";
  let notes = localStorage.getItem("notes");
  if (notes === null) {
    return;
  } else {
    notes = JSON.parse(notes);
  }

  // Sort the notes by title in ascending order
  notes.sort((a, b) => a.title.localeCompare(b.title));

  for (let i = 0; i < notes.length; i++) {
    notesHTML += `<div class="note">
                    <span class="title">${
                      notes[i].title === "" ? "Note" : notes[i].title
                    }</span>
                    <div class="text">${notes[i].text}</div>
                    <button class="editNote" id="${i}" onclick="editNote(${i})">Edit</button>
                    <div class="reminder">${
                      notes[i].reminder
                        ? "Reminder: " +
                          new Date(notes[i].reminder).toLocaleString()
                        : ""
                    }</div>
                    <button class="deleteNote" id=${i} onclick="deleteNote(${i})">Delete</button>
                    <button class="archiveNote" id="${i}" onclick="archiveNote(${i})">Archive</button>    
                </div>
        `;
  }

  notesDiv.innerHTML = notesHTML;
}

function deleteNote(ind) {
  let notes = localStorage.getItem("notes");
  if (notes === null) {
    return;
  } else {
    notes = JSON.parse(notes);
  }

  const deletedNote = {
    ...notes[ind],
    deleted: new Date().toISOString(),
  };
  let deletedNotes = localStorage.getItem("deletedNotes");
  if (deletedNotes === null) {
    deletedNotes = [];
  } else {
    deletedNotes = JSON.parse(deletedNotes);
  }
  deletedNotes.push(deletedNote);
  localStorage.setItem("deletedNotes", JSON.stringify(deletedNotes));

  notes.splice(ind, 1);
  localStorage.setItem("notes", JSON.stringify(notes));

  showNotes();
  showDeletedNotes();
}

addNoteButton.addEventListener("click", addNotes);

//Delete

function showDeletedNotes() {
  let deletedNotesHTML = "";

  let deletedNotes = localStorage.getItem("deletedNotes");

  if (deletedNotes === null) {
    return;
  } else {
    deletedNotes = JSON.parse(deletedNotes);
  }

  for (let i = 0; i < deletedNotes.length; i++) {
    deletedNotesHTML += `
      <div class="note deleted">
        <span class="title">${
          deletedNotes[i].title === "" ? "Note" : deletedNotes[i].title
        }</span>
        <div class="text">${deletedNotes[i].text}</div>
        <div class="deletedDate">${new Date(
          deletedNotes[i].deleted
        ).toLocaleString()}</div>
      </div>
    `;
  }

  deletedNotesDiv.innerHTML = deletedNotesHTML;
}

// 2. Archive Note
function archiveNote(ind) {
  let notes = localStorage.getItem("notes");

  if (notes === null) {
    return;
  } else {
    notes = JSON.parse(notes);
  }

  const note = notes[ind];

  if (note.title === "" || note.text === "") {
    return;
  }

  const archivedNote = {
    title: note.title,
    text: note.text,
    archived: new Date().toISOString(),
  };

  let archivedNotes = localStorage.getItem("archivedNotes");

  if (archivedNotes === null) {
    archivedNotes = [];
  } else {
    archivedNotes = JSON.parse(archivedNotes);
  }

  archivedNotes.push(archivedNote);

  localStorage.setItem("archivedNotes", JSON.stringify(archivedNotes));

  notes.splice(ind, 1);

  localStorage.setItem("notes", JSON.stringify(notes));

  showNotes();
  showArchivedNotes();
}

function showArchivedNotes() {
  let archivedNotesHTML = "";

  let archivedNotes = localStorage.getItem("archivedNotes");

  if (archivedNotes === null) {
    return;
  } else {
    archivedNotes = JSON.parse(archivedNotes);
  }

  for (let i = 0; i < archivedNotes.length; i++) {
    archivedNotesHTML += `
      <div class="note archived">
        <span class="title">${
          archivedNotes[i].title === "" ? "Note" : archivedNotes[i].title
        }</span>
        <div class="text">${archivedNotes[i].text}</div>
        <div class="archivedDate">${new Date(
          archivedNotes[i].archived
        ).toLocaleString()}</div>
      </div>
    `;
  }

  archivedNotesDiv.innerHTML = archivedNotesHTML;
}

function editNote(ind) {
  let notes = localStorage.getItem("notes");

  if (notes === null) {
    return;
  } else {
    notes = JSON.parse(notes);
  }

  const note = notes[ind];

  if (note.title === "" || note.text === "") {
    return;
  }

  const editedtitleNote = prompt("Edit your title of the note", note.title);

  if (editedtitleNote === null) {
    return;
  }

  const editeddescNote = prompt("Edit your description of the note", note.text);

  if (editeddescNote === null) {
    return;
  }

  const editedReminderNote = prompt(
    "Set a reminder date and time (YYYY-MM-DD HH:MM)",
    note.reminder
  );
  if (editedReminderNote === null) {
    return;
  }

  note.title = editedtitleNote;
  note.text = editeddescNote;
  note.reminder = editedReminderNote
    ? new Date(editedReminderNote).toISOString()
    : null;

  localStorage.setItem("notes", JSON.stringify(notes));

  showNotes();
}
