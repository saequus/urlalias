const express = require('express');
const router = express.Router();
const statsMiddleware = require('../../middleware/stats');
const { newAlias, newAliasFromSource } = require('../../controller');
const { getAliasesJSON } = require('../../controller/api');

router.use('/urls', statsMiddleware('api_v1_urls'), getAliasesJSON);
router.post('/url', statsMiddleware('api_v1_url'), newAlias);
router.post(
  '/url-by-source',
  statsMiddleware('api_v1_url_by_source'),
  async (req, res, next) => {
    async function run() {
      await newAliasFromSource(req, res);
    }
    run().catch(next);
  }
);

module.exports = router;
