const Wallet = require('mongoose').model('Wallet');
const { sendSuccessResponse } = require('../../utils/response');

const createWallet = async (req, res, next) => {
    try {
        const { name, balance } = req.body;
        const wallet = await new Wallet({
            name,
            balance
        }).save();
        return sendSuccessResponse(res, res, wallet);
    } catch (e) {
        next(e);
    }
}

const transactWallet = async (walletId, amount, session) => {
    try {
        const wallet = await Wallet.findByIdAndUpdate(walletId, {
            $inc: { balance: +(amount) }
        }, { new: true, session });
        return wallet;
    } catch (e) {
        throw e;
    }
}

module.exports = {
    createWallet,
    transactWallet
}