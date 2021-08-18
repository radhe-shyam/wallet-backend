const Wallet = require('mongoose').model('Wallet');
const { sendSuccessResponse, sendWrongInputResponse, sendErrorResponse } = require('../../utils/response');
const { getWalletById } = require('./wallet.util');
const { isValidObjectId } = require('./../../utils/utils');

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


const getWallet = async (req, res, next) => {
    try {
        const { walletId } = req.params;
        if (!isValidObjectId(walletId)) {
            return sendWrongInputResponse(req, res, "Invalid Wallet Id");
        }

        const wallet = await getWalletById(walletId);
        if (!wallet) {
            return sendErrorResponse(req, res, 404, "Wallet not found", `Wallet Id ${walletId} not found`);
        }
        return sendSuccessResponse(req, res, wallet);
    } catch (e) {
        next(e);
    }
}

module.exports = {
    createWallet,
    getWallet
}