document.addEventListener('DOMContentLoaded', () => {
    const newButton = document.querySelector('.btn-new');
    const saveButton = document.querySelector('.btn-primary');
    const cancelButton = document.querySelector('.btn-secondary');
    const formContainer = document.querySelector('.form-container');
    const titleInput = document.querySelector('.title');
    const contentInput = document.querySelector('.content');
    const timestampDiv = document.querySelector('.timestamp');
    const notesContainer = document.querySelector('.menu');

    newButton.addEventListener('click', () => {
        clearForm();
        formContainer.style.display = 'block';
    });

    saveButton.addEventListener('click', saveNote);
    cancelButton.addEventListener('click', () => {
        formContainer.style.display = 'none';
    });

    function saveNote() {
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        if (title && content) {
            const note = {
                title,
                content,
                timestamp: new Date().toLocaleString()
            };
            addNoteToMenu(note);
            saveNoteToLocalStorage(note);
            formContainer.style.display = 'none';
            clearForm();
        } else {
            contentInput.value('Please enter both title and content');
        }
    }

    function addNoteToMenu(note) {
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('note');
        
        const noteTitle = document.createElement('div');
        noteTitle.classList.add('menu-title');
        noteTitle.textContent = note.title;
        
        const deleteButton = document.createElement('div');
        deleteButton.classList.add('delete');
        deleteButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent note click event, had to ask Chat GPT about this one
            deleteNoteFromMenu(noteDiv);
            deleteNoteFromLocalStorage(note);
        });
        
        const titleContainer = document.createElement('div');
        titleContainer.classList.add('title-container');
        titleContainer.appendChild(noteTitle);
        titleContainer.appendChild(deleteButton);
        
        noteDiv.appendChild(titleContainer);
        
        noteDiv.addEventListener('click', () => {
            displayNoteInForm(note);
        });
        
        notesContainer.appendChild(noteDiv);
    }

    function displayNoteInForm(note) {
        titleInput.value = note.title;
        contentInput.value = note.content;
        timestampDiv.textContent = note.timestamp;
        formContainer.style.display = 'block';
    }

    function saveNoteToLocalStorage(note) {
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    function deleteNoteFromMenu(noteDiv) {
        notesContainer.removeChild(noteDiv);
    }

    function deleteNoteFromLocalStorage(note) {
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes = notes.filter(n => n.timestamp !== note.timestamp);
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    function clearForm() {
        titleInput.value = '';
        contentInput.value = '';
        timestampDiv.textContent = '';
    }

    function loadNotesFromLocalStorage() {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.forEach(addNoteToUI);
    }

    loadNotesFromLocalStorage();
});
