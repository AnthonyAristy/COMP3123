const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); 
const noteRoutes = require("./routes/NoteRoutes"); 

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api", noteRoutes); 

app.get("/", (req, res) => {
  res.send("<h1>Welcome to Note Taking Application</h1>");
});

const DB_URL =
  "mongodb+srv://anthonyaristy2000:12345678#@cluster0.reton.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to the database."))
  .catch((err) => {
    console.error("Cannot connect to the database.", err);
    process.exit();
  });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something broke!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const noteSchema = new mongoose.Schema({
  noteTitle: {
    type: String,
    required: true,
  },
  noteDescription: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ["HIGH", "MEDIUM", "LOW"],
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  dateUpdated: {
    type: Date,
    default: Date.now,
  },
});

const Note = mongoose.model("Note", noteSchema);
module.exports = Note;

const express = require("express");
const router = express.Router();
const noteModel = require("../models/NotesModel");

router.post("/notes", (req, res) => {
  if (!req.body.noteDescription) {
    return res.status(400).send({ message: "Note content cannot be empty" });
  }

  const note = new noteModel({
    noteTitle: req.body.noteTitle,
    noteDescription: req.body.noteDescription,
    priority: req.body.priority,
    dateAdded: Date.now(),
    dateUpdated: Date.now(),
  });

  note
    .save()
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Note.",
      })
    );
});

router.get("/notes", (req, res) => {
  noteModel
    .find()
    .then((notes) => res.send(notes))
    .catch((err) =>
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving notes.",
      })
    );
});

router.get("/notes/:noteId", (req, res) => {
  noteModel
    .findById(req.params.noteId)
    .then((note) => {
      if (!note) {
        return res
          .status(404)
          .send({ message: "Note not found with id " + req.params.noteId });
      }
      res.send(note);
    })
    .catch((err) =>
      res.status(500).send({
        message: "Error retrieving note with id " + req.params.noteId,
      })
    );
});

router.put("/notes/:noteId", (req, res) => {
  if (!req.body.noteDescription) {
    return res.status(400).send({ message: "Note content cannot be empty" });
  }

  noteModel
    .findByIdAndUpdate(
      req.params.noteId,
      {
        noteTitle: req.body.noteTitle,
        noteDescription: req.body.noteDescription,
        priority: req.body.priority,
        dateUpdated: Date.now(),
      },
      { new: true }
    )
    .then((note) => {
      if (!note) {
        return res
          .status(404)
          .send({ message: "Note not found with id " + req.params.noteId });
      }
      res.send(note);
    })
    .catch((err) =>
      res.status(500).send({
        message: "Error updating note with id " + req.params.noteId,
      })
    );
});

router.delete("/notes/:noteId", (req, res) => {
  noteModel
    .findByIdAndRemove(req.params.noteId)
    .then((note) => {
      if (!note) {
        return res
          .status(404)
          .send({ message: "Note not found with id " + req.params.noteId });
      }
      res.send({ message: "Note deleted successfully!" });
    })
    .catch((err) =>
      res.status(500).send({
        message: "Could not delete note with id " + req.params.noteId,
      })
    );
});

module.exports = router;
