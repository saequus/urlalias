const { URLAlias, createAliasInDB } = require('../db');
const { buildSlug } = require('../logic/alias');
const cache = require('../lib/cache');
const config = require('../config/default');


async function redirectUsingSlug(req, res) {
  if (!req.params.slug) {
    res.status(404).json({ status: 'error', error: 'not found slug' });
  }

  const cacheKey = `slug_${req.params.slug}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData && cachedData.source) {
    res.redirect(cachedData.source);
    return Promise.resolve();
  }

  await URLAlias.findOne()
    .usingSlug(req.params.slug)
    .exec((err, alias) => {
      if (err) throw err;

      if (alias && alias.source) {
        cache.set(cacheKey, alias, config.cacheTime.REDIRECT_USING_SLUG);
        res.redirect(alias.source);
        return Promise.resolve();
      }

      res
        .status(404)
        .redirect('/')
      return;
    });
}

// Views

async function mainpage(req, res) {
  await res.render('pages/main');
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
