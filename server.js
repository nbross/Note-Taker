// Dependencies
const express = require('express');
const util = require('util');
const path = require('path');
const fs = require('fs');
const interpretFileAsync = util.promisify(fs.readFile);
const createFileAsync = util.promisify(fs.writeFile);
// boilerplate server setup
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./develop/public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './develop/public/notes.html'));
});

app.get('/api/notes', function(req, res) {
    interpretFileAsync('./develop/db/db.json', 'utf8').then(function(data) {
        notes = [].concat(JSON.parse(data))
        res.json(notes);
    })
});

app.post('/api/notes', function(req, res) {
    const createNote = req.body;
    interpretFileAsync('./develop/db/db.json', 'utf8').then(function(data) {
        const createNotes = [].concat(JSON.parse(data));
        createNote.id = createNotes.length + 1
        createNotes.push(createNote);
        return createNotes
    }).then(function(notes) {
        createFileAsync('./develop/db/db.json', JSON.stringify(notes))
        res.json(createNote);
    })
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './develop/public/index.html'));
});

app.delete('/api/notes/:id', function (req, res) {
    const deleteNote = parseInt(req.params.id);
    interpretFileAsync('./develop/db/db.json', 'utf8').then(function(data) {
        const createdNotes = [].concat(JSON.parse(data));
        const createdNoteText = []
        for (let i = 0; i<notes.length; i++) {
            if(deleteNote !== createdNotes[i].id) {
                createdNoteText.push(createdNotes[i])
            }
        }
        return createdNoteText
    }).then (function(notes) {
        createFileAsync('./develop/db/db.json', JSON.stringify(notes))
        res.send('congrats the note was saved!')
    })
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});