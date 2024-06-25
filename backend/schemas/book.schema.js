const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  language: { type: String, required: true },
  url: { type: String },
  stockQuantity: { type: Number, default: 0 },
  author: { type: Schema.Types.ObjectId, ref: 'Author' },
  genre: { type: Schema.Types.ObjectId, ref: 'Genre' },
  publisher: { type: Schema.Types.ObjectId, ref: 'Publisher'},
}, {timestamps: true});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
