const {
  URLAlias,
  createAliasInDB,
  retrieveAliasesFromDB,
  deleteAliasUsingSourceInDB,
  deleteAliasUsingSlugInDB,
  updateAliasUsingSlugInDB,
  updateAliasUsingSourceInDB,
} = require('../db');
const { buildSlug } = require('../logic/alias');

// REST API

async function retrieveAliasesJSON(req, res) {
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

async function newAliasUsingSourceJSON(req, res) {
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
          res
            .status(200)
            .json({ status: 'already_existed', slug: alias.slug, source });
        } else {
          slug = buildSlug();
          createAliasInDB(source, slug);
          res.status(201).json({ status: 'created', slug, source });
        }
      });
  } catch (error) {
    return next(error);
  }
}

async function deleteAliasJSON(req, res) {
  const slug = req.body.slug;
  const source = req.body.source;

  try {
    if (slug) {
      await URLAlias.findOne()
        .usingSlug(slug)
        .exec((err, alias) => {
          if (err) throw err;
          if (alias) {
            deleteAliasUsingSlugInDB(slug);
            res.status(200).json({
              status: 'deleted',
              slug: alias.slug,
              source: alias.source,
            });
          } else {
            res.status(404).json({ status: 'not found', slug: slug });
          }
        });
    } else if (source) {
      await URLAlias.findOne()
        .usingSource(source)
        .exec((err, alias) => {
          if (err) throw err;
          if (alias) {
            deleteAliasUsingSourceInDB(slug);
            res.status(200).json({
              status: 'deleted',
              slug: alias.slug,
              source: alias.source,
            });
          } else {
            res.status(404).json({ status: 'not found', source: source });
          }
        });
    } else {
      res.status(200).json({
        status: 'error',
        error: 'slug or source body params required',
      });
    }
  } catch (error) {
    return next(error);
  }
}

async function updateAliasJSON(req, res) {
  const slug = req.body.slug;
  const source = req.body.source;
  const using = req.body.using;

  if (!['slug', 'source'].includes(using)) {
    res.status(400).json({
      status: 'error',
      error: 'using parameter should be one of slug or source',
    });
    return;
  }

  try {
    if (slug && using === 'slug') {
      await URLAlias.findOne()
        .usingSlug(slug)
        .exec((err, alias) => {
          if (err) throw err;
          if (alias) {
            updateAliasUsingSlugInDB({ source, slug });
            res.status(200).json({
              status: 'updated',
              slug: slug,
              source: source,
            });
          } else {
            res.status(404).json({ status: 'not found', slug: slug });
          }
        });
    } else if (source && using === 'source') {
      await URLAlias.findOne()
        .usingSource(source)
        .exec((err, alias) => {
          if (err) throw err;
          if (alias) {
            updateAliasUsingSourceInDB({ source, slug });
            res.status(200).json({
              status: 'updated',
              slug: slug,
              source: source,
            });
          } else {
            res.status(404).json({ status: 'not found', slug: slug });
          }
        });
    } else {
      res.status(400).json({
        status: 'error',
        error:
          'using parameter, and one of slug or source body parameters required',
      });
    }
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  retrieveAliasesJSON,
  newAliasUsingSourceJSON,
  newAliasJSON,
  deleteAliasJSON,
  updateAliasJSON,
};
