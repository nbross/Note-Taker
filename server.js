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
    const newNote = req.body;
    interpretFileAsync('./develop/db/db.json', 'utf8').then(function(data) {
        const newNotes = [].concat(JSON.parse(data));
        newNote.id = newNotes.length + 1
        newNotes.push(newNote);
        return newNotes
    }).then(function(notes) {
        createFileAsync('./develop/db/db.json', JSON.stringify(notes))
        res.json(newNote);
    })
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './develop/public/index.html'));
});

app.delete('/api/notes/:id', function (req, res) {
    console.log("Req.params:", req.params);
    const deleteNote = parseInt(req.params.id);
    console.log(deleteNote);

    for (let i = 0; i < dbJson.length; i++) {
        if (deleteNote === dbJson[i].id) {
            dbJson.splice(i, 1);

            let noteJson = JSON.stringify(dbJson, null, 2);
            writeFileAsync("./develop/db/db.json", noteJson).then(function () {
                console.log("Your note has been deleted!");
            });
        }
    }
    res.json(dbJson);
});


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});