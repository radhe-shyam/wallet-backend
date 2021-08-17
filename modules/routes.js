const router = require('express').Router();
const walletRoute = require('./wallet/wallet.route');
const transactionRoute = require('./transaction/transaction.route');

router.get('/health', (req, res) => res.send(new Date().toISOString()));
router.use('/wallet', walletRoute);
router.use('', transactionRoute);

module.exports = router;