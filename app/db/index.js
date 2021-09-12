const mongoose = require('mongoose');

const { Schema } = mongoose;

const URLAliasSchema = new Schema({
  source: String, // full url
  slug: String, // short url
});

URLAliasSchema.query.usingSlug = function (slug) {
  return this.where({ slug: new RegExp(slug, 'i') });
};

URLAliasSchema.query.usingSource = function (source) {
  return this.where({ source: new RegExp(source, 'i') });
};

const URLAlias = mongoose.model('urlaliases', URLAliasSchema);

function failedQueryActiion(err) {
  throw err;
}

async function retrieveAliasesFromDB(limit) {
  if (!limit) limit = 100;
  const urlAliases = await URLAlias.find().limit(limit);
  cleaned = [];
  urlAliases.forEach((u) => cleaned.push({ source: u.source, slug: u.slug }));
  return cleaned;
}

async function createAliasInDB(source, slug) {
  let newAlias = new URLAlias({ source: source, slug: slug });
  await newAlias.validate();
  newAlias.save((err) => {
    if (err) failedQueryActiion(`Failed to write to db with error: ${err}`);
  });
  return Promise.resolve();
}

module.exports = {
  retrieveAliasesFromDB,
  URLAlias,
  createAliasInDB,
};
