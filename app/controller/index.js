const { URLAlias, createAliasInDB, retrieveAliasesFromDB } = require('../db');

function redirectUsingAlias(req, res) {
  URLAlias.findOne()
    .usingFrom(req.params.from)
    .exec((err, alias) => {
      if (alias) {
        res.redirect(alias.to);
        return Promise.resolve();
      } else if (err) {
        throw err;
      } else {
        'Short URL (or alias) not found.'
      }
    });
}

async function getAliases(req, res) {
  const aliases = await retrieveAliasesFromDB();
  res.status(200).json(aliases);
}

// Views

function mainpage(req, res) {
  res.send('Mainpage');
}

// REST API

function getURLAlias(req, res) {
  const from = req.query.from;
  const to = req.query.to;
  res.status(200).json({'status': 'created_new_alias', 'from': from, 'to': to});
}

function createURLAlias(req, res) {
  const from = req.body.from;
  const to = req.body.to;
  if (!from || !to) res.status(400).json({'status': 'error', 'error': 'required "from" and "to" params in request body'});
  createAliasInDB(from, to);
  res.status(200).json({'status': 'ok', 'from': from, 'to': to});
}

module.exports = {
  redirectUsingAlias,
  getAliases,
  createURLAlias,
  mainpage,
};
