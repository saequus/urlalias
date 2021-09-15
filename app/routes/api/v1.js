const express = require('express');
const router = express.Router();
const statsMiddleware = require('../../middleware/stats');
const {
  getAliasesJSON,
  newAliasJSON,
  newAliasUsingSourceJSON,
  deleteAliasJSON,
} = require('../../controller/api');

router.get('/urls', statsMiddleware('api_v1_urls_get'), getAliasesJSON);
router.post('/url', statsMiddleware('api_v1_url_post'), newAliasJSON);
router.delete(
  '/url',
  statsMiddleware('api_v1_url_delete'),
  async (req, res, next) => {
    async function run() {
      await deleteAliasJSON(req, res);
    }
    run().catch(next);
  }
);
router.post(
  '/url-using-source',
  statsMiddleware('api_v1_url_from_source'),
  async (req, res, next) => {
    async function run() {
      await newAliasUsingSourceJSON(req, res);
    }
    run().catch(next);
  }
);

module.exports = router;
