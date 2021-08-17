const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wallet = new Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        trim: true,
        minLength: [4, 'Name should have minimum length of 4 characters'],
        maxLength: [25, 'Name should have maximum length of 25 characters']
    },
    balance: {
        type: Number,
        required: [true, 'Balance is required'],
        min: [0, 'Balance should not be less than 0'],
        max: [1e6, 'Balance should not be greater than 10,00,000']
    },
    date: {
        type: Date,
        default: Date.now
    },
    transactionId: {
        type: mongoose.Types.ObjectId,
        default: mongoose.Types.ObjectId
    }
}, {
    toObject: {
        transform: function (doc, ret) {
            ret.balance = +ret.balance.toFixed(4);
            ret.id = ret._id;
            delete ret._id;
        }
    },
    toJSON: {
        transform: function (doc, ret) {
            ret.balance = +ret.balance.toFixed(4);
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

mongoose.model('Wallet', wallet);