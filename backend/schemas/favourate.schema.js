const mongoose = require('mongoose');
const Schema = mongoose.Schema

const favourateSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    book: { type: Schema.Types.ObjectId, ref: 'Book'}
}, {timestamps: true})

const Favourate = mongoose.model('Favourate', favourateSchema)
module.exports = Favourate