const mongoose = require('mongoose');
const { transactWallet } = require('./../wallet/wallet.util');
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

const fetchTransactionsByPagination = async (req, res, next) => {
    try {
        const { walletId, skip, limit } = req.query;
        const sortBy = {
            date: -1
        }
        if (!isValidObjectId(walletId)) {
            return sendWrongInputResponse(req, res, "Invalid Wallet Id");
        }
        const transactions = await Transaction.aggregate([
            { $match: { walletId: new mongoose.Types.ObjectId(walletId) } },
            { $sort: sortBy },
            { $skip: skip },
            { $limit: limit }
        ]).allowDiskUse(true);
        return sendSuccessResponse(req, res, transactions);
    } catch (e) {
        next(e);
    }
}

const fetchAllTransactions = async (req, res, next) => {
    try {
        const { walletId } = req.params;
        const sortBy = {
            date: -1
        }
        if (!isValidObjectId(walletId)) {
            return sendWrongInputResponse(req, res, "Invalid Wallet Id");
        }
        const transactionCursor = Transaction.aggregate([
            { $match: { walletId: new mongoose.Types.ObjectId(walletId) } },
            { $sort: sortBy }
        ]).allowDiskUse(true).cursor({ batchSize: 100 }).exec();
        res.write('[');
        await transactionCursor.eachAsync(function (doc, i) {
            res.write(JSON.stringify(doc));
        });
        res.write(']');
        res.end();
    } catch (e) {
        next(e);
    }
}
module.exports = {
    processTransaction,
    fetchTransactionsByPagination,
    fetchAllTransactions
}