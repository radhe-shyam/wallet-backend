const mongoose = require('mongoose');

/**
 * 
 * @param {String} id 
 * @returns Boolean
 */
const isValidObjectId = id => (mongoose.Types.ObjectId.isValid(id) && (new mongoose.Types.ObjectId(id) == id));

module.exports = {
    isValidObjectId
}