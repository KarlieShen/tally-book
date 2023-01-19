const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  description: {
    type: String,
  },
  time: {
    type: String,
  },
  type: {
    type: String,
    enum: ['Expense', 'Income']
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  amount: {
    type: Number,
  },
});

module.exports = mongoose.model('Bill', BillSchema);