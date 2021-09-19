const express = require('express');
const router = express.Router();
const statsMiddleware = require('../middleware/stats');
const {
  mainpage,
  newAliasFromSource,
  redirectUsingSlug,
  showLatest,
} = require('../controller');

router.post('/new', statsMiddleware('new'), async (req, res, next) => {
  async function run() {
    await newAliasFromSource(req, res);
  }
  run().catch(next);
});
router.post('/latest', statsMiddleware('last'), async (req, res, next) => {
  async function run() {
    await showLatest(req, res);
  }
  run().catch(next);
});
router.get('/:slug', statsMiddleware('redirect_alias'),  async (req, res, next) => {
  async function run() {
    await redirectUsingSlug(req, res);
  }
  run().catch(next);
});
router.get('/', statsMiddleware('mainpage'), async (req, res, next) => {
  async function run() {
    await mainpage(req, res);
  }
  run().catch(next);
});

module.exports = router;
