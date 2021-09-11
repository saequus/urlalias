const mongoose = require('mongoose');

const { Schema } = mongoose;

const URLAliasSchema = new Schema({
  from: String, // String is shorthand for {type: String}
  to: String,
});

URLAliasSchema.query.usingFrom = function (from) {
  return this.where({ from: new RegExp(from, 'i') });
};

const URLAlias = mongoose.model('urlaliases', URLAliasSchema);

function failedQueryActiion(err) {
  throw err;
}

async function retrieveAliasesFromDB(limit) {
  if (!limit) limit = 100;
  const urlAliases = await URLAlias.find().limit(limit);
  cleaned = [];
  urlAliases.forEach((u) => cleaned.push({ from: u.from, to: u.to }));
  return cleaned;
}

async function createAliasInDB(from, to) {
  let newAlias = new URLAlias({ from: from, to: to });
  await newAlias.validate();
  newAlias.save((err) => {
    if (err)
      return failedQueryActiion(`Failed to write to db with error: ${err}`);
  });
}

module.exports = {
  retrieveAliasesFromDB,
  URLAlias,
  createAliasInDB,
};
