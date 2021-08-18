require('./wallet.schema');
const router = require('express').Router();
const Joi = require('joi');
const validation = require('express-joi-validation').createValidator({ passError: true });
const { createWallet, getWallet } = require('./wallet.controller');

const createWalletBodySchema = Joi.object({
    balance: Joi.number().precision(4).strict().required(),
    name: Joi.string()
});

router.post('/setup', validation.body(createWalletBodySchema), createWallet);
router.get('/:walletId', getWallet);

module.exports = router;