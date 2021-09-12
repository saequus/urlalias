const { URLAlias, createAliasInDB, retrieveAliasesFromDB } = require('../db');
const { buildSlug } = require('../logic/alias');

function redirectUsingSlug(req, res) {
  if (!req.params.slug) {
    res.status(404).json({ status: 'error', error: 'not found slug' });
  }

  URLAlias.findOne()
    .usingSlug(req.params.slug)
    .exec((err, alias) => {
      if (err) throw err;

      if (alias && alias.source) {
        res.redirect(alias.source);
        return Promise.resolve();
      }

      res
        .status(404)
        .json({ status: 'error', error: 'short URL (or alias) not found.' });
      return;
    });
}

async function getAliases(req, res) {
  const aliases = await retrieveAliasesFromDB();
  res.status(200).json(aliases);
}

// Views

function mainpage(req, res) {
  res.render('mainpage');
}

// REST API

function getURLAlias(req, res) {
  const source = req.query.source;
  const slug = req.query.slug;
  res
    .status(200)
    .json({ status: 'created_new_alias', source: source, slug: slug });
}

function createURLAlias(req, res) {
  const source = req.body.source;
  const slug = req.body.slug;
  if (!source || !slug) {
    res.status(400).json({
      status: 'error',
      error: 'required source and slug params in request body',
    });
    return;
  }

  URLAlias.findOne()
    .usingSlug(slug)
    .exec((err, alias) => {
      if (err) throw err;
      if (alias && alias.slug) {
        res.status(400).json({
          status: 'error',
          error: 'short URL with this slug already exists',
        });
        return;
      }
    });

  createAliasInDB(source, slug);

  res.status(200).json({ status: 'ok', source: source, slug: slug });
  return;
}

async function createURLAliasFromSource(req, res) {
  let alias, slug;
  const source = req.body.source;
  if (!source) {
    res.status(400).json({
      status: 'error',
      error: 'required source params in request body',
    });
    return;
  }

  try {
    await URLAlias.findOne()
      .usingSource(source)
      .exec((err, alias) => {
        if (err) throw err;

        if (alias && alias.slug) {
          res.render('success-page', { source: source, slug: alias.slug });
        } else {
          slug = buildSlug();
          createAliasInDB(source, slug);
          res.render('success-page', { source: source, slug: slug });
        }
      });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  redirectUsingSlug,
  getAliases,
  createURLAliasFromSource,
  createURLAlias,
  mainpage,
};
