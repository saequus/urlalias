const mongoose = require('mongoose');

const { Schema } = mongoose;

const urlSchema = new Schema({
  from: String, // String is shorthand for {type: String}
  to: String,
});

urlSchema.query.usingFrom = function (from) {
  return this.where({ from: new RegExp(from, 'i') });
};

const UrlAlias = mongoose.model('urlaliases', urlSchema);

async function getAllUrls() {
  const urlAliases = await UrlAlias.find().limit(100);
  if (urlAliases) {
    return urlAliases;
  }
  return [];
}

module.exports = {
  getAllUrls,
  UrlAlias,
};
