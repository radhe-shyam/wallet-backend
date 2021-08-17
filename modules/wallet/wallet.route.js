require('./wallet.schema');
const router = require('express').Router();
const { createWallet } = require('./wallet.controller');


router.post('/setup', createWallet);
router.get('/:id');

module.exports = router;