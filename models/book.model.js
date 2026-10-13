const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a book title"],
    trim: true
  },
  author: {
    type: String,
    required: [true, "Please provide a book author"],
    trim: true
  },
  genre: {
    type: String,
    enum: ['fiction', 'science', 'history', 'technology', 'other'],
    default: 'other'
  },
  publishedYear: {
    type: Number,
    min: [1000, "Published year must be 1000 or later"],
    required: false
  },
  shelfLocation: {
    type: String,
    required: false
  },
  totalCopies: {
    type: Number,
    required: [true, "Please provide the total number of copies"],
    min: [1, "Total copies must be at least 1"]
  },
  availableCopies: {
    type: Number,
    min: [0, "Available copies cannot be negative"],
    default: 1
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
},
{
  timestamps: true
}
);

bookSchema.index({ title: 1, author: 1 }, { unique: true });

module.exports = mongoose.model('Book', bookSchema);
