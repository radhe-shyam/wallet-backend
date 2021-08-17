require('./transaction.schema');
const router = require('express').Router();
const Joi = require('joi');
const validation = require('express-joi-validation').createValidator({ passError: true });
const { processTransaction } = require('./transaction.controller');

const transactBodySchema = Joi.object({
    description: Joi.string().min(1).max(50).required(),
    amount: Joi.number().precision(4).strict().required().custom(v => {
        if (v === 0) throw new Error('');
        else return v;
    }).messages({
        'any.custom': '0 is not allowed as amount'
    })
});

router.post('/transact/:walletId', validation.body(transactBodySchema), processTransaction);

module.exports = router;