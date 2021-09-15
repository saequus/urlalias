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

function failedQueryAction(err) {
  throw err;
}

async function retrieveAliasesFromDB(limit) {
  if (!limit) limit = 100;
  const aliases = await URLAlias.find().limit(limit);
  cleaned = [];
  aliases.forEach((a) => cleaned.push({ source: a.source, slug: a.slug }));
  return cleaned;
}

function updateAliasUsingSlugInDB(alias) {
  URLAlias.updateOne(
    { slug: alias.slug },
    { source: alias.source },
    function (err) {
      if (err) return failedQueryAction(err);
    }
  );
}

function updateAliasUsingSourceInDB(alias) {
  URLAlias.updateOne(
    { source: alias.source },
    { slug: alias.slug },
    function (err) {
      if (err) return failedQueryAction(err);
    }
  );
}

function deleteAliasUsingSourceInDB(source) {
  URLAlias.deleteOne({ source }, function (err) {
    if (err) return failedQueryAction(err);
  });
}

function deleteAliasUsingSlugInDB(slug) {
  URLAlias.deleteOne({ slug }, function (err) {
    if (err) return failedQueryAction(err);
  });
}

async function createAliasInDB(source, slug) {
  let newAlias = new URLAlias({ source: source, slug: slug });
  await newAlias.validate();
  newAlias.save((err) => {
    if (err) failedQueryAction(`Failed to write to db with error: ${err}`);
  });
  return Promise.resolve();
}

module.exports = {
  URLAlias,
  retrieveAliasesFromDB,
  deleteAliasUsingSourceInDB,
  deleteAliasUsingSlugInDB,
  createAliasInDB,
  updateAliasUsingSlugInDB,
  updateAliasUsingSourceInDB,
};
