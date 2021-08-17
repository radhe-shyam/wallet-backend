const mongoose = require('mongoose');
const { transactWallet } = require('./../wallet/wallet.controller');
const { sendWrongInputResponse, sendSuccessResponse, sendErrorResponse } = require('./../../utils/response');
const { isValidObjectId } = require('./../../utils/utils');
const Transaction = require('mongoose').model('Transaction');

const processTransaction = async (req, res, next) => {
    try {
        let { params: { walletId }, body: { amount, description } } = req;

        if (!isValidObjectId(walletId)) {
            return sendWrongInputResponse(req, res, "Invalid Wallet Id");
        }
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const wallet = await transactWallet(walletId, amount, session);
            if (!wallet) {
                await session.abortTransaction();
                return sendErrorResponse(req, res, 404, "Wallet not found", `Wallet Id ${walletId} not found`);
            }
            if (wallet.balance < 0) {
                await session.abortTransaction();
                return sendWrongInputResponse(req, res, "Insufficient balance");
            }
            const transaction = await new Transaction({
                walletId,
                amount,
                balance: wallet.balance,
                description,
                type: amount < 0 ? 'DEBIT' : 'CREDIT'
            }).save({ session });
            await session.commitTransaction();
            return sendSuccessResponse(req, res, {
                balance: transaction.balance,
                transactionId: transaction.transactionId
            });
        } catch (e) {
            await session.abortTransaction();
            throw e;
        } finally {
            session.endSession();
        }
    } catch (e) {
        next(e);
    }

}

module.exports = {
    processTransaction
}