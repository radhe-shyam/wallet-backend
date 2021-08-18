require('./transaction.schema');
const router = require('express').Router();
const Joi = require('joi');
const validation = require('express-joi-validation').createValidator({ passError: true });
const { processTransaction, fetchTransactionsByPagination, fetchAllTransactions } = require('./transaction.controller');

const transactBodySchema = Joi.object({
    description: Joi.string().min(1).max(50).required(),
    amount: Joi.number().precision(4).strict().required().custom(v => {
        if (v === 0) throw new Error('');
        else return v;
    }).messages({
        'any.custom': '0 is not allowed as amount'
    })
});

const fetchTransactionsByPaginationQuerySchema = Joi.object({
    walletId: Joi.string().required(),
    skip: Joi.number().min(0).required(),
    limit: Joi.number().min(1).max(50).required()
});

router.post('/transact/:walletId', validation.body(transactBodySchema), processTransaction);
router.get('/transactions', validation.query(fetchTransactionsByPaginationQuerySchema), fetchTransactionsByPagination);
router.get('/transactions/all/:walletId', fetchAllTransactions);

module.exports = router;