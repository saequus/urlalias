const { URLAlias, createAliasInDB } = require('../db');
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

// Views

function mainpage(req, res) {
  res.render('pages/main');
}

function newAlias(req, res) {
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

async function newAliasFromSource(req, res) {
  let slug;
  const source = req.body.source;
  if (!source) {
    res.render('pages/error-page', {
      message: 'error: required source params in request body',
    });
    return;
  }

  try {
    await URLAlias.findOne()
      .usingSource(source)
      .exec((err, alias) => {
        if (err) throw err;

        if (alias && alias.slug) {
          res.render('pages/success', { source: source, slug: alias.slug });
        } else {
          slug = buildSlug();
          createAliasInDB(source, slug);
          res.render('pages/success', { source: source, slug: slug });
        }
      });
  } catch (error) {
    return next(error);
  }
}

async function showLatest(req, res) {
  const aliases = [];
  res.render('pages/latest', { aliases: aliases });
}

module.exports = {
  redirectUsingSlug,
  newAliasFromSource,
  newAlias,
  showLatest,
  mainpage,
};
