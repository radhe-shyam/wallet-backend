const mongoose = require('mongoose');

/**
 * 
 * @param {String} id 
 * @returns Boolean
 */
const isValidObjectId = id => (mongoose.Types.ObjectId.isValid(id) && (new mongoose.Types.ObjectId(id) == id));

/**
 * To check if environment is prod or not
 * @returns Boolean
 */
const isProd = () => process.env.NODE_ENV === 'PROD';

module.exports = {
    isValidObjectId,
    isProd
}