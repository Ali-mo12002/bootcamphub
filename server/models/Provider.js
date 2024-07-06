
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const providerSchema = new Schema({
  name: { type: String, required: true },
  location: { type: String },
  website: { type: String },
});

const Provider = mongoose.model('Provider', providerSchema);

module.exports = Provider;
