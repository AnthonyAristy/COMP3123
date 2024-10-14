const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    noteTitle: {
      type: String,
      required: [true, "Note title is required"],
      minlength: [5, "Title must be at least 5 characters long"],
    },
    noteDescription: {
      type: String,
      required: [true, "Note description is required"],
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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
  },
  { timestamps: true } 
);

noteSchema.methods.isHighPriority = function () {
  return this.priority === "HIGH";
};

const Note = mongoose.model("Note", noteSchema);
module.exports = Note;
