const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transaction = new Schema({
    walletId: {
        type: mongoose.Types.ObjectId,
        ref: 'Wallet'
    },
    amount: {
        type: Number,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    type: {
        type: String,
        enum: ['CREDIT', 'DEBIT']
    },
    transactionId: {
        type: mongoose.Types.ObjectId,
        default: mongoose.Types.ObjectId
    }
}, {
    toObject: {
        transform: function (doc, ret) {
            ret.balance = +ret.balance.toFixed(4);
        }
    },
    toJSON: {
        transform: function (doc, ret) {
            ret.balance = +ret.balance.toFixed(4);
        }
    }
});

transaction.index({
    walletId: 1
});

mongoose.model('Transaction', transaction);