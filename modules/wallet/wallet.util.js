const Wallet = require('mongoose').model('Wallet');

/**
 * 
 * @param {ObjectId} walletId 
 * @returns {Wallet}
 */
const getWalletById = async (walletId) => {
    try {
        const wallet = await Wallet.findById(walletId);
        return wallet;
    } catch (e) {
        throw e;
    }
}

/**
 * 
 * @param {ObjectId} walletId 
 * @param {Number} amount 
 * @param {Object} session 
 * @returns 
 */
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
    getWalletById,
    transactWallet
}