const { URLAlias, createAliasInDB, retrieveAliasesFromDB } = require('../db');
const { buildSlug } = require('../logic/alias');

// REST API

async function getAliasesJSON(req, res) {
  const aliases = await retrieveAliasesFromDB();
  res.status(200).json(aliases);
}

function newAliasJSON(req, res) {
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

async function newAliasFromSourceJSON(req, res) {
  let slug;
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
  getAliasesJSON,
  newAliasFromSourceJSON,
  newAliasJSON,
};
